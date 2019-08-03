package routes

import (
	"net/http"

	evept "github.com/hreeder/evept/pkg/shared"
	"github.com/hreeder/evept/pkg/util/web"
)

type CharacterList struct {
	Characters []evept.Character `json:"characters"`
}

// ListCharacters is mounted at /characters
func (c *Config) ListCharacters(w http.ResponseWriter, req *http.Request) {
	props := req.Context().Value("requestProperties").(*web.RequestProperties)

	db := c.DBConfig.Get()

	characters := []evept.Character{}
	err := db.Select(&characters, `SELECT * FROM public.characters WHERE owner=$1`, props.Auth0User)
	if err != nil {
		web.ReturnJSONWithCode(w, http.StatusInternalServerError, &web.GenericErrorMessageResponse{
			Message:      "failed to get characters",
			ErrorMessage: err.Error(),
		})
		return
	}

	web.ReturnJSON(w, &CharacterList{
		Characters: characters,
	})
}
