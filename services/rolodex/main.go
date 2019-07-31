package main

import (
	"fmt"
	"os"

	"github.com/hreeder/evept/pkg/util/common"
	"github.com/hreeder/evept/pkg/util/web"
	"github.com/hreeder/evept/services/rolodex/routes"

	"github.com/gorilla/mux"
	"github.com/juju/loggo"
	"github.com/urfave/negroni"
)

func main() {
	fmt.Println("Starting Rolodex")
	logger := loggo.GetLogger("evept.rolodex")

	// Initialize App
	r := &routes.Config{
		DBConfig:    common.GetDBConfig(),
		ESIConfig:   common.GetESIConfig(),
		QueueConfig: common.GetQueueConfig(logger),
		WebConfig:   common.GetWebUtilConfig(),
		Logger:      logger,
	}

	logLevel, _ := loggo.ParseLevel("INFO")
	if os.Getenv("EVEPT_DEBUG") != "" {
		logLevel, _ = loggo.ParseLevel("DEBUG")
	}
	r.Logger.SetLogLevel(logLevel)

	// Begin HTTP work
	mountedAt := "/rolodex"

	router := mux.NewRouter()

	commonMw := negroni.Classic()

	authenticatedMw := commonMw.With(
		r.WebConfig.CORS(),
		negroni.HandlerFunc(r.WebConfig.GetJWTMiddleware().HandlerWithNext),
		negroni.HandlerFunc(web.RequestParser),
	)
	commonMw.UseHandler(router)

	subRouter := mux.NewRouter().PathPrefix(mountedAt).Subrouter().StrictSlash(true)
	subRouter.HandleFunc("/", r.Index)
	subRouter.HandleFunc("/characters", r.ListCharacters)
	subRouter.HandleFunc("/esi/addchar", r.AddCharacter).Methods("POST")

	router.PathPrefix(mountedAt).Handler(authenticatedMw.With(
		negroni.Wrap(subRouter),
	))
	commonMw.Run(":8500")
}
