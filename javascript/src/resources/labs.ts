import type { LabStackClient, QueryParams } from "../client.js";
import type { DocumentUpload, PlaceCampOrderRequest, PlaceOrderRequest } from "../types.js";

/**
 * Labs API — https://integration.labstack.in/api-docs/labs
 * Availability checks, package/test catalog, order management, report retrieval and health camps.
 */
export class LabsResource {
    constructor(private readonly client: LabStackClient) {}

    // ---- admin ----------------------------------------------------------

    /** GET /api/v1.3/admin/status */
    getStatus() {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/admin/status");
    }

    /** GET /api/v1.3/admin/getBalance */
    getBalance() {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/admin/getBalance");
    }

    // ---- availability -----------------------------------------------------

    /** GET /api/v1.3/availability/getSlots */
    getSlots(params: {
        date: string;
        pincode?: string;
        latitude?: number;
        longitude?: number;
        service?: string;
        range?: number;
        labId?: number;
        labIds?: string;
        testIds?: string;
        packageIds?: string;
    }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/availability/getSlots", { query: params });
    }

    /** GET /api/v1.3/availability/checkServiceability */
    checkServiceability(params: QueryParams = {}) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/availability/checkServiceability", { query: params });
    }

    // ---- network catalog --------------------------------------------------

    /** GET /api/v1.3/network/getLabs */
    getLabs(params: { labIds?: string } = {}) {
        return this.client.request<{ status: string; labs: unknown[] }>("GET", "/api/v1.3/network/getLabs", { query: params });
    }

    /** GET /api/v1.3/network/getDiscounts */
    getDiscounts() {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/network/getDiscounts");
    }

    /** GET /api/v1.3/network/getTests */
    getTests(params: QueryParams = {}) {
        return this.client.request<{ status: string; tests: unknown[] }>("GET", "/api/v1.3/network/getTests", { query: params });
    }

    /** GET /api/v1.3/network/getTest */
    getTest(params: { testId: string; pincode?: string; latitude?: number; longitude?: number }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/network/getTest", { query: params });
    }

    /** GET /api/v1.3/network/getPackages */
    getPackages(params: QueryParams = {}) {
        return this.client.request<{ status: string; packages: unknown[] }>("GET", "/api/v1.3/network/getPackages", { query: params });
    }

    /** GET /api/v1.3/network/getPackage */
    getPackage(params: { packageId: string; pincode?: string; latitude?: number; longitude?: number }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/network/getPackage", { query: params });
    }

    /** GET /api/v1.3/network/getPackageTags */
    getPackageTags() {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/network/getPackageTags");
    }

    /** GET /api/v1.3/network/getPackagePreparations */
    getPackagePreparations(params: { packageId: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/network/getPackagePreparations", { query: params });
    }

    /** GET /api/v1.3/network/getSampleReport */
    getSampleReport(params: { packageLsId: string; labId: number }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/network/getSampleReport", { query: params });
    }

    // ---- orders -------------------------------------------------------------

    /** POST /api/v1.3/order/placeOrder */
    placeOrder(body: PlaceOrderRequest) {
        return this.client.request<{ status: string; orderId: number }>("POST", "/api/v1.3/order/placeOrder", { body });
    }

    /** GET /api/v1.3/order/getOrders */
    getOrders(params: { startDate?: string; endDate?: string; updatedSince?: string; email?: string } = {}) {
        return this.client.request<{ status: string; orders: unknown[] }>("GET", "/api/v1.3/order/getOrders", { query: params });
    }

    /** GET /api/v1.3/order/getOrderDetails */
    getOrderDetails(params: { orderId?: number; referenceId?: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/order/getOrderDetails", { query: params });
    }

    /** GET /api/v1.3/order/cancelOrder */
    cancelOrder(params: { orderId: number; reason?: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/order/cancelOrder", { query: params });
    }

    /** GET /api/v1.3/order/rescheduleOrder */
    rescheduleOrder(params: { orderId: number; appointment: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/order/rescheduleOrder", { query: params });
    }

    /** GET /api/v1.3/order/getReport — returns the report PDF. */
    getReport(params: { orderId: number; reportId: number }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/order/getReport", { query: params });
    }

    /** GET /api/v1.3/order/getReportRawValues */
    getReportRawValues(params: { orderId: number }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/order/getReportRawValues", { query: params });
    }

    /** POST /api/v1.3/order/uploadDocument */
    uploadDocument(body: { token: string; documents: DocumentUpload[] }) {
        return this.client.request<{ status: string; orderId: number; uploadedCount: number }>("POST", "/api/v1.3/order/uploadDocument", { body });
    }

    /** POST /api/v1.3/order/escalation */
    raiseEscalation(body: { orderId: number; complaint: string; severity: string; description?: string; notes?: string }) {
        return this.client.request<Record<string, unknown>>("POST", "/api/v1.3/order/escalation", { body });
    }

    /** GET /api/v1.3/order/testWebhook — trigger a test order webhook (sandbox/testing use). */
    testWebhook(params: { orderId: number; orderStatus?: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/order/testWebhook", { query: params });
    }

    // ---- camps ----------------------------------------------------------------

    /** GET /api/v1.3/camp/getCamps */
    getCamps(params: { startDate?: string; endDate?: string } = {}) {
        return this.client.request<{ status: string; camps: unknown[] }>("GET", "/api/v1.3/camp/getCamps", { query: params });
    }

    /** GET /api/v1.3/camp/getCampDetails */
    getCampDetails(params: { campLsId: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/camp/getCampDetails", { query: params });
    }

    /** GET /api/v1.3/camp/getCampSlots */
    getCampSlots(params: { campLsId: string }) {
        return this.client.request<Record<string, unknown>>("GET", "/api/v1.3/camp/getCampSlots", { query: params });
    }

    /** POST /api/v1.3/camp/placeCampOrder */
    placeCampOrder(body: PlaceCampOrderRequest) {
        return this.client.request<{ status: string; orderId: number }>("POST", "/api/v1.3/camp/placeCampOrder", { body });
    }
}
