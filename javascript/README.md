# @labstacknetworks/sdk

Official Node.js SDK for the LabStack **Labs** and **Provider** APIs, generated to match the published docs at
[integration.labstack.in/api-docs](https://integration.labstack.in/api-docs).

## Install

```bash
npm install @labstacknetworks/sdk
```

## Usage

```ts
import { LabStackClient } from "@labstacknetworks/sdk";

const client = new LabStackClient({
    apiKey: process.env.LABSTACK_API_KEY!,
    // baseUrl: "https://integration.labstack.in", // optional, this is the default
});

const { labs } = await client.labs.getLabs();

const { specialities } = await client.provider.getSpecialities({ providerType: "DOCTOR" });

const { orderId } = await client.labs.placeOrder({
    orderType: "HOME_COLLECTION",
    appointment: "2026-06-01T11:00:00+05:30",
    packageIds: ["LSP10003"],
    name: "John Doe",
    email: "john@example.com",
    gender: "MALE",
    mobile: "9999999999",
    pincode: "560035",
});
```

Every method throws `LabStackApiError` (with `.status` and `.url`) on a non-2xx response or a `{status: "failure"}` body.

## Resources

- `client.labs` — availability/serviceability, lab & package catalog, order lifecycle (place/cancel/reschedule/report), health camps.
- `client.provider` — speciality/provider discovery, appointment booking (book/cancel/reschedule), documents, prescriptions, video meeting links.

See `spec/labs.openapi.json` and `spec/provider.openapi.json` at the repo root for the authoritative endpoint definitions this SDK was built from.

## Development

```bash
npm install
npm run build
npm test
```
