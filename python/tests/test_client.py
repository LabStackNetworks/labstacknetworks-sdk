import pytest
import responses

from labstacknetworks import LabStackClient, LabStackApiError


def test_requires_api_key():
    with pytest.raises(ValueError):
        LabStackClient(api_key="")


@responses.activate
def test_defaults_to_integration_base_url():
    responses.add(
        responses.GET,
        "https://integration.labstack.in/api/v1.3/network/getLabs",
        json={"status": "success", "labs": []},
        status=200,
    )

    client = LabStackClient(api_key="test-key")
    result = client.labs.get_labs()

    assert result["labs"] == []


@responses.activate
def test_sends_api_key_header_and_query_params():
    responses.add(
        responses.GET,
        "https://integration.labstack.in/api/v1.3/network/getLabs",
        json={"status": "success", "labs": []},
        status=200,
    )

    client = LabStackClient(api_key="test-key")
    client.labs.get_labs(lab_ids="1,2")

    request = responses.calls[0].request
    assert request.headers["ls-api-key"] == "test-key"
    assert request.url == "https://integration.labstack.in/api/v1.3/network/getLabs?labIds=1%2C2"


@responses.activate
def test_sends_json_body_on_post():
    responses.add(
        responses.POST,
        "https://integration.labstack.in/api/v1.3/order/placeOrder",
        json={"status": "success", "orderId": 1},
        status=200,
    )

    client = LabStackClient(api_key="test-key")
    client.labs.place_order(
        orderType="HOME_COLLECTION",
        appointment="2026-06-01T11:00:00+05:30",
        name="John Doe",
        email="john@example.com",
        gender="MALE",
        mobile="9999999999",
        pincode="560035",
    )

    import json

    body = json.loads(responses.calls[0].request.body)
    assert body["orderType"] == "HOME_COLLECTION"
    assert body["name"] == "John Doe"


@responses.activate
def test_raises_on_non_2xx_response():
    responses.add(
        responses.GET,
        "https://integration.labstack.in/api/v1.3/network/getLabs",
        json={"status": "failure", "error": "Authorisation failed"},
        status=401,
    )

    client = LabStackClient(api_key="bad-key")

    with pytest.raises(LabStackApiError) as excinfo:
        client.labs.get_labs()

    assert excinfo.value.status == 401
    assert str(excinfo.value) == "Authorisation failed"


@responses.activate
def test_raises_on_failure_status_even_with_http_200():
    responses.add(
        responses.GET,
        "https://integration.labstack.in/api/v1.3/order/getOrders",
        json={"status": "failure", "error": "page is out of range"},
        status=200,
    )

    client = LabStackClient(api_key="test-key")

    with pytest.raises(LabStackApiError, match="page is out of range"):
        client.labs.get_orders()
