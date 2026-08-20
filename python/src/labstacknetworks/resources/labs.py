from __future__ import annotations

from typing import Any, Mapping, Optional, Sequence


class LabsResource:
    """Labs API — https://integration.labstack.in/api-docs/labs

    Availability checks, package/test catalog, order management, report
    retrieval and health camps.
    """

    def __init__(self, client):
        self._client = client

    # ---- admin ----------------------------------------------------------

    def get_status(self) -> dict:
        return self._client.request("GET", "/api/v1.3/admin/status")

    def get_balance(self) -> dict:
        return self._client.request("GET", "/api/v1.3/admin/getBalance")

    # ---- availability -----------------------------------------------------

    def get_slots(
        self,
        date: str,
        pincode: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        service: Optional[str] = None,
        range: Optional[int] = None,
        lab_id: Optional[int] = None,
        lab_ids: Optional[str] = None,
        test_ids: Optional[str] = None,
        package_ids: Optional[str] = None,
    ) -> dict:
        return self._client.request(
            "GET",
            "/api/v1.3/availability/getSlots",
            query={
                "date": date,
                "pincode": pincode,
                "latitude": latitude,
                "longitude": longitude,
                "service": service,
                "range": range,
                "labId": lab_id,
                "labIds": lab_ids,
                "testIds": test_ids,
                "packageIds": package_ids,
            },
        )

    def check_serviceability(self, **params: Any) -> dict:
        return self._client.request("GET", "/api/v1.3/availability/checkServiceability", query=params)

    # ---- network catalog --------------------------------------------------

    def get_labs(self, lab_ids: Optional[str] = None) -> dict:
        return self._client.request("GET", "/api/v1.3/network/getLabs", query={"labIds": lab_ids})

    def get_discounts(self) -> dict:
        return self._client.request("GET", "/api/v1.3/network/getDiscounts")

    def get_tests(self, **params: Any) -> dict:
        return self._client.request("GET", "/api/v1.3/network/getTests", query=params)

    def get_test(
        self,
        test_id: str,
        pincode: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
    ) -> dict:
        return self._client.request(
            "GET",
            "/api/v1.3/network/getTest",
            query={"testId": test_id, "pincode": pincode, "latitude": latitude, "longitude": longitude},
        )

    def get_packages(self, **params: Any) -> dict:
        return self._client.request("GET", "/api/v1.3/network/getPackages", query=params)

    def get_package(
        self,
        package_id: str,
        pincode: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
    ) -> dict:
        return self._client.request(
            "GET",
            "/api/v1.3/network/getPackage",
            query={"packageId": package_id, "pincode": pincode, "latitude": latitude, "longitude": longitude},
        )

    def get_package_tags(self) -> dict:
        return self._client.request("GET", "/api/v1.3/network/getPackageTags")

    def get_package_preparations(self, package_id: str) -> dict:
        return self._client.request("GET", "/api/v1.3/network/getPackagePreparations", query={"packageId": package_id})

    def get_sample_report(self, package_ls_id: str, lab_id: int) -> dict:
        return self._client.request(
            "GET", "/api/v1.3/network/getSampleReport", query={"packageLsId": package_ls_id, "labId": lab_id}
        )

    # ---- orders -------------------------------------------------------------

    def place_order(self, **body: Any) -> dict:
        """Required: order_type, appointment, name, email, gender, mobile, pincode
        (pass as orderType, appointment, name, email, gender, mobile, pincode)."""
        return self._client.request("POST", "/api/v1.3/order/placeOrder", body=body)

    def get_orders(self, **params: Any) -> dict:
        return self._client.request("GET", "/api/v1.3/order/getOrders", query=params)

    def get_order_details(self, order_id: Optional[int] = None, reference_id: Optional[str] = None) -> dict:
        return self._client.request(
            "GET", "/api/v1.3/order/getOrderDetails", query={"orderId": order_id, "referenceId": reference_id}
        )

    def cancel_order(self, order_id: int, reason: Optional[str] = None) -> dict:
        return self._client.request("GET", "/api/v1.3/order/cancelOrder", query={"orderId": order_id, "reason": reason})

    def reschedule_order(self, order_id: int, appointment: str) -> dict:
        return self._client.request(
            "GET", "/api/v1.3/order/rescheduleOrder", query={"orderId": order_id, "appointment": appointment}
        )

    def get_report(self, order_id: int, report_id: int) -> dict:
        return self._client.request("GET", "/api/v1.3/order/getReport", query={"orderId": order_id, "reportId": report_id})

    def get_report_raw_values(self, order_id: int) -> dict:
        return self._client.request("GET", "/api/v1.3/order/getReportRawValues", query={"orderId": order_id})

    def upload_document(self, token: str, documents: Sequence[Mapping[str, str]]) -> dict:
        return self._client.request(
            "POST", "/api/v1.3/order/uploadDocument", body={"token": token, "documents": list(documents)}
        )

    def raise_escalation(
        self, order_id: int, complaint: str, severity: str, description: Optional[str] = None, notes: Optional[str] = None
    ) -> dict:
        return self._client.request(
            "POST",
            "/api/v1.3/order/escalation",
            body={"orderId": order_id, "complaint": complaint, "severity": severity, "description": description, "notes": notes},
        )

    def test_webhook(self, order_id: int, order_status: Optional[str] = None) -> dict:
        """Trigger a test order webhook (sandbox/testing use)."""
        return self._client.request(
            "GET", "/api/v1.3/order/testWebhook", query={"orderId": order_id, "orderStatus": order_status}
        )

    # ---- camps ----------------------------------------------------------------

    def get_camps(self, **params: Any) -> dict:
        return self._client.request("GET", "/api/v1.3/camp/getCamps", query=params)

    def get_camp_details(self, camp_ls_id: str) -> dict:
        return self._client.request("GET", "/api/v1.3/camp/getCampDetails", query={"campLsId": camp_ls_id})

    def get_camp_slots(self, camp_ls_id: str) -> dict:
        return self._client.request("GET", "/api/v1.3/camp/getCampSlots", query={"campLsId": camp_ls_id})

    def place_camp_order(self, **body: Any) -> dict:
        """Required: camp_ls_id, appointment, name, email, gender, mobile
        (pass as campLsId, appointment, name, email, gender, mobile)."""
        return self._client.request("POST", "/api/v1.3/camp/placeCampOrder", body=body)
