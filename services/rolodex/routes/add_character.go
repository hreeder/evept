package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/hreeder/evept/pkg/util/web"
)

// AddCharacterExpectedInput represents what we expect to receive from a client
type AddCharacterExpectedInput struct {
	Code string `json:"code"`
}

// BarebonesCharacterEntry represents the bare minimum we need to insert into our database
// such that it can be updated at a later time
type BarebonesCharacterEntry struct {
	CharacterID   int32  `db:"characterID"`
	Owner         string `db:"owner"`
	CharacterName string `db:"characterName"`
	RefreshToken  string `db:"refreshToken"`
}

// AddCharacter is mounted at /esi/addchar
func (c *Config) AddCharacter(w http.ResponseWriter, req *http.Request) {
	props := req.Context().Value("requestProperties").(*web.RequestProperties)

	decoder := json.NewDecoder(req.Body)
	var data AddCharacterExpectedInput
	err := decoder.Decode(&data)
	if err != nil {
		web.ReturnJSONWithCode(w, http.StatusInternalServerError, &GenericMessageResponse{
			Message: err.Error(),
		})
	}

	authenticator := c.ESIConfig.GetSSOAuthenticator()
	token, err := authenticator.TokenExchange(data.Code)
	if err != nil {
		web.ReturnJSONWithCode(w, http.StatusInternalServerError, &GenericMessageResponse{
			Message: err.Error(),
		})
	}

	tokenSource := authenticator.TokenSource(token)

	verified, err := authenticator.Verify(tokenSource)
	if err != nil {
		web.ReturnJSONWithCode(w, http.StatusInternalServerError, &GenericMessageResponse{
			Message: err.Error(),
		})
	}

	newCharacter := &BarebonesCharacterEntry{
		CharacterID:   verified.CharacterID,
		CharacterName: verified.CharacterName,
		Owner:         props.Auth0User,
		RefreshToken:  data.Code,
	}

	db := c.DBConfig.Get()
	tx := db.MustBegin()
	tx.NamedExec(`INSERT INTO public.characters (
		"characterID",
		"owner",
		"characterName",
		"refreshToken"
	) VALUES (
		:characterID,
		:owner,
		:characterName,
		:refreshToken
	) ON CONFLICT ("characterID") DO UPDATE
	SET "refreshToken" = excluded."refreshToken"`, newCharacter)
	tx.Commit()

	// client := redis.NewClusterClient(c.QueueConfig.RedisClusterOptions())
	// client.Ping()
	// client.Incr("testkey")

	web.ReturnJSON(w, &GenericMessageResponse{
		Message: fmt.Sprintf("Successfully added %v (%d)", newCharacter.CharacterName, newCharacter.CharacterID),
	})
}
