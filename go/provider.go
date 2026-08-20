package labstacknetworks

// ProviderResource covers the Provider API —
// https://integration.labstack.in/api-docs/provider
// Speciality discovery, provider search, appointment booking, document
// management and video consultations.
type ProviderResource struct {
	client *Client
}

// ---- admin ----------------------------------------------------------

func (p *ProviderResource) GetStatus() (map[string]any, error) {
	return p.client.request("GET", "/api/v1.0/admin/status", nil, nil)
}

func (p *ProviderResource) GetBalance() (map[string]any, error) {
	return p.client.request("GET", "/api/v1.0/admin/getBalance", nil, nil)
}

// ---- network / availability -------------------------------------------

func (p *ProviderResource) GetProviderDetails(lsProviderID, procedureID string) (map[string]any, error) {
	q := newQuery().set("lsProviderId", lsProviderID).set("procedureId", procedureID).build()
	return p.client.request("GET", "/api/v1.0/network/getProviderDetails", q, nil)
}

func (p *ProviderResource) GetSpecialities(providerType, tags string) (map[string]any, error) {
	q := newQuery().set("providerType", providerType).set("tags", tags).build()
	return p.client.request("GET", "/api/v1.0/availability/getSpecialities", q, nil)
}

func (p *ProviderResource) GetProviders(providerType, appointmentType string, params map[string]any) (map[string]any, error) {
	q := toQuery(params)
	q.Set("providerType", providerType)
	q.Set("appointmentType", appointmentType)
	return p.client.request("GET", "/api/v1.0/availability/getProviders", q, nil)
}

func (p *ProviderResource) GetProviderTags(params map[string]any) (map[string]any, error) {
	return p.client.request("GET", "/api/v1.0/availability/getProviderTags", toQuery(params), nil)
}

func (p *ProviderResource) GetProviderTagCategories(params map[string]any) (map[string]any, error) {
	return p.client.request("GET", "/api/v1.0/availability/getProviderTagCategories", toQuery(params), nil)
}

func (p *ProviderResource) GetProcedures(params map[string]any) (map[string]any, error) {
	return p.client.request("GET", "/api/v1.0/availability/getProcedures", toQuery(params), nil)
}

func (p *ProviderResource) GetProcedure(procedureID string, params map[string]any) (map[string]any, error) {
	q := toQuery(params)
	q.Set("procedureId", procedureID)
	return p.client.request("GET", "/api/v1.0/availability/getProcedure", q, nil)
}

func (p *ProviderResource) GetAppointmentSlots(providerType, appointmentType, date string, params map[string]any) (map[string]any, error) {
	q := toQuery(params)
	q.Set("providerType", providerType)
	q.Set("appointmentType", appointmentType)
	q.Set("date", date)
	return p.client.request("GET", "/api/v1.0/availability/getAppointmentSlots", q, nil)
}

// ---- appointments -------------------------------------------------------

// BookAppointment requires: appointmentType, appointment, name, email, mobile, gender.
// See spec/provider.openapi.json at the repo root for the full field list.
func (p *ProviderResource) BookAppointment(body map[string]any) (map[string]any, error) {
	return p.client.request("POST", "/api/v1.0/appointment/bookAppointment", nil, body)
}

func (p *ProviderResource) GetAppointments(params map[string]any) (map[string]any, error) {
	return p.client.request("GET", "/api/v1.0/appointment/getAppointments", toQuery(params), nil)
}

func (p *ProviderResource) GetAppointmentDetails(appointmentID int64) (map[string]any, error) {
	q := newQuery().set("appointmentId", appointmentID).build()
	return p.client.request("GET", "/api/v1.0/appointment/getAppointmentDetails", q, nil)
}

func (p *ProviderResource) CancelAppointment(appointmentID int64, reason string) (map[string]any, error) {
	q := newQuery().set("appointmentId", appointmentID).set("reason", reason).build()
	return p.client.request("GET", "/api/v1.0/appointment/cancelAppointment", q, nil)
}

func (p *ProviderResource) RescheduleAppointment(appointmentID int64, appointmentTime string) (map[string]any, error) {
	q := newQuery().set("appointmentId", appointmentID).set("appointmentTime", appointmentTime).build()
	return p.client.request("GET", "/api/v1.0/appointment/rescheduleAppointment", q, nil)
}

func (p *ProviderResource) RaiseEscalation(appointmentID int64, complaint, severity, description, notes string) (map[string]any, error) {
	body := map[string]any{
		"appointmentId": appointmentID,
		"complaint":     complaint,
		"severity":      severity,
		"description":   description,
		"notes":         notes,
	}
	return p.client.request("POST", "/api/v1.0/appointment/escalation", nil, body)
}

// TestWebhook triggers a test appointment webhook (sandbox/testing use).
func (p *ProviderResource) TestWebhook(appointmentID int64, appointmentStatus string) (map[string]any, error) {
	q := newQuery().set("appointmentId", appointmentID).set("appointmentStatus", appointmentStatus).build()
	return p.client.request("GET", "/api/v1.0/appointment/testWebhook", q, nil)
}

// ---- documents & meeting -------------------------------------------------

func (p *ProviderResource) UploadDocument(appointmentID int64, documents []map[string]string) (map[string]any, error) {
	body := map[string]any{"appointmentId": appointmentID, "documents": documents}
	return p.client.request("POST", "/api/v1.0/appointment/uploadDocument", nil, body)
}

func (p *ProviderResource) GetDocument(documentID int64) (map[string]any, error) {
	q := newQuery().set("documentId", documentID).build()
	return p.client.request("GET", "/api/v1.0/appointment/getDocument", q, nil)
}

// DeleteDocument is deprecated: currently disabled server-side, always
// responds 501 Not Implemented.
func (p *ProviderResource) DeleteDocument(params map[string]any) (map[string]any, error) {
	return p.client.request("DELETE", "/api/v1.0/appointment/deleteDocument", toQuery(params), nil)
}

// DeleteAllDocuments is deprecated: currently disabled server-side, always
// responds 501 Not Implemented.
func (p *ProviderResource) DeleteAllDocuments(params map[string]any) (map[string]any, error) {
	return p.client.request("DELETE", "/api/v1.0/appointment/deleteAllDocuments", toQuery(params), nil)
}

func (p *ProviderResource) GetPrescriptionPdf(appointmentID int64) (map[string]any, error) {
	q := newQuery().set("appointmentId", appointmentID).build()
	return p.client.request("GET", "/api/v1.0/appointment/getPrescriptionPdf", q, nil)
}

func (p *ProviderResource) GetAuthenticatedMeetingLink(appointmentID int64, participantType string) (map[string]any, error) {
	q := newQuery().set("appointmentId", appointmentID).set("participantType", participantType).build()
	return p.client.request("GET", "/api/v1.0/appointment/getAuthenticatedMeetingLink", q, nil)
}
