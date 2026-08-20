# labstacknetworks-sdk (Go)

Official Go SDK for the LabStack **Labs** and **Provider** APIs, generated to match the published docs at
[integration.labstack.in/api-docs](https://integration.labstack.in/api-docs).

## Install

```bash
go get github.com/LabStackNetworks/labstacknetworks-sdk/go
```

## Usage

```go
import labstacknetworks "github.com/LabStackNetworks/labstacknetworks-sdk/go"

client, err := labstacknetworks.NewClient(os.Getenv("LABSTACK_API_KEY"), "")
// second arg is baseURL; "" defaults to https://integration.labstack.in
if err != nil {
    log.Fatal(err)
}

labs, err := client.Labs.GetLabs("")

specialities, err := client.Provider.GetSpecialities("DOCTOR", "")

order, err := client.Labs.PlaceOrder(map[string]any{
    "orderType":   "HOME_COLLECTION",
    "appointment": "2026-06-01T11:00:00+05:30",
    "packageIds":  []string{"LSP10003"},
    "name":        "John Doe",
    "email":       "john@example.com",
    "gender":      "MALE",
    "mobile":      "9999999999",
    "pincode":     "560035",
})
```

Every method returns a `*labstacknetworks.APIError` (via `errors.As`) on a non-2xx response or a
`{"status": "failure"}` body, with `.Status`, `.URL` and `.Message`.

Request bodies for `PlaceOrder`, `PlaceCampOrder` and `BookAppointment` are plain `map[string]any` using the exact
field names from the API (camelCase, e.g. `orderType`, `packageIds`) — see `spec/labs.openapi.json` and
`spec/provider.openapi.json` at the repo root for the full field list.

## Resources

- `client.Labs` — availability/serviceability, lab & package catalog, order lifecycle (place/cancel/reschedule/report), health camps.
- `client.Provider` — speciality/provider discovery, appointment booking (book/cancel/reschedule), documents, prescriptions, video meeting links.

## Development

```bash
go build ./...
go vet ./...
go test ./...
```
