from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_users():
    response = client.get("/users/")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)