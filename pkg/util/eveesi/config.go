package eveesi

import (
	"net/http"
	"time"
)

// Config represents the necessary configuration for GoESI
type Config struct {
	ClientID     string
	ClientSecret string
	UserAgent    string
	CallbackURL  string
}

func (c *Config) httpClient() *http.Client {
	client := &http.Client{
		Timeout: time.Second * 30,
	}
	return client
}
