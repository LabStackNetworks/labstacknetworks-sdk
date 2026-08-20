package in.labstack.sdk.resources;

import in.labstack.sdk.LabStackClient;
import in.labstack.sdk.Params;

import java.util.List;
import java.util.Map;

/**
 * Provider API — https://integration.labstack.in/api-docs/provider
 * Speciality discovery, provider search, appointment booking, document
 * management and video consultations.
 */
public class ProviderResource {
    private final LabStackClient client;

    public ProviderResource(LabStackClient client) {
        this.client = client;
    }

    // ---- admin ----------------------------------------------------------

    public Map<String, Object> getStatus() {
        return client.request("GET", "/api/v1.0/admin/status", null, null);
    }

    public Map<String, Object> getBalance() {
        return client.request("GET", "/api/v1.0/admin/getBalance", null, null);
    }

    // ---- network / availability -------------------------------------------

    public Map<String, Object> getProviderDetails(String lsProviderId, String procedureId) {
        return client.request(
                "GET",
                "/api/v1.0/network/getProviderDetails",
                Params.of().put("lsProviderId", lsProviderId).put("procedureId", procedureId).build(),
                null);
    }

    public Map<String, Object> getSpecialities(String providerType, String tags) {
        return client.request(
                "GET",
                "/api/v1.0/availability/getSpecialities",
                Params.of().put("providerType", providerType).put("tags", tags).build(),
                null);
    }

    public Map<String, Object> getProviders(String providerType, String appointmentType, Map<String, Object> extraQuery) {
        Params params = Params.of().put("providerType", providerType).put("appointmentType", appointmentType);
        extraQuery.forEach(params::put);
        return client.request("GET", "/api/v1.0/availability/getProviders", params.build(), null);
    }

    public Map<String, Object> getProviderTags(Map<String, Object> query) {
        return client.request("GET", "/api/v1.0/availability/getProviderTags", query, null);
    }

    public Map<String, Object> getProviderTagCategories(Map<String, Object> query) {
        return client.request("GET", "/api/v1.0/availability/getProviderTagCategories", query, null);
    }

    public Map<String, Object> getProcedures(Map<String, Object> query) {
        return client.request("GET", "/api/v1.0/availability/getProcedures", query, null);
    }

    public Map<String, Object> getProcedure(String procedureId, Map<String, Object> extraQuery) {
        Params params = Params.of().put("procedureId", procedureId);
        extraQuery.forEach(params::put);
        return client.request("GET", "/api/v1.0/availability/getProcedure", params.build(), null);
    }

    public Map<String, Object> getAppointmentSlots(
            String providerType, String appointmentType, String date, Map<String, Object> extraQuery) {
        Params params = Params.of().put("providerType", providerType).put("appointmentType", appointmentType).put("date", date);
        extraQuery.forEach(params::put);
        return client.request("GET", "/api/v1.0/availability/getAppointmentSlots", params.build(), null);
    }

    // ---- appointments -------------------------------------------------------

    /**
     * Required body fields: appointmentType, appointment, name, email, mobile, gender.
     * See spec/provider.openapi.json for the full field list.
     */
    public Map<String, Object> bookAppointment(Map<String, Object> body) {
        return client.request("POST", "/api/v1.0/appointment/bookAppointment", null, body);
    }

    public Map<String, Object> getAppointments(Map<String, Object> query) {
        return client.request("GET", "/api/v1.0/appointment/getAppointments", query, null);
    }

    public Map<String, Object> getAppointmentDetails(long appointmentId) {
        return client.request(
                "GET", "/api/v1.0/appointment/getAppointmentDetails", Params.of().put("appointmentId", appointmentId).build(), null);
    }

    public Map<String, Object> cancelAppointment(long appointmentId, String reason) {
        return client.request(
                "GET",
                "/api/v1.0/appointment/cancelAppointment",
                Params.of().put("appointmentId", appointmentId).put("reason", reason).build(),
                null);
    }

    public Map<String, Object> rescheduleAppointment(long appointmentId, String appointmentTime) {
        return client.request(
                "GET",
                "/api/v1.0/appointment/rescheduleAppointment",
                Params.of().put("appointmentId", appointmentId).put("appointmentTime", appointmentTime).build(),
                null);
    }

    public Map<String, Object> raiseEscalation(
            long appointmentId, String complaint, String severity, String description, String notes) {
        Map<String, Object> body = Params.of()
                .put("appointmentId", appointmentId)
                .put("complaint", complaint)
                .put("severity", severity)
                .put("description", description)
                .put("notes", notes)
                .build();
        return client.request("POST", "/api/v1.0/appointment/escalation", null, body);
    }

    /** Trigger a test appointment webhook (sandbox/testing use). */
    public Map<String, Object> testWebhook(long appointmentId, String appointmentStatus) {
        return client.request(
                "GET",
                "/api/v1.0/appointment/testWebhook",
                Params.of().put("appointmentId", appointmentId).put("appointmentStatus", appointmentStatus).build(),
                null);
    }

    // ---- documents & meeting -------------------------------------------------

    public Map<String, Object> uploadDocument(long appointmentId, List<Map<String, String>> documents) {
        Map<String, Object> body = Params.of().put("appointmentId", appointmentId).put("documents", documents).build();
        return client.request("POST", "/api/v1.0/appointment/uploadDocument", null, body);
    }

    public Map<String, Object> getDocument(long documentId) {
        return client.request("GET", "/api/v1.0/appointment/getDocument", Params.of().put("documentId", documentId).build(), null);
    }

    /** @deprecated currently disabled server-side, always responds 501 Not Implemented. */
    @Deprecated
    public Map<String, Object> deleteDocument(Map<String, Object> query) {
        return client.request("DELETE", "/api/v1.0/appointment/deleteDocument", query, null);
    }

    /** @deprecated currently disabled server-side, always responds 501 Not Implemented. */
    @Deprecated
    public Map<String, Object> deleteAllDocuments(Map<String, Object> query) {
        return client.request("DELETE", "/api/v1.0/appointment/deleteAllDocuments", query, null);
    }

    public Map<String, Object> getPrescriptionPdf(long appointmentId) {
        return client.request(
                "GET", "/api/v1.0/appointment/getPrescriptionPdf", Params.of().put("appointmentId", appointmentId).build(), null);
    }

    public Map<String, Object> getAuthenticatedMeetingLink(long appointmentId, String participantType) {
        return client.request(
                "GET",
                "/api/v1.0/appointment/getAuthenticatedMeetingLink",
                Params.of().put("appointmentId", appointmentId).put("participantType", participantType).build(),
                null);
    }
}
