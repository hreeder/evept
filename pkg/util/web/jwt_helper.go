package web

import (
	"context"
	"net/http"

	"github.com/dgrijalva/jwt-go"
)

// RequestProperties represents any information we can parse from a request
type RequestProperties struct {
	Auth0User string
}

// RequestParser does some of the repetitive work around parsing out information from the JWTs we receive from Auth0
func RequestParser(rw http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	user := r.Context().Value("user")
	claims := user.(*jwt.Token).Claims.(jwt.MapClaims)
	properties := &RequestProperties{
		Auth0User: claims["sub"].(string),
	}

	newRequest := r.WithContext(context.WithValue(r.Context(), "requestProperties", properties))
	*r = *newRequest

	next(rw, r)
}
