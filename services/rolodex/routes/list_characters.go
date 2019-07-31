package routes

import (
	"net/http"

	"github.com/hreeder/evept/pkg/util/web"
)

type CharacterPlaceholder struct {
}

type CharacterList struct {
	Characters []CharacterPlaceholder `json:"characters"`
}

// ListCharacters is mounted at /characters
func (c *Config) ListCharacters(w http.ResponseWriter, req *http.Request) {
	// props := req.Context().Value("requestProperties").(*web.RequestProperties)

	web.ReturnJSON(w, &CharacterList{
		Characters: []CharacterPlaceholder{},
	})
}
