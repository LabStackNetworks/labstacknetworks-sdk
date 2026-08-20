from __future__ import annotations

from typing import Any, Mapping, Optional, Sequence


class ProviderResource:
    """Provider API — https://integration.labstack.in/api-docs/provider

    Speciality discovery, provider search, appointment booking, document
    management and video consultations.
    """

    def __init__(self, client):
        self._client = client

    # ---- admin ----------------------------------------------------------

    def get_status(self) -> dict:
        return self._client.request("GET", "/api/v1.0/admin/status")

    def get_balance(self) -> dict:
        return self._client.request("GET", "/api/v1.0/admin/getBalance")

    # ---- network / availability -------------------------------------------

    def get_provider_details(self, ls_provider_id: str, procedure_id: Optional[str] = None) -> dict:
        return self._client.request(
            "GET", "/api/v1.0/network/getProviderDetails", query={"lsProviderId": ls_provider_id, "procedureId": procedure_id}
        )

    def get_specialities(self, provider_type: str, tags: Optional[str] = None) -> dict:
        return self._client.request(
            "GET", "/api/v1.0/availability/getSpecialities", query={"providerType": provider_type, "tags": tags}
        )

    def get_providers(self, provider_type: str, appointment_type: str, **params: Any) -> dict:
        query = {"providerType": provider_type, "appointmentType": appointment_type, **params}
        return self._client.request("GET", "/api/v1.0/availability/getProviders", query=query)

    def get_provider_tags(self, **params: Any) -> dict:
        return self._client.request("GET", "/api/v1.0/availability/getProviderTags", query=params)

    def get_provider_tag_categories(self, **params: Any) -> dict:
        return self._client.request("GET", "/api/v1.0/availability/getProviderTagCategories", query=params)

    def get_procedures(self, **params: Any) -> dict:
        return self._client.request("GET", "/api/v1.0/availability/getProcedures", query=params)

    def get_procedure(self, procedure_id: str, **params: Any) -> dict:
        query = {"procedureId": procedure_id, **params}
        return self._client.request("GET", "/api/v1.0/availability/getProcedure", query=query)

    def get_appointment_slots(self, provider_type: str, appointment_type: str, date: str, **params: Any) -> dict:
        query = {"providerType": provider_type, "appointmentType": appointment_type, "date": date, **params}
        return self._client.request("GET", "/api/v1.0/availability/getAppointmentSlots", query=query)

    # ---- appointments -------------------------------------------------------

    def book_appointment(self, **body: Any) -> dict:
        """Required: appointment_type, appointment, name, email, mobile, gender
        (pass as appointmentType, appointment, name, email, mobile, gender)."""
        return self._client.request("POST", "/api/v1.0/appointment/bookAppointment", body=body)

    def get_appointments(self, **params: Any) -> dict:
        return self._client.request("GET", "/api/v1.0/appointment/getAppointments", query=params)

    def get_appointment_details(self, appointment_id: int) -> dict:
        return self._client.request("GET", "/api/v1.0/appointment/getAppointmentDetails", query={"appointmentId": appointment_id})

    def cancel_appointment(self, appointment_id: int, reason: Optional[str] = None) -> dict:
        return self._client.request(
            "GET", "/api/v1.0/appointment/cancelAppointment", query={"appointmentId": appointment_id, "reason": reason}
        )

    def reschedule_appointment(self, appointment_id: int, appointment_time: str) -> dict:
        return self._client.request(
            "GET",
            "/api/v1.0/appointment/rescheduleAppointment",
            query={"appointmentId": appointment_id, "appointmentTime": appointment_time},
        )

    def raise_escalation(
        self,
        appointment_id: int,
        complaint: str,
        severity: str,
        description: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> dict:
        return self._client.request(
            "POST",
            "/api/v1.0/appointment/escalation",
            body={
                "appointmentId": appointment_id,
                "complaint": complaint,
                "severity": severity,
                "description": description,
                "notes": notes,
            },
        )

    def test_webhook(self, appointment_id: int, appointment_status: Optional[str] = None) -> dict:
        """Trigger a test appointment webhook (sandbox/testing use)."""
        return self._client.request(
            "GET",
            "/api/v1.0/appointment/testWebhook",
            query={"appointmentId": appointment_id, "appointmentStatus": appointment_status},
        )

    # ---- documents & meeting -------------------------------------------------

    def upload_document(self, appointment_id: int, documents: Sequence[Mapping[str, str]]) -> dict:
        return self._client.request(
            "POST",
            "/api/v1.0/appointment/uploadDocument",
            body={"appointmentId": appointment_id, "documents": list(documents)},
        )

    def get_document(self, document_id: int) -> dict:
        return self._client.request("GET", "/api/v1.0/appointment/getDocument", query={"documentId": document_id})

    def delete_document(self, **params: Any) -> dict:
        """Deprecated: currently disabled server-side, always responds 501 Not Implemented."""
        return self._client.request("DELETE", "/api/v1.0/appointment/deleteDocument", query=params)

    def delete_all_documents(self, **params: Any) -> dict:
        """Deprecated: currently disabled server-side, always responds 501 Not Implemented."""
        return self._client.request("DELETE", "/api/v1.0/appointment/deleteAllDocuments", query=params)

    def get_prescription_pdf(self, appointment_id: int) -> dict:
        return self._client.request("GET", "/api/v1.0/appointment/getPrescriptionPdf", query={"appointmentId": appointment_id})

    def get_authenticated_meeting_link(self, appointment_id: int, participant_type: Optional[str] = None) -> dict:
        return self._client.request(
            "GET",
            "/api/v1.0/appointment/getAuthenticatedMeetingLink",
            query={"appointmentId": appointment_id, "participantType": participant_type},
        )
