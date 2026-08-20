package in.labstack.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;
import in.labstack.sdk.resources.LabsResource;
import in.labstack.sdk.resources.ProviderResource;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Client for the LabStack Labs and Provider APIs.
 * See https://integration.labstack.in/api-docs for the published reference.
 */
public class LabStackClient {
    public static final String DEFAULT_BASE_URL = "https://integration.labstack.in";

    private final String apiKey;
    private final String baseUrl;
    private final HttpTransport transport;
    private final ObjectMapper mapper = new ObjectMapper();

    public final LabsResource labs;
    public final ProviderResource provider;

    public LabStackClient(String apiKey) {
        this(apiKey, DEFAULT_BASE_URL, HttpTransport.defaultTransport());
    }

    public LabStackClient(String apiKey, String baseUrl) {
        this(apiKey, baseUrl, HttpTransport.defaultTransport());
    }

    public LabStackClient(String apiKey, String baseUrl, HttpTransport transport) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("LabStackClient requires an apiKey");
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.replaceAll("/+$", "");
        this.transport = transport;

        this.labs = new LabsResource(this);
        this.provider = new ProviderResource(this);
    }

    public Map<String, Object> request(String method, String path, Map<String, Object> query, Object body) {
        String url = baseUrl + path + buildQueryString(query);

        Map<String, String> headers = new LinkedHashMap<>();
        headers.put("ls-api-key", apiKey);

        String jsonBody = null;
        if (body != null) {
            headers.put("Content-Type", "application/json");
            try {
                jsonBody = mapper.writeValueAsString(body);
            } catch (IOException e) {
                throw new RuntimeException("Failed to serialize request body", e);
            }
        }

        HttpTransport.RawResponse response;
        try {
            response = transport.send(method, url, headers, jsonBody);
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("LabStack API request failed: " + e.getMessage(), e);
        }

        Map<String, Object> data;
        try {
            data = response.body == null || response.body.isEmpty()
                    ? new LinkedHashMap<>()
                    : mapper.readValue(response.body, Map.class);
        } catch (IOException e) {
            data = new LinkedHashMap<>();
        }

        boolean isFailure = "failure".equals(data.get("status"));
        if (response.status < 200 || response.status >= 300 || isFailure) {
            String message = data.get("error") != null
                    ? String.valueOf(data.get("error"))
                    : "LabStack API request failed with status " + response.status;
            throw new LabStackApiError(message, response.status, url);
        }

        return data;
    }

    private String buildQueryString(Map<String, Object> query) {
        if (query == null || query.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder("?");
        boolean first = true;
        for (Map.Entry<String, Object> entry : query.entrySet()) {
            if (entry.getValue() == null) {
                continue;
            }
            if (!first) {
                sb.append('&');
            }
            sb.append(urlEncode(entry.getKey())).append('=').append(urlEncode(String.valueOf(entry.getValue())));
            first = false;
        }
        return first ? "" : sb.toString();
    }

    private static String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
