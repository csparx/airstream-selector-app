import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_recommend_no_filters():
    response = client.get("/recommend")
    assert response.status_code == 200
    assert "recommendation" in response.json() or "message" in response.json()

def test_recommend_with_filters():
    response = client.get("/recommend", params={
        "sleeps": 4,
        "budget": 50000,
        "length": 20,
        "maxGvwr": 7000
    })
    assert response.status_code == 200
    data = response.json()
    assert "recommendation" in data or "message" in data
    if "recommendation" in data:
        recommendation = data["recommendation"]
        assert recommendation["Sleeps"] >= 4
        assert recommendation["Price"] <= 50000
        assert recommendation["Length"] >= 20
        assert recommendation["GVWR"] <= 7000