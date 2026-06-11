from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register_user():
    response = client.post(
        "/auth/register",
        json={
            "username": "pytest_user",
            "email": "pytest@gmail.com",
            "password": "123456"
        }
    )

    assert response.status_code in [200, 400]


def test_login_user():
    response = client.post(
        "/auth/login",
        data={
            "username": "pytest_user",
            "password": "123456"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"