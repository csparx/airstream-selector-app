from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://airstream-selector-frontend-f38d3ae0b526.herokuapp.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data
df = pd.read_csv("AirstreamDataset.csv")

def preprocess(df):
    df["Sleeps"] = df["Sleeps"].str.extract(r'(\d+)').astype(float)
    df["Price"] = df["Price"].replace(r'[\$,]', '', regex=True).astype(float)
    df["Length"] = df["Length"].replace(r'[^\d.]', '', regex=True).astype(float)  # Remove non-numeric characters
    df["GVWR"] = df["GVWR"].replace(r'[^\d.]', '', regex=True).astype(float)  # Remove non-numeric characters
    return df

df = preprocess(df)

@app.get("/recommend")
def recommend(
    sleeps: int = Query(None),  # Make sleeps optional
    budget: float = Query(None),  # Make budget optional
    offgrid: bool = Query(False),
    kitchen: str = Query(None),
    bathroom: str = Query(None),
    minLength: float = Query(None),  # Minimum length
    maxLength: float = Query(None),  # Maximum length
    maxGvwr: float = Query(None)  # Maximum GVWR
):
    filtered = df

    if sleeps is not None:  # Apply sleeps filter only if provided
        filtered = filtered[filtered["Sleeps"] >= sleeps]

    if budget is not None:  # Apply budget filter only if provided
        filtered = filtered[filtered["Price"] <= budget]

    if maxGvwr is not None:  # Apply max GVWR filter only if provided
        filtered = filtered[filtered["GVWR"] <= maxGvwr]

    if offgrid:
        filtered = filtered[filtered["Off-grid features"].str.contains("solar", case=False, na=False)]

    if kitchen:  # Apply kitchen filter only if provided
        filtered = filtered[filtered["Kitchen"].str.contains(kitchen, case=False, na=False)]
    
    if bathroom:  # Apply bathroom filter only if provided
        filtered = filtered[filtered["Bathroom"].str.contains(bathroom, case=False, na=False)]

    if minLength is not None:  # Apply minimum length filter only if provided
        filtered = filtered[filtered["Length"] >= minLength]

    if maxLength is not None:  # Apply maximum length filter only if provided
        filtered = filtered[filtered["Length"] <= maxLength]
    
    # Sort results by:
    # - Shortest length over min length selected first
    # - Lowest price within that length
    best = filtered.sort_values(by=["Length", "Price"], ascending=[True, True])

    if best.empty:
        return {"message": "No suitable model found."}

    result = best.iloc[0].to_dict()
    return {"recommendation": result}

app.mount("/", StaticFiles(directory="build", html=True))