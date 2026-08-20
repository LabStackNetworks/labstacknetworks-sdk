package labstacknetworks

import "fmt"

// APIError is returned for any non-2xx response or a body with
// {"status": "failure"}.
type APIError struct {
	Status  int
	URL     string
	Message string
}

func (e *APIError) Error() string {
	return fmt.Sprintf("labstack: %s (status %d, url %s)", e.Message, e.Status, e.URL)
}
