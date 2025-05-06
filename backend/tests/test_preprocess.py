import pandas as pd

import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import preprocess

def test_preprocess():
    # Sample data
    data = {
        "Sleeps": ["2 people", "4 people"],
        "Price": ["$30,000", "$50,000"],
        "Length": ["20 ft", "30 ft"],
        "GVWR": ["5,000 lbs", "7,000 lbs"]
    }
    df = pd.DataFrame(data)

    # Process the data
    processed_df = preprocess(df)

    # Assertions
    assert processed_df["Sleeps"].tolist() == [2.0, 4.0]
    assert processed_df["Price"].tolist() == [30000.0, 50000.0]
    assert processed_df["Length"].tolist() == [20.0, 30.0]
    assert processed_df["GVWR"].tolist() == [5000.0, 7000.0]