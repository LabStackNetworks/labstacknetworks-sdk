# labstacknetworks-sdk (Java)

Official Java SDK for the LabStack **Labs** and **Provider** APIs, generated to match the published docs at
[integration.labstack.in/api-docs](https://integration.labstack.in/api-docs).

## Install

Maven:

```xml
<dependency>
    <groupId>in.labstack</groupId>
    <artifactId>labstacknetworks-sdk</artifactId>
    <version>0.1.0</version>
</dependency>
```

## Usage

```java
import in.labstack.sdk.LabStackClient;
import in.labstack.sdk.Params;

import java.util.Map;

LabStackClient client = new LabStackClient(System.getenv("LABSTACK_API_KEY"));
// new LabStackClient(apiKey, "https://integration.labstack.in") // default base URL shown

Map<String, Object> labs = client.labs.getLabs(null);

Map<String, Object> specialities = client.provider.getSpecialities("DOCTOR", null);

Map<String, Object> order = client.labs.placeOrder(Params.of()
        .put("orderType", "HOME_COLLECTION")
        .put("appointment", "2026-06-01T11:00:00+05:30")
        .put("name", "John Doe")
        .put("email", "john@example.com")
        .put("gender", "MALE")
        .put("mobile", "9999999999")
        .put("pincode", "560035")
        .build());
```

Every method throws `LabStackApiError` (with `.getStatus()` and `.getUrl()`) on a non-2xx response or a
`{"status": "failure"}` body.

Request bodies for `placeOrder`, `placeCampOrder` and `bookAppointment` are built with `Params` using the exact
field names from the API (camelCase, e.g. `orderType`, `packageIds`) — see `spec/labs.openapi.json` and
`spec/provider.openapi.json` at the repo root for the full field list.

## Resources

- `client.labs` — availability/serviceability, lab & package catalog, order lifecycle (place/cancel/reschedule/report), health camps.
- `client.provider` — speciality/provider discovery, appointment booking (book/cancel/reschedule), documents, prescriptions, video meeting links.

## Development

```bash
mvn test
```
