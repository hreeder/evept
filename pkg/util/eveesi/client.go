package eveesi

import "github.com/antihax/goesi"

// GetAPIClient returns a configured goesi API client
func (c *Config) GetAPIClient() *goesi.APIClient {
	client := goesi.NewAPIClient(c.httpClient(), c.UserAgent)
	return client
}

// GetSSOAuthenticator returns a ready-to-use ESI SSO Authenticator
func (c *Config) GetSSOAuthenticator() *goesi.SSOAuthenticator {
	scopes := []string{
		"esi-skills.read_skills.v1",
	}
	authenticator := goesi.NewSSOAuthenticatorV2(c.httpClient(), c.ClientID, c.ClientSecret, c.CallbackURL, scopes)

	return authenticator
}
