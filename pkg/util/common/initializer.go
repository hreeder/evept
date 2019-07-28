package common

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/hreeder/evept/pkg/util/db"
	"github.com/hreeder/evept/pkg/util/web"
)

func getRequiredEnvVar(key string) string {
	value := os.Getenv(key)
	if value == "" {
		panic(fmt.Sprintf("Required Environment Variable %v Not Set!", key))
	}
	return value
}

// GetWebUtilConfig returns a web.Config object ready to go
func GetWebUtilConfig() *web.Config {
	domain := getRequiredEnvVar("EVEPT_AUTH0_DOMAIN")
	identifier := getRequiredEnvVar("EVEPT_AUTH0_API_IDENTIFIER")

	return &web.Config{
		Auth0Domain:   domain,
		APIIdentifier: identifier,
	}
}

// GetDBConfig returns a db.Config object ready to go
func GetDBConfig() *db.Config {
	var credsDir string
	credsOverride := os.Getenv("EVEPT_DBCREDS_OVERRIDE")
	if credsOverride != "" {
		credsDir = credsOverride
	} else {
		credsDir = "/etc/evept/db/credentials"
	}
	// Get Creds
	username, err := ioutil.ReadFile(fmt.Sprintf("%v/POSTGRES_USER", credsDir))
	if err != nil {
		panic(err)
	}
	password, err := ioutil.ReadFile(fmt.Sprintf("%v/POSTGRES_PASSWORD", credsDir))
	if err != nil {
		panic(err)
	}

	hostname := getRequiredEnvVar("EVEPT_DB_HOST")
	databaseName := getRequiredEnvVar(("EVEPT_DB_NAME"))
	schemaName := getRequiredEnvVar("EVEPT_DB_SCHEMA")

	return &db.Config{
		Username:     string(username),
		Password:     string(password),
		HostName:     hostname,
		DatabaseName: databaseName,
		SchemaName:   schemaName,
	}
}
