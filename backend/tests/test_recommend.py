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
        "budget": 500000,
        "offgrid": True,
        "kitchen": "full",
        "bathroom": "full",
        "maxLength": 32,
        "minLength": 20,
        "maxGvwr": 10000,
    })
    assert response.status_code == 200
    data = response.json()
    assert "recommendation" in data or "message" in data
    if "recommendation" in data:
        recommendation = data["recommendation"]
        assert recommendation["Sleeps"] >= 4
        assert recommendation["Price"] <= 500000
        assert recommendation["Off-grid features"] == "solar"
        assert "full" in recommendation["Kitchen"].lower()
        assert "full" in recommendation["Bathroom"].lower()
        assert recommendation["Length"] >= 32
        assert recommendation["GVWR"] <= 10000