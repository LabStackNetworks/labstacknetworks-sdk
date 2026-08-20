package in.labstack.sdk;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class LabStackClientTest {

    private static class RecordingTransport implements HttpTransport {
        String lastMethod;
        String lastUrl;
        Map<String, String> lastHeaders;
        String lastBody;
        int statusToReturn;
        String bodyToReturn;

        @Override
        public RawResponse send(String method, String url, Map<String, String> headers, String body) {
            this.lastMethod = method;
            this.lastUrl = url;
            this.lastHeaders = headers;
            this.lastBody = body;
            return new RawResponse(statusToReturn, bodyToReturn);
        }
    }

    @Test
    void requiresApiKey() {
        assertThrows(IllegalArgumentException.class, () -> new LabStackClient(""));
    }

    @Test
    void defaultsToIntegrationBaseUrl() {
        RecordingTransport transport = new RecordingTransport();
        transport.statusToReturn = 200;
        transport.bodyToReturn = "{\"status\":\"success\",\"labs\":[]}";

        LabStackClient client = new LabStackClient("test-key", LabStackClient.DEFAULT_BASE_URL, transport);
        client.labs.getLabs(null);

        assertEquals("https://integration.labstack.in/api/v1.3/network/getLabs", transport.lastUrl);
    }

    @Test
    void sendsApiKeyHeaderAndQueryParams() {
        RecordingTransport transport = new RecordingTransport();
        transport.statusToReturn = 200;
        transport.bodyToReturn = "{\"status\":\"success\",\"labs\":[]}";

        LabStackClient client = new LabStackClient("test-key", LabStackClient.DEFAULT_BASE_URL, transport);
        client.labs.getLabs("1,2");

        assertEquals("test-key", transport.lastHeaders.get("ls-api-key"));
        assertEquals("https://integration.labstack.in/api/v1.3/network/getLabs?labIds=1%2C2", transport.lastUrl);
    }

    @Test
    void sendsJsonBodyOnPost() {
        RecordingTransport transport = new RecordingTransport();
        transport.statusToReturn = 200;
        transport.bodyToReturn = "{\"status\":\"success\",\"orderId\":1}";

        LabStackClient client = new LabStackClient("test-key", LabStackClient.DEFAULT_BASE_URL, transport);
        client.labs.placeOrder(Params.of()
                .put("orderType", "HOME_COLLECTION")
                .put("appointment", "2026-06-01T11:00:00+05:30")
                .put("name", "John Doe")
                .put("email", "john@example.com")
                .put("gender", "MALE")
                .put("mobile", "9999999999")
                .put("pincode", "560035")
                .build());

        assertTrue(transport.lastBody.contains("\"orderType\":\"HOME_COLLECTION\""));
        assertTrue(transport.lastBody.contains("\"name\":\"John Doe\""));
    }

    @Test
    void throwsOnNon2xxResponse() {
        RecordingTransport transport = new RecordingTransport();
        transport.statusToReturn = 401;
        transport.bodyToReturn = "{\"status\":\"failure\",\"error\":\"Authorisation failed\"}";

        LabStackClient client = new LabStackClient("bad-key", LabStackClient.DEFAULT_BASE_URL, transport);

        LabStackApiError error = assertThrows(LabStackApiError.class, () -> client.labs.getLabs(null));
        assertEquals(401, error.getStatus());
        assertEquals("Authorisation failed", error.getMessage());
    }

    @Test
    void throwsOnFailureStatusEvenWithHttp200() {
        RecordingTransport transport = new RecordingTransport();
        transport.statusToReturn = 200;
        transport.bodyToReturn = "{\"status\":\"failure\",\"error\":\"page is out of range\"}";

        LabStackClient client = new LabStackClient("test-key", LabStackClient.DEFAULT_BASE_URL, transport);

        LabStackApiError error = assertThrows(LabStackApiError.class, () -> client.labs.getOrders(null));
        assertEquals("page is out of range", error.getMessage());
    }
}
