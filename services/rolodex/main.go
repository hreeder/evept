package main

import (
	"fmt"
	"net/http"

	"github.com/hreeder/evept/pkg/util/common"
	"github.com/hreeder/evept/pkg/util/web"
	"github.com/hreeder/evept/services/rolodex/routes"

	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

func main() {
	fmt.Println("Starting Rolodex")

	// Initialize App
	r := &routes.Config{
		DBConfig:    common.GetDBConfig(),
		ESIConfig:   common.GetESIConfig(),
		QueueConfig: common.GetQueueConfig(),
		WebConfig:   common.GetWebUtilConfig(),
	}

	// Begin HTTP work
	mountedAt := "/rolodex"

	router := mux.NewRouter()
	middlewares := negroni.Classic()
	middlewares.Use(negroni.HandlerFunc(r.WebConfig.GetJWTMiddleware().HandlerWithNext))
	middlewares.Use(negroni.HandlerFunc(web.RequestParser))
	middlewares.UseHandler(router)

	subRouter := mux.NewRouter().PathPrefix(mountedAt).Subrouter().StrictSlash(true)
	subRouter.HandleFunc("/", r.Index)
	subRouter.HandleFunc("/esi/addchar", r.AddCharacter).Methods("POST")

	router.PathPrefix(mountedAt).Handler(subRouter)
	http.ListenAndServe(":8500", middlewares)
}
