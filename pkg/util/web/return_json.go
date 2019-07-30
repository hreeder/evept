package web

import (
	"encoding/json"
	"net/http"
)

// ReturnJSON is a helper function to easily return JSON data
func ReturnJSON(w http.ResponseWriter, data interface{}) {
	js, err := json.Marshal(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

// ReturnJSONWithCode is a helper function to easily return JSON data with a given code
func ReturnJSONWithCode(w http.ResponseWriter, c int, data interface{}) {
	w.WriteHeader(c)
	ReturnJSON(w, data)
}
