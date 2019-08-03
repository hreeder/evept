package routes

import (
	"fmt"
	"net/http"

	"github.com/hreeder/evept/pkg/util/db"
	"github.com/hreeder/evept/pkg/util/eveesi"
	"github.com/hreeder/evept/pkg/util/queue"
	"github.com/hreeder/evept/pkg/util/web"

	"github.com/juju/loggo"
)

// Config represents quick access to global configs necessary
type Config struct {
	DBConfig    *db.Config
	ESIConfig   *eveesi.Config
	QueueConfig *queue.Config
	WebConfig   *web.Config
	Logger      loggo.Logger
}

// Index is mounted at /
func (c *Config) Index(w http.ResponseWriter, req *http.Request) {
	props := req.Context().Value("requestProperties").(*web.RequestProperties)

	web.ReturnJSON(w, &web.GenericMessageResponse{
		Message: fmt.Sprintf("Hello, %v", props.Auth0User),
	})
}
