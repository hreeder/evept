package web

// GenericMessageResponse does what the name suggests
type GenericMessageResponse struct {
	Message string
}

// GenericErrorMessageResponse does what the name suggests
type GenericErrorMessageResponse struct {
	Message      string
	ErrorMessage string
}