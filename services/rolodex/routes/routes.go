package routes

import (
	"fmt"
	"net/http"

	"github.com/hreeder/evept/pkg/util/web"

	"github.com/go-redis/redis"
)

type IndexResponse struct {
	Message string
}

func Index(w http.ResponseWriter, req *http.Request) {
	props := req.Context().Value("requestProperties").(*web.RequestProperties)

	fmt.Println("Connecting")
	client := redis.NewClusterClient(&redis.ClusterOptions{
		Addrs: []string{"evept-queue:6379"},
	})
	fmt.Println("connected")
	client.Ping()
	fmt.Println("pung")
	client.Incr("testkey")
	fmt.Println("Done")

	web.ReturnJSON(w, &IndexResponse{
		Message: fmt.Sprintf("Hello, %v", props.Auth0User),
	})
}
