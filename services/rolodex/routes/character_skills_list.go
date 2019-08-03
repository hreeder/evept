package routes

import (
	"net/http"

	"github.com/gorilla/mux"

	evept "github.com/hreeder/evept/pkg/shared"
	"github.com/hreeder/evept/pkg/util/web"
)

type SkillsResponse struct {
	CharacterID string                 `json:"characterId"`
	Skills      []evept.CharacterSkill `json:"skills"`
}

// ListCharacterSkills is mounted at /characters/{characterID}/skills
func (c *Config) ListCharacterSkills(w http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	props := req.Context().Value("requestProperties").(*web.RequestProperties)

	db := c.DBConfig.Get()
	characterID := vars["characterID"]

	skills := []evept.CharacterSkill{}
	err := db.Select(&skills, `SELECT cs.*
	FROM "characterSkills" cs
	JOIN "characters" c
	  ON c."characterID"=cs."characterID"
   WHERE c."owner"=$1
	 AND cs."characterID"=$2;`, props.Auth0User, characterID)

	if err != nil {
		web.ReturnJSONWithCode(w, http.StatusInternalServerError, &web.GenericErrorMessageResponse{
			Message:      "failed to get skills",
			ErrorMessage: err.Error(),
		})
		return
	}

	web.ReturnJSON(w, &SkillsResponse{
		CharacterID: characterID,
		Skills:      skills,
	})
}
