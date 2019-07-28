package main

import (
	"fmt"
	"net/http"

	"github.com/hreeder/evept/util/common"
	"github.com/hreeder/evept/util/web"

	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

func main() {
	fmt.Println("Starting Rolodex")

	// Initialize App
	webutils := common.GetWebUtilConfig()

	// Begin HTTP work
	router := mux.NewRouter()
	middlewares := negroni.Classic()
	middlewares.Use(negroni.HandlerFunc(webutils.GetJWTMiddleware().HandlerWithNext))
	middlewares.Use(negroni.HandlerFunc(web.RequestParser))
	middlewares.UseHandler(router)

	router.HandleFunc("/", func(w http.ResponseWriter, req *http.Request) {
		props := req.Context().Value("requestProperties").(*web.RequestProperties)
		fmt.Println(props.Auth0User)

		fmt.Fprintf(w, "This is an authenticated request")
	})

	http.ListenAndServe(":8500", middlewares)
}
