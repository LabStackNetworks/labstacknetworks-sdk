import { LabStackApiError } from "./errors.js";
import { LabsResource } from "./resources/labs.js";
import { ProviderResource } from "./resources/provider.js";

export interface LabStackClientOptions {
    /** API key issued by LabStack. Sent as the `ls-api-key` header on every request. */
    apiKey: string;
    /** Base URL of the LabStack API. Defaults to https://integration.labstack.in. */
    baseUrl?: string;
}

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export class LabStackClient {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    readonly labs: LabsResource;
    readonly provider: ProviderResource;

    constructor(options: LabStackClientOptions) {
        if (!options.apiKey) {
            throw new Error("LabStackClient requires an apiKey");
        }

        this.apiKey = options.apiKey;
        this.baseUrl = (options.baseUrl ?? "https://integration.labstack.in").replace(/\/+$/, "");

        this.labs = new LabsResource(this);
        this.provider = new ProviderResource(this);
    }

    /** @internal */
    async request<T>(
        method: "GET" | "POST" | "DELETE",
        path: string,
        options: { query?: QueryParams; body?: unknown } = {},
    ): Promise<T> {
        const url = new URL(this.baseUrl + path);

        if (options.query) {
            for (const [key, value] of Object.entries(options.query)) {
                if (value !== undefined && value !== null) {
                    url.searchParams.set(key, String(value));
                }
            }
        }

        const response = await fetch(url, {
            method,
            headers: {
                "ls-api-key": this.apiKey,
                ...(options.body ? { "Content-Type": "application/json" } : {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        const json = await response.json().catch(() => ({}));

        if (!response.ok || json.status === "failure") {
            throw new LabStackApiError(
                json.error ?? `LabStack API request failed with status ${response.status}`,
                response.status,
                url.toString(),
            );
        }

        return json as T;
    }
}
