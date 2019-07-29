package routes

import (
	"fmt"
	"net/http"

	"github.com/hreeder/evept/pkg/util/web"

	"github.com/go-redis/redis"
)

// GenericMessageResponse does what the name suggests
type GenericMessageResponse struct {
	Message string
}

// Index is mounted at /
func Index(w http.ResponseWriter, req *http.Request) {
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
