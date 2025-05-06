# Airstream Selector App 🚐✨

The Airstream Selector App is a quick, API-driven recommender that helps choose the perfect Airstream trailer based on a user's criteria. It filters by sleeping capacity, budget, off-grid capability, kitchen/bathroom needs, and minimum length and returns the smallest qualifying trailer that meets their criteria. This project was built using React for the frontend, FastAPI for the backend, and Pandas for data handling.

### 🔧 Built With
- **React** – user interface
- **FastAPI** – backend API
- **Pandas** – data processing

### ⚙️ Features
- Filter Airstream trailers based on:
  - Budget
  - Sleeping capacity
  - Tow weight
  - Desired length
- Prioritizes smallest model that meets your criteria
- Clean UI with responsive layout
- Fast, single-response API

### 📁 Structure
frontend/ # React app
backend/ # FastAPI + CSV processing

### 🚀 Running the App
1. **Backend**:
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
2. **Frontend**
    cd frontend
    npm install
    npm start