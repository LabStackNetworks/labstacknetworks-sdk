package labstacknetworks

// LabsResource covers the Labs API — https://integration.labstack.in/api-docs/labs
// Availability checks, package/test catalog, order management, report
// retrieval and health camps.
type LabsResource struct {
	client *Client
}

// ---- admin ----------------------------------------------------------

func (l *LabsResource) GetStatus() (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/admin/status", nil, nil)
}

func (l *LabsResource) GetBalance() (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/admin/getBalance", nil, nil)
}

// ---- availability -----------------------------------------------------

// GetSlots accepts the raw query params documented at
// /api/v1.3/availability/getSlots (date is required).
func (l *LabsResource) GetSlots(params map[string]any) (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/availability/getSlots", toQuery(params), nil)
}

func (l *LabsResource) CheckServiceability(params map[string]any) (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/availability/checkServiceability", toQuery(params), nil)
}

// ---- network catalog --------------------------------------------------

func (l *LabsResource) GetLabs(labIDs string) (map[string]any, error) {
	q := newQuery().set("labIds", labIDs).build()
	return l.client.request("GET", "/api/v1.3/network/getLabs", q, nil)
}

func (l *LabsResource) GetDiscounts() (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/network/getDiscounts", nil, nil)
}

func (l *LabsResource) GetTests(params map[string]any) (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/network/getTests", toQuery(params), nil)
}

func (l *LabsResource) GetTest(testID string, params map[string]any) (map[string]any, error) {
	q := toQuery(params)
	q.Set("testId", testID)
	return l.client.request("GET", "/api/v1.3/network/getTest", q, nil)
}

func (l *LabsResource) GetPackages(params map[string]any) (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/network/getPackages", toQuery(params), nil)
}

func (l *LabsResource) GetPackage(packageID string, params map[string]any) (map[string]any, error) {
	q := toQuery(params)
	q.Set("packageId", packageID)
	return l.client.request("GET", "/api/v1.3/network/getPackage", q, nil)
}

func (l *LabsResource) GetPackageTags() (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/network/getPackageTags", nil, nil)
}

func (l *LabsResource) GetPackagePreparations(packageID string) (map[string]any, error) {
	q := newQuery().set("packageId", packageID).build()
	return l.client.request("GET", "/api/v1.3/network/getPackagePreparations", q, nil)
}

func (l *LabsResource) GetSampleReport(packageLsID string, labID int64) (map[string]any, error) {
	q := newQuery().set("packageLsId", packageLsID).set("labId", labID).build()
	return l.client.request("GET", "/api/v1.3/network/getSampleReport", q, nil)
}

// ---- orders -------------------------------------------------------------

// PlaceOrder requires: orderType, appointment, name, email, gender, mobile, pincode.
// See spec/labs.openapi.json at the repo root for the full field list.
func (l *LabsResource) PlaceOrder(body map[string]any) (map[string]any, error) {
	return l.client.request("POST", "/api/v1.3/order/placeOrder", nil, body)
}

func (l *LabsResource) GetOrders(params map[string]any) (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/order/getOrders", toQuery(params), nil)
}

func (l *LabsResource) GetOrderDetails(params map[string]any) (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/order/getOrderDetails", toQuery(params), nil)
}

func (l *LabsResource) CancelOrder(orderID int64, reason string) (map[string]any, error) {
	q := newQuery().set("orderId", orderID).set("reason", reason).build()
	return l.client.request("GET", "/api/v1.3/order/cancelOrder", q, nil)
}

func (l *LabsResource) RescheduleOrder(orderID int64, appointment string) (map[string]any, error) {
	q := newQuery().set("orderId", orderID).set("appointment", appointment).build()
	return l.client.request("GET", "/api/v1.3/order/rescheduleOrder", q, nil)
}

func (l *LabsResource) GetReport(orderID, reportID int64) (map[string]any, error) {
	q := newQuery().set("orderId", orderID).set("reportId", reportID).build()
	return l.client.request("GET", "/api/v1.3/order/getReport", q, nil)
}

func (l *LabsResource) GetReportRawValues(orderID int64) (map[string]any, error) {
	q := newQuery().set("orderId", orderID).build()
	return l.client.request("GET", "/api/v1.3/order/getReportRawValues", q, nil)
}

func (l *LabsResource) UploadDocument(token string, documents []map[string]string) (map[string]any, error) {
	body := map[string]any{"token": token, "documents": documents}
	return l.client.request("POST", "/api/v1.3/order/uploadDocument", nil, body)
}

func (l *LabsResource) RaiseEscalation(orderID int64, complaint, severity, description, notes string) (map[string]any, error) {
	body := map[string]any{
		"orderId":     orderID,
		"complaint":   complaint,
		"severity":    severity,
		"description": description,
		"notes":       notes,
	}
	return l.client.request("POST", "/api/v1.3/order/escalation", nil, body)
}

// TestWebhook triggers a test order webhook (sandbox/testing use).
func (l *LabsResource) TestWebhook(orderID int64, orderStatus string) (map[string]any, error) {
	q := newQuery().set("orderId", orderID).set("orderStatus", orderStatus).build()
	return l.client.request("GET", "/api/v1.3/order/testWebhook", q, nil)
}

// ---- camps ----------------------------------------------------------------

func (l *LabsResource) GetCamps(params map[string]any) (map[string]any, error) {
	return l.client.request("GET", "/api/v1.3/camp/getCamps", toQuery(params), nil)
}

func (l *LabsResource) GetCampDetails(campLsID string) (map[string]any, error) {
	q := newQuery().set("campLsId", campLsID).build()
	return l.client.request("GET", "/api/v1.3/camp/getCampDetails", q, nil)
}

func (l *LabsResource) GetCampSlots(campLsID string) (map[string]any, error) {
	q := newQuery().set("campLsId", campLsID).build()
	return l.client.request("GET", "/api/v1.3/camp/getCampSlots", q, nil)
}

// PlaceCampOrder requires: campLsId, appointment, name, email, gender, mobile.
// See spec/labs.openapi.json at the repo root for the full field list.
func (l *LabsResource) PlaceCampOrder(body map[string]any) (map[string]any, error) {
	return l.client.request("POST", "/api/v1.3/camp/placeCampOrder", nil, body)
}
