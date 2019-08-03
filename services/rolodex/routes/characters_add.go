package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

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
		web.ReturnJSONWithCode(w, http.StatusInternalServerError, &web.GenericErrorMessageResponse{
			Message:      "failed processing at decoding data",
			ErrorMessage: err.Error(),
		})
		return
	}

	authenticator := c.ESIConfig.GetSSOAuthenticator()
	token, err := authenticator.TokenExchange(data.Code)
	if err != nil {
		web.ReturnJSONWithCode(w, http.StatusInternalServerError, &web.GenericErrorMessageResponse{
			Message:      "failed processing at performing token exchange with ccp",
			ErrorMessage: err.Error(),
		})
		return
	}

	tokenSource := authenticator.TokenSource(token)

	verified, err := authenticator.Verify(tokenSource)
	if err != nil {
		web.ReturnJSONWithCode(w, http.StatusInternalServerError, &web.GenericErrorMessageResponse{
			Message:      "failed processing at accessing <esi>/verify",
			ErrorMessage: err.Error(),
		})
		return
	}

	newCharacter := &BarebonesCharacterEntry{
		CharacterID:   verified.CharacterID,
		CharacterName: verified.CharacterName,
		Owner:         props.Auth0User,
		RefreshToken:  token.RefreshToken,
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

	c.Logger.Debugf("Character Added, Submitting to Redis")
	c.QueueConfig.SubmitTask("rolodex:update:fast", strconv.FormatInt(int64(newCharacter.CharacterID), 10))

	web.ReturnJSON(w, &web.GenericMessageResponse{
		Message: fmt.Sprintf("Successfully added %v (%d)", newCharacter.CharacterName, newCharacter.CharacterID),
	})
}
