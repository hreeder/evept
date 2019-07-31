package web

import (
	"github.com/rs/cors"
)

// CORS returns a CORS middleware
func (c *Config) CORS() *cors.Cors {
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
	})
}
