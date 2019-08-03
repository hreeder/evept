package common

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"

	"github.com/hreeder/evept/pkg/util/db"
	"github.com/hreeder/evept/pkg/util/eveesi"
	"github.com/hreeder/evept/pkg/util/queue"
	"github.com/hreeder/evept/pkg/util/web"

	"github.com/juju/loggo"
)

func getRequiredEnvVar(key string) string {
	value := os.Getenv(key)
	if value == "" {
		panic(fmt.Sprintf("Required Environment Variable %v Not Set!", key))
	}
	return value
}

// GetESIConfig returns an eveesi.Config object
func GetESIConfig() *eveesi.Config {
	var esiDir string
	esiDirOverride := os.Getenv("EVEPT_ESIDIR_OVERRIDE")
	if esiDirOverride != "" {
		esiDir = esiDirOverride
	} else {
		esiDir = "/etc/evept/esi"
	}

	ID, err := ioutil.ReadFile(fmt.Sprintf("%v/ID", esiDir))
	if err != nil {
		panic(err)
	}

	secret, err := ioutil.ReadFile(fmt.Sprintf("%v/secret", esiDir))
	if err != nil {
		panic(err)
	}

	return &eveesi.Config{
		ClientID:     string(ID),
		ClientSecret: string(secret),
		UserAgent:    "evePT - Sklullus Dromulus - github.com/hreeder - TweetFleetSlack @sklullus",
		CallbackURL:  "http://localhost:3000/esi/callback",
	}
}

// GetWebUtilConfig returns a web.Config object ready to go
func GetWebUtilConfig() *web.Config {
	domain := getRequiredEnvVar("EVEPT_AUTH0_DOMAIN")
	identifier := getRequiredEnvVar("EVEPT_AUTH0_API_IDENTIFIER")
	allowedCorsOrigins := getRequiredEnvVar("EVEPT_ALLOWED_CORS_ORIGINS")

	return &web.Config{
		Auth0Domain:        domain,
		APIIdentifier:      identifier,
		AllowedCORSOrigins: strings.Split(allowedCorsOrigins, ";"),
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

	return &db.Config{
		Username:     string(username),
		Password:     string(password),
		HostName:     hostname,
		DatabaseName: databaseName,
	}
}

// GetQueueConfig returns a queue.Config object ready to go
func GetQueueConfig(logger loggo.Logger) *queue.Config {
	return &queue.Config{
		Host:    getRequiredEnvVar("EVEPT_QUEUE_HOST"),
		Cluster: os.Getenv("EVEPT_QUEUE_CLUSTER"),
		Logger:  logger,
	}
}
