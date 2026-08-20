package in.labstack.sdk;

public class LabStackApiError extends RuntimeException {
    private final int status;
    private final String url;

    public LabStackApiError(String message, int status, String url) {
        super(message);
        this.status = status;
        this.url = url;
    }

    public int getStatus() {
        return status;
    }

    public String getUrl() {
        return url;
    }
}
