// Package labstacknetworks is the official Go SDK for the LabStack Labs and
// Provider APIs. See https://integration.labstack.in/api-docs for the
// published reference this client was built from.
package labstacknetworks

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

// DefaultBaseURL is used when Client.BaseURL is left empty.
const DefaultBaseURL = "https://integration.labstack.in"

// httpDoer is the seam over *http.Client so Client can be unit tested
// without a real network call.
type httpDoer interface {
	Do(req *http.Request) (*http.Response, error)
}

// Client is the entry point to the LabStack APIs.
type Client struct {
	APIKey  string
	BaseURL string

	HTTPClient httpDoer

	Labs     *LabsResource
	Provider *ProviderResource
}

// NewClient builds a Client authenticated with apiKey. Pass "" for baseURL
// to use DefaultBaseURL.
func NewClient(apiKey string, baseURL string) (*Client, error) {
	if apiKey == "" {
		return nil, errors.New("labstacknetworks: NewClient requires an apiKey")
	}
	if baseURL == "" {
		baseURL = DefaultBaseURL
	}

	c := &Client{
		APIKey:     apiKey,
		BaseURL:    strings.TrimRight(baseURL, "/"),
		HTTPClient: http.DefaultClient,
	}
	c.Labs = &LabsResource{client: c}
	c.Provider = &ProviderResource{client: c}
	return c, nil
}

// request performs an HTTP call against the LabStack API and decodes the
// JSON response into a map. query and body may be nil.
func (c *Client) request(method, path string, query url.Values, body any) (map[string]any, error) {
	fullURL := c.BaseURL + path
	if len(query) > 0 {
		fullURL += "?" + query.Encode()
	}

	var bodyReader io.Reader
	if body != nil {
		encoded, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("labstacknetworks: failed to encode request body: %w", err)
		}
		bodyReader = bytes.NewReader(encoded)
	}

	req, err := http.NewRequest(method, fullURL, bodyReader)
	if err != nil {
		return nil, fmt.Errorf("labstacknetworks: failed to build request: %w", err)
	}
	req.Header.Set("ls-api-key", c.APIKey)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("labstacknetworks: request failed: %w", err)
	}
	defer resp.Body.Close()

	rawBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("labstacknetworks: failed to read response: %w", err)
	}

	var data map[string]any
	if len(rawBody) > 0 {
		_ = json.Unmarshal(rawBody, &data) // a non-JSON body is handled below via status/data checks
	}
	if data == nil {
		data = map[string]any{}
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 || data["status"] == "failure" {
		message := fmt.Sprintf("labstack API request failed with status %d", resp.StatusCode)
		if errMsg, ok := data["error"].(string); ok && errMsg != "" {
			message = errMsg
		}
		return nil, &APIError{Status: resp.StatusCode, URL: fullURL, Message: message}
	}

	return data, nil
}

// query is a small helper for building url.Values while skipping empty/nil
// values, since Go has no optional-arguments syntax.
type query struct {
	values url.Values
}

func newQuery() *query {
	return &query{values: url.Values{}}
}

func (q *query) set(key string, value any) *query {
	if value == nil {
		return q
	}
	switch v := value.(type) {
	case string:
		if v == "" {
			return q
		}
		q.values.Set(key, v)
	default:
		q.values.Set(key, fmt.Sprintf("%v", v))
	}
	return q
}

func (q *query) build() url.Values {
	return q.values
}
