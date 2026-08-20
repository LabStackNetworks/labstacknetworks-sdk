package in.labstack.sdk;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

/**
 * Thin seam over the actual HTTP call, so {@link LabStackClient} can be unit
 * tested without hitting the network.
 */
public interface HttpTransport {
    RawResponse send(String method, String url, Map<String, String> headers, String body) throws IOException, InterruptedException;

    final class RawResponse {
        public final int status;
        public final String body;

        public RawResponse(int status, String body) {
            this.status = status;
            this.body = body;
        }
    }

    static HttpTransport defaultTransport() {
        HttpClient httpClient = HttpClient.newHttpClient();
        return (method, url, headers, body) -> {
            HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(url));
            headers.forEach(builder::header);
            HttpRequest.BodyPublisher publisher = body == null
                    ? HttpRequest.BodyPublishers.noBody()
                    : HttpRequest.BodyPublishers.ofString(body);
            builder.method(method, publisher);

            HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
            return new RawResponse(response.statusCode(), response.body());
        };
    }
}
