package web

import (
	"os"

	"github.com/rs/cors"
)

// CORS returns a CORS middleware
func (c *Config) CORS() *cors.Cors {
	debug := false

	if os.Getenv("EVEPT_DEBUG") != "" {
		debug = true
	}

	return cors.New(cors.Options{
		AllowedOrigins: c.AllowedCORSOrigins,
		AllowedHeaders: []string{
			"Authorization",
			// The below are the defaults from the package
			"Origin",
			"Accept",
			"Content-Type",
			"X-Requested-With",
		},
		Debug: debug,
	})
}
