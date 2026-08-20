import type { LabStackClient, QueryParams } from "../client.js";
import type { BookAppointmentRequest, DocumentUpload } from "../types.js";

/**
 * Provider API — https://integration.labstack.in/api-docs/provider
 * Speciality discovery, provider search, appointment booking, document management and video consultations.
 */
export class ProviderResource {
    constructor(private readonly client: LabStackClient) {}

    // ---- admin ----------------------------------------------------------

    /** GET /api/v1.0/admin/status */
    getStatus() {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/admin/status");
    }

    /** GET /api/v1.0/admin/getBalance */
    getBalance() {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/admin/getBalance");
    }

    // ---- network / availability -------------------------------------------

    /** GET /api/v1.0/network/getProviderDetails */
    getProviderDetails(params: { lsProviderId: string; procedureId?: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/network/getProviderDetails", { query: params });
    }

    /** GET /api/v1.0/availability/getSpecialities */
    getSpecialities(params: { providerType: string; tags?: string }) {
        return this.client.request<{ status: string; specialities: unknown[] }>("GET", "/api/v1.0/availability/getSpecialities", { query: params });
    }

    /** GET /api/v1.0/availability/getProviders */
    getProviders(params: {
        providerType: string;
        appointmentType: string;
        speciality?: string;
        subSpeciality?: string;
        tags?: string;
        procedureIds?: string;
        providerIds?: string;
        tagIds?: string;
        categoryIds?: string;
        gender?: string;
        latitude?: number;
        longitude?: number;
        pincode?: string;
        address?: string;
        locality?: string;
        city?: string;
        state?: string;
        range?: number;
        userUniqueId?: string;
        perPage?: number;
        page?: number;
    }) {
        return this.client.request<{ status: string; providers: unknown[] }>("GET", "/api/v1.0/availability/getProviders", { query: params });
    }

    /** GET /api/v1.0/availability/getProviderTags */
    getProviderTags(params: { perPage?: number; page?: number; categoryId?: string } = {}) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/availability/getProviderTags", { query: params });
    }

    /** GET /api/v1.0/availability/getProviderTagCategories */
    getProviderTagCategories(params: { perPage?: number; page?: number } = {}) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/availability/getProviderTagCategories", { query: params });
    }

    /** GET /api/v1.0/availability/getProcedures */
    getProcedures(params: { perPage?: number; page?: number; providerType?: string } = {}) {
        return this.client.request<{ status: string; procedures: unknown[] }>("GET", "/api/v1.0/availability/getProcedures", { query: params });
    }

    /** GET /api/v1.0/availability/getProcedure */
    getProcedure(params: { procedureId: string; providerIds?: string; appointmentTypes?: string; perPage?: number; page?: number }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/availability/getProcedure", { query: params });
    }

    /** GET /api/v1.0/availability/getAppointmentSlots */
    getAppointmentSlots(params: {
        providerType: string;
        appointmentType: string;
        date: string;
        speciality?: string;
        subSpeciality?: string;
        gender?: string;
        procedureIds?: string;
        providerIds?: string;
        perPage?: number;
        page?: number;
        latitude?: number;
        longitude?: number;
        pincode?: string;
        address?: string;
        locality?: string;
        city?: string;
        state?: string;
        range?: number;
    }) {
        return this.client.request<{ status: string; slots: unknown[] }>("GET", "/api/v1.0/availability/getAppointmentSlots", { query: params });
    }

    // ---- appointments -------------------------------------------------------

    /** POST /api/v1.0/appointment/bookAppointment */
    bookAppointment(body: BookAppointmentRequest) {
        return this.client.request<{ status: string; appointmentId: number }>("POST", "/api/v1.0/appointment/bookAppointment", { body });
    }

    /** GET /api/v1.0/appointment/getAppointments */
    getAppointments(params: { startDate?: string; endDate?: string; updatedSince?: string; perPage?: number; page?: number; email?: string } = {}) {
        return this.client.request<{ status: string; appointments: unknown[] }>("GET", "/api/v1.0/appointment/getAppointments", { query: params });
    }

    /** GET /api/v1.0/appointment/getAppointmentDetails */
    getAppointmentDetails(params: { appointmentId: number }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/appointment/getAppointmentDetails", { query: params });
    }

    /** GET /api/v1.0/appointment/cancelAppointment */
    cancelAppointment(params: { appointmentId: number; reason?: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/appointment/cancelAppointment", { query: params });
    }

    /** GET /api/v1.0/appointment/rescheduleAppointment */
    rescheduleAppointment(params: { appointmentId: number; appointmentTime: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/appointment/rescheduleAppointment", { query: params });
    }

    /** POST /api/v1.0/appointment/escalation */
    raiseEscalation(body: { appointmentId: number; complaint: string; severity: string; description?: string; notes?: string }) {
        return this.client.request<Record<string, unknown>>("POST", "/api/v1.0/appointment/escalation", { body });
    }

    /** GET /api/v1.0/appointment/testWebhook — trigger a test appointment webhook (sandbox/testing use). */
    testWebhook(params: { appointmentId: number; appointmentStatus?: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/appointment/testWebhook", { query: params });
    }

    // ---- documents & meeting -------------------------------------------------

    /** POST /api/v1.0/appointment/uploadDocument */
    uploadDocument(body: { appointmentId: number; documents: DocumentUpload[] }) {
        return this.client.request<Record<string, unknown>>("POST", "/api/v1.0/appointment/uploadDocument", { body });
    }

    /** GET /api/v1.0/appointment/getDocument */
    getDocument(params: { documentId: number }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/appointment/getDocument", { query: params });
    }

    /**
     * DELETE /api/v1.0/appointment/deleteDocument
     * @deprecated Currently disabled server-side — always responds 501 Not Implemented.
     */
    deleteDocument(params: QueryParams = {}) {
        return this.client.request<Record<string, unknown>>("DELETE", "/api/v1.0/appointment/deleteDocument", { query: params });
    }

    /**
     * DELETE /api/v1.0/appointment/deleteAllDocuments
     * @deprecated Currently disabled server-side — always responds 501 Not Implemented.
     */
    deleteAllDocuments(params: QueryParams = {}) {
        return this.client.request<Record<string, unknown>>("DELETE", "/api/v1.0/appointment/deleteAllDocuments", { query: params });
    }

    /** GET /api/v1.0/appointment/getPrescriptionPdf */
    getPrescriptionPdf(params: { appointmentId: number }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/appointment/getPrescriptionPdf", { query: params });
    }

    /** GET /api/v1.0/appointment/getAuthenticatedMeetingLink */
    getAuthenticatedMeetingLink(params: { appointmentId: number; participantType?: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.0/appointment/getAuthenticatedMeetingLink", { query: params });
    }
}
