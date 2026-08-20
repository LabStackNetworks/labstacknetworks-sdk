# labstacknetworks-sdk

Official client SDKs for the LabStack APIs published at [integration.labstack.in/api-docs](https://integration.labstack.in/api-docs) — **Labs** and **Provider**.

Every SDK wraps the same two resources over HTTP (base URL `https://integration.labstack.in`), authenticated with an `ls-api-key` header issued by LabStack:

- `labs` — availability/serviceability, lab & package catalog, order lifecycle (place/cancel/reschedule/report), health camps. 27 endpoints.
- `provider` — speciality/provider discovery, appointment booking (book/cancel/reschedule), documents, prescriptions, video meeting links. 23 endpoints.

The raw OpenAPI specs this was built from are checked into [`spec/`](spec/) — pulled directly from the live docs, not hand-transcribed.

## Packages

| Language   | Directory      | Status      |
| ---------- | -------------- | ----------- |
| JavaScript | [`javascript/`](javascript/) | available |
| Python     | [`python/`](python/) | available |
| Go         | [`go/`](go/)   | available   |
| Java       | [`java/`](java/) | available |

## Getting an API key

Request an API key from your LabStack account manager or contact@labstack.in.
