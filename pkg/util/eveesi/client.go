package eveesi

import (
	"time"

	"github.com/antihax/goesi"
	"golang.org/x/oauth2"
)

// GetAPIClient returns a configured goesi API client
func (c *Config) GetAPIClient() *goesi.APIClient {
	client := goesi.NewAPIClient(c.httpClient(), c.UserAgent)
	return client
}

// GetSSOAuthenticator returns a ready-to-use ESI SSO Authenticator
func (c *Config) GetSSOAuthenticator() *goesi.SSOAuthenticator {
	scopes := []string{
		"esi-skills.read_skills.v1",
		"esi-skills.read_skillqueue.v1",
	}
	authenticator := goesi.NewSSOAuthenticatorV2(c.httpClient(), c.ClientID, c.ClientSecret, c.CallbackURL, scopes)

	return authenticator
}

// GetTokenSource returns a TokenSource for authentication
func (c *Config) GetTokenSource(refreshToken string) oauth2.TokenSource {
	authenticator := c.GetSSOAuthenticator()
	return authenticator.TokenSource(&oauth2.Token{
		Expiry:       time.Now(),
		AccessToken:  "",
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
	})
}
