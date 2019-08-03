package routes

import (
	"net/http"

	"github.com/gorilla/mux"

	evept "github.com/hreeder/evept/pkg/shared"
	"github.com/hreeder/evept/pkg/util/web"
)

type SkillqueueResponse struct {
	CharacterID string                           `json:"characterId"`
	SkillQueue  []evept.CharacterSkillqueueEntry `json:"skillqueue"`
}

// ListCharacterSkillQueue is mounted at /characters/{characterID}/skillqueue
func (c *Config) ListCharacterSkillQueue(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	props := req.Context().Value("requestProperties").(*web.RequestProperties)

	db := c.DBConfig.Get()
	characterID := vars["characterID"]

	queue := []evept.CharacterSkillqueueEntry{}
	err := db.Select(&queue, `SELECT csq.*
	FROM "characterSkillQueue" csq
	JOIN "characters" c
	  ON c."characterID"=csq."characterID"
   WHERE c."owner"=$1
	 AND csq."characterID"=$2;`, props.Auth0User, characterID)

	if err != nil {
		web.ReturnJSONWithCode(w, http.StatusInternalServerError, &web.GenericErrorMessageResponse{
			Message:      "failed to get skills",
			ErrorMessage: err.Error(),
		})
		return
	}

	web.ReturnJSON(w, &SkillqueueResponse{
		CharacterID: characterID,
		SkillQueue:  queue,
	})
}
