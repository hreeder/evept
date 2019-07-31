package web

// Config represents the required configuration for any web utility
type Config struct {
	Auth0Domain        string
	APIIdentifier      string
	AllowedCORSOrigins []string
}

// Get returns a configured web util collection
func Get(domain string, identifier string, corsOrigins []string) *Config {
	return &Config{
		Auth0Domain:        domain,
		APIIdentifier:      identifier,
		AllowedCORSOrigins: corsOrigins,
	}
}
