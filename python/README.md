# labstacknetworks

Official Python SDK for the LabStack **Labs** and **Provider** APIs, generated to match the published docs at
[integration.labstack.in/api-docs](https://integration.labstack.in/api-docs).

## Install

```bash
pip install labstacknetworks
```

## Usage

```python
import os
from labstacknetworks import LabStackClient

client = LabStackClient(api_key=os.environ["LABSTACK_API_KEY"])
# client = LabStackClient(api_key=..., base_url="https://integration.labstack.in")  # default shown

labs = client.labs.get_labs()

specialities = client.provider.get_specialities(provider_type="DOCTOR")

order = client.labs.place_order(
    orderType="HOME_COLLECTION",
    appointment="2026-06-01T11:00:00+05:30",
    packageIds=["LSP10003"],
    name="John Doe",
    email="john@example.com",
    gender="MALE",
    mobile="9999999999",
    pincode="560035",
)
```

Every method raises `LabStackApiError` (with `.status` and `.url`) on a non-2xx response or a `{"status": "failure"}` body.

Request bodies for `place_order`, `place_camp_order` and `book_appointment` are passed as keyword arguments using the
exact field names from the API (camelCase, e.g. `orderType`, `packageIds`) — see `spec/labs.openapi.json` and
`spec/provider.openapi.json` at the repo root for the full field list.

## Resources

- `client.labs` — availability/serviceability, lab & package catalog, order lifecycle (place/cancel/reschedule/report), health camps.
- `client.provider` — speciality/provider discovery, appointment booking (book/cancel/reschedule), documents, prescriptions, video meeting links.

## Development

```bash
pip install -e ".[dev]"
pytest
```
