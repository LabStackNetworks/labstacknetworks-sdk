import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { LabStackClient } from "./client.js";
import { LabStackApiError } from "./errors.js";

describe("LabStackClient", () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it("throws if apiKey is missing", () => {
        expect(() => new LabStackClient({ apiKey: "" })).toThrow(/apiKey/);
    });

    it("defaults to the integration base URL", async () => {
        let capturedUrl = "";
        global.fetch = vi.fn(async (url) => {
            capturedUrl = url.toString();
            return new Response(JSON.stringify({ status: "success", labs: [] }), { status: 200 });
        }) as unknown as typeof fetch;

        const client = new LabStackClient({ apiKey: "test-key" });
        await client.labs.getLabs();

        expect(capturedUrl).toBe("https://integration.labstack.in/api/v1.3/network/getLabs");
    });

    it("sends the ls-api-key header and query params", async () => {
        let capturedHeaders: Headers | undefined;
        let capturedUrl = "";
        global.fetch = vi.fn(async (url, init) => {
            capturedUrl = url.toString();
            capturedHeaders = init?.headers as Headers;
            return new Response(JSON.stringify({ status: "success", labs: [] }), { status: 200 });
        }) as unknown as typeof fetch;

        const client = new LabStackClient({ apiKey: "test-key" });
        await client.labs.getLabs({ labIds: "1,2" });

        expect(capturedUrl).toBe("https://integration.labstack.in/api/v1.3/network/getLabs?labIds=1%2C2");
        expect((capturedHeaders as unknown as Record<string, string>)["ls-api-key"]).toBe("test-key");
    });

    it("sends a JSON body on POST requests", async () => {
        let capturedBody = "";
        global.fetch = vi.fn(async (_url, init) => {
            capturedBody = init?.body as string;
            return new Response(JSON.stringify({ status: "success", orderId: 1 }), { status: 200 });
        }) as unknown as typeof fetch;

        const client = new LabStackClient({ apiKey: "test-key" });
        await client.labs.placeOrder({
            orderType: "HOME_COLLECTION",
            appointment: "2026-06-01T11:00:00+05:30",
            name: "John Doe",
            email: "john@example.com",
            gender: "MALE",
            mobile: "9999999999",
            pincode: "560035",
        });

        expect(JSON.parse(capturedBody)).toMatchObject({ orderType: "HOME_COLLECTION", name: "John Doe" });
    });

    it("throws LabStackApiError on a non-2xx response", async () => {
        global.fetch = vi.fn(async () => {
            return new Response(JSON.stringify({ status: "failure", error: "Authorisation failed" }), { status: 401 });
        }) as unknown as typeof fetch;

        const client = new LabStackClient({ apiKey: "bad-key" });

        await expect(client.labs.getLabs()).rejects.toBeInstanceOf(LabStackApiError);
        await expect(client.labs.getLabs()).rejects.toMatchObject({ status: 401, message: "Authorisation failed" });
    });

    it("throws LabStackApiError when status is 'failure' even on HTTP 200", async () => {
        global.fetch = vi.fn(async () => {
            return new Response(JSON.stringify({ status: "failure", error: "page is out of range" }), { status: 200 });
        }) as unknown as typeof fetch;

        const client = new LabStackClient({ apiKey: "test-key" });

        await expect(client.labs.getOrders()).rejects.toThrow("page is out of range");
    });
});
