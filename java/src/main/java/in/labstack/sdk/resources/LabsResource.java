package in.labstack.sdk.resources;

import in.labstack.sdk.LabStackClient;
import in.labstack.sdk.Params;

import java.util.List;
import java.util.Map;

/**
 * Labs API — https://integration.labstack.in/api-docs/labs
 * Availability checks, package/test catalog, order management, report
 * retrieval and health camps.
 */
public class LabsResource {
    private final LabStackClient client;

    public LabsResource(LabStackClient client) {
        this.client = client;
    }

    // ---- admin ----------------------------------------------------------

    public Map<String, Object> getStatus() {
        return client.request("GET", "/api/v1.3/admin/status", null, null);
    }

    public Map<String, Object> getBalance() {
        return client.request("GET", "/api/v1.3/admin/getBalance", null, null);
    }

    // ---- availability -----------------------------------------------------

    public Map<String, Object> getSlots(Map<String, Object> query) {
        return client.request("GET", "/api/v1.3/availability/getSlots", query, null);
    }

    public Map<String, Object> checkServiceability(Map<String, Object> query) {
        return client.request("GET", "/api/v1.3/availability/checkServiceability", query, null);
    }

    // ---- network catalog --------------------------------------------------

    public Map<String, Object> getLabs(String labIds) {
        return client.request("GET", "/api/v1.3/network/getLabs", Params.of().put("labIds", labIds).build(), null);
    }

    public Map<String, Object> getDiscounts() {
        return client.request("GET", "/api/v1.3/network/getDiscounts", null, null);
    }

    public Map<String, Object> getTests(Map<String, Object> query) {
        return client.request("GET", "/api/v1.3/network/getTests", query, null);
    }

    public Map<String, Object> getTest(String testId, Map<String, Object> extraQuery) {
        Params params = Params.of().put("testId", testId);
        extraQuery.forEach(params::put);
        return client.request("GET", "/api/v1.3/network/getTest", params.build(), null);
    }

    public Map<String, Object> getPackages(Map<String, Object> query) {
        return client.request("GET", "/api/v1.3/network/getPackages", query, null);
    }

    public Map<String, Object> getPackage(String packageId, Map<String, Object> extraQuery) {
        Params params = Params.of().put("packageId", packageId);
        extraQuery.forEach(params::put);
        return client.request("GET", "/api/v1.3/network/getPackage", params.build(), null);
    }

    public Map<String, Object> getPackageTags() {
        return client.request("GET", "/api/v1.3/network/getPackageTags", null, null);
    }

    public Map<String, Object> getPackagePreparations(String packageId) {
        return client.request(
                "GET", "/api/v1.3/network/getPackagePreparations", Params.of().put("packageId", packageId).build(), null);
    }

    public Map<String, Object> getSampleReport(String packageLsId, long labId) {
        return client.request(
                "GET",
                "/api/v1.3/network/getSampleReport",
                Params.of().put("packageLsId", packageLsId).put("labId", labId).build(),
                null);
    }

    // ---- orders -------------------------------------------------------------

    /**
     * Required body fields: orderType, appointment, name, email, gender, mobile, pincode.
     * See spec/labs.openapi.json for the full field list.
     */
    public Map<String, Object> placeOrder(Map<String, Object> body) {
        return client.request("POST", "/api/v1.3/order/placeOrder", null, body);
    }

    public Map<String, Object> getOrders(Map<String, Object> query) {
        return client.request("GET", "/api/v1.3/order/getOrders", query, null);
    }

    public Map<String, Object> getOrderDetails(Map<String, Object> query) {
        return client.request("GET", "/api/v1.3/order/getOrderDetails", query, null);
    }

    public Map<String, Object> cancelOrder(long orderId, String reason) {
        return client.request(
                "GET", "/api/v1.3/order/cancelOrder", Params.of().put("orderId", orderId).put("reason", reason).build(), null);
    }

    public Map<String, Object> rescheduleOrder(long orderId, String appointment) {
        return client.request(
                "GET",
                "/api/v1.3/order/rescheduleOrder",
                Params.of().put("orderId", orderId).put("appointment", appointment).build(),
                null);
    }

    public Map<String, Object> getReport(long orderId, long reportId) {
        return client.request(
                "GET", "/api/v1.3/order/getReport", Params.of().put("orderId", orderId).put("reportId", reportId).build(), null);
    }

    public Map<String, Object> getReportRawValues(long orderId) {
        return client.request(
                "GET", "/api/v1.3/order/getReportRawValues", Params.of().put("orderId", orderId).build(), null);
    }

    public Map<String, Object> uploadDocument(String token, List<Map<String, String>> documents) {
        return client.request(
                "POST", "/api/v1.3/order/uploadDocument", null, Params.of().put("token", token).put("documents", documents).build());
    }

    public Map<String, Object> raiseEscalation(long orderId, String complaint, String severity, String description, String notes) {
        Map<String, Object> body = Params.of()
                .put("orderId", orderId)
                .put("complaint", complaint)
                .put("severity", severity)
                .put("description", description)
                .put("notes", notes)
                .build();
        return client.request("POST", "/api/v1.3/order/escalation", null, body);
    }

    /** Trigger a test order webhook (sandbox/testing use). */
    public Map<String, Object> testWebhook(long orderId, String orderStatus) {
        return client.request(
                "GET",
                "/api/v1.3/order/testWebhook",
                Params.of().put("orderId", orderId).put("orderStatus", orderStatus).build(),
                null);
    }

    // ---- camps ----------------------------------------------------------------

    public Map<String, Object> getCamps(Map<String, Object> query) {
        return client.request("GET", "/api/v1.3/camp/getCamps", query, null);
    }

    public Map<String, Object> getCampDetails(String campLsId) {
        return client.request("GET", "/api/v1.3/camp/getCampDetails", Params.of().put("campLsId", campLsId).build(), null);
    }

    public Map<String, Object> getCampSlots(String campLsId) {
        return client.request("GET", "/api/v1.3/camp/getCampSlots", Params.of().put("campLsId", campLsId).build(), null);
    }

    /**
     * Required body fields: campLsId, appointment, name, email, gender, mobile.
     * See spec/labs.openapi.json for the full field list.
     */
    public Map<String, Object> placeCampOrder(Map<String, Object> body) {
        return client.request("POST", "/api/v1.3/camp/placeCampOrder", null, body);
    }
}
