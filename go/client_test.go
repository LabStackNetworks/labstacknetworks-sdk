package labstacknetworks

import (
	"errors"
	"io"
	"net/http"
	"strings"
	"testing"
)

type fakeDoer struct {
	lastRequest *http.Request
	lastBody    string
	status      int
	body        string
}

func (f *fakeDoer) Do(req *http.Request) (*http.Response, error) {
	f.lastRequest = req
	if req.Body != nil {
		b, _ := io.ReadAll(req.Body)
		f.lastBody = string(b)
	}
	return &http.Response{
		StatusCode: f.status,
		Body:       io.NopCloser(strings.NewReader(f.body)),
	}, nil
}

func newTestClient(t *testing.T, doer *fakeDoer) *Client {
	t.Helper()
	c, err := NewClient("test-key", "")
	if err != nil {
		t.Fatalf("NewClient failed: %v", err)
	}
	c.HTTPClient = doer
	return c
}

func TestNewClientRequiresAPIKey(t *testing.T) {
	if _, err := NewClient("", ""); err == nil {
		t.Fatal("expected an error for an empty apiKey")
	}
}

func TestDefaultsToIntegrationBaseURL(t *testing.T) {
	doer := &fakeDoer{status: 200, body: `{"status":"success","labs":[]}`}
	client := newTestClient(t, doer)

	if _, err := client.Labs.GetLabs(""); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	got := doer.lastRequest.URL.String()
	want := "https://integration.labstack.in/api/v1.3/network/getLabs"
	if got != want {
		t.Errorf("got url %q, want %q", got, want)
	}
}

func TestSendsAPIKeyHeaderAndQueryParams(t *testing.T) {
	doer := &fakeDoer{status: 200, body: `{"status":"success","labs":[]}`}
	client := newTestClient(t, doer)

	if _, err := client.Labs.GetLabs("1,2"); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if got := doer.lastRequest.Header.Get("ls-api-key"); got != "test-key" {
		t.Errorf("got ls-api-key header %q, want %q", got, "test-key")
	}
	want := "https://integration.labstack.in/api/v1.3/network/getLabs?labIds=1%2C2"
	if got := doer.lastRequest.URL.String(); got != want {
		t.Errorf("got url %q, want %q", got, want)
	}
}

func TestSendsJSONBodyOnPost(t *testing.T) {
	doer := &fakeDoer{status: 200, body: `{"status":"success","orderId":1}`}
	client := newTestClient(t, doer)

	_, err := client.Labs.PlaceOrder(map[string]any{
		"orderType":   "HOME_COLLECTION",
		"appointment": "2026-06-01T11:00:00+05:30",
		"name":        "John Doe",
		"email":       "john@example.com",
		"gender":      "MALE",
		"mobile":      "9999999999",
		"pincode":     "560035",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !strings.Contains(doer.lastBody, `"orderType":"HOME_COLLECTION"`) {
		t.Errorf("request body missing orderType: %s", doer.lastBody)
	}
	if !strings.Contains(doer.lastBody, `"name":"John Doe"`) {
		t.Errorf("request body missing name: %s", doer.lastBody)
	}
}

func TestReturnsAPIErrorOnNon2xxResponse(t *testing.T) {
	doer := &fakeDoer{status: 401, body: `{"status":"failure","error":"Authorisation failed"}`}
	client := newTestClient(t, doer)

	_, err := client.Labs.GetLabs("")

	var apiErr *APIError
	if !errors.As(err, &apiErr) {
		t.Fatalf("expected *APIError, got %v (%T)", err, err)
	}
	if apiErr.Status != 401 {
		t.Errorf("got status %d, want 401", apiErr.Status)
	}
	if apiErr.Message != "Authorisation failed" {
		t.Errorf("got message %q, want %q", apiErr.Message, "Authorisation failed")
	}
}

func TestReturnsAPIErrorOnFailureStatusEvenWithHTTP200(t *testing.T) {
	doer := &fakeDoer{status: 200, body: `{"status":"failure","error":"page is out of range"}`}
	client := newTestClient(t, doer)

	_, err := client.Labs.GetOrders(nil)

	var apiErr *APIError
	if !errors.As(err, &apiErr) {
		t.Fatalf("expected *APIError, got %v (%T)", err, err)
	}
	if apiErr.Message != "page is out of range" {
		t.Errorf("got message %q, want %q", apiErr.Message, "page is out of range")
	}
}
