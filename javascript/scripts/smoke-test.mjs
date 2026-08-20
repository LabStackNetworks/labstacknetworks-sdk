import { LabStackClient, LabStackApiError } from "../dist/index.js";

const apiKey = process.env.LABSTACK_API_KEY;
const baseUrl = process.env.LABSTACK_BASE_URL;

if (!apiKey) {
    console.error("Set LABSTACK_API_KEY (and optionally LABSTACK_BASE_URL) before running this script.");
    process.exit(1);
}

const client = new LabStackClient({ apiKey, baseUrl });

async function run(label, fn) {
    try {
        const result = await fn();
        console.log(`[ok] ${label}`, JSON.stringify(result).slice(0, 200));
    } catch (e) {
        if (e instanceof LabStackApiError) {
            console.log(`[api-error] ${label} -> ${e.status} ${e.message}`);
        } else {
            console.log(`[error] ${label} ->`, e.message);
        }
    }
}

await run("labs.getStatus", () => client.labs.getStatus());
await run("labs.getLabs", () => client.labs.getLabs());
await run("labs.getTests", () => client.labs.getTests());
await run("provider.getStatus", () => client.provider.getStatus());
await run("provider.getSpecialities", () => client.provider.getSpecialities({ providerType: "DOCTOR" }));
