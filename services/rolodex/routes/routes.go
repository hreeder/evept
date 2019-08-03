package routes

import (
	"fmt"
	"net/http"

	"github.com/hreeder/evept/pkg/util/db"
	"github.com/hreeder/evept/pkg/util/eveesi"
	"github.com/hreeder/evept/pkg/util/queue"
	"github.com/hreeder/evept/pkg/util/web"

	"github.com/go-redis/redis"
	"github.com/juju/loggo"
)

// Config represents quick access to global configs necessary
type Config struct {
	DBConfig    *db.Config
	ESIConfig   *eveesi.Config
	QueueConfig *queue.Config
	WebConfig   *web.Config
	Logger		loggo.Logger
}

// GenericMessageResponse does what the name suggests
type GenericMessageResponse struct {
	Message string
}

// GenericErrorMessageResponse does what the name suggests
type GenericErrorMessageResponse struct {
	Message      string
	ErrorMessage string
}

// Index is mounted at /
func (c *Config) Index(w http.ResponseWriter, req *http.Request) {
	props := req.Context().Value("requestProperties").(*web.RequestProperties)

	client := redis.NewClusterClient(&redis.ClusterOptions{
		Addrs: []string{"evept-queue:6379"},
	})
	client.Ping()
	client.Incr("testkey")

	web.ReturnJSON(w, &GenericMessageResponse{
		Message: fmt.Sprintf("Hello, %v", props.Auth0User),
	})
}
