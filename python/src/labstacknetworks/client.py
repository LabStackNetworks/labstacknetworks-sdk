from __future__ import annotations

from typing import Any, Mapping, Optional

import requests

from .errors import LabStackApiError

DEFAULT_BASE_URL = "https://integration.labstack.in"


class LabStackClient:
    """Client for the LabStack Labs and Provider APIs.

    See https://integration.labstack.in/api-docs for the published reference.
    """

    def __init__(self, api_key: str, base_url: str = DEFAULT_BASE_URL, session: Optional[requests.Session] = None):
        if not api_key:
            raise ValueError("LabStackClient requires an api_key")

        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self._session = session or requests.Session()

        from .resources.labs import LabsResource
        from .resources.provider import ProviderResource

        self.labs = LabsResource(self)
        self.provider = ProviderResource(self)

    def request(
        self,
        method: str,
        path: str,
        query: Optional[Mapping[str, Any]] = None,
        body: Optional[Mapping[str, Any]] = None,
    ) -> dict:
        url = self.base_url + path
        params = {k: v for k, v in (query or {}).items() if v is not None}

        response = self._session.request(
            method,
            url,
            params=params,
            json=body,
            headers={"ls-api-key": self.api_key},
        )

        try:
            data = response.json()
        except ValueError:
            data = {}

        if not response.ok or data.get("status") == "failure":
            message = data.get("error") or f"LabStack API request failed with status {response.status_code}"
            raise LabStackApiError(message, response.status_code, response.url)

        return data
