import React, { useState } from "react";
import { Range } from "react-range"; // Import the Range component from react-range
import "./App.css"; // Import your CSS file

function App() {
  const [lengthRange, setLengthRange] = useState([16, 33]); // Default range for min and max length
  const [gvwr, setGvwr] = useState("");
  const [sleeps, setSleeps] = useState("");
  const [budget, setBudget] = useState("");
  const [offgrid, setOffgrid] = useState(false);
  const [kitchen, setKitchen] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const queryParams = new URLSearchParams();

    if (sleeps) queryParams.append("sleeps", sleeps);
    if (budget) queryParams.append("budget", budget);
    if (offgrid) queryParams.append("offgrid", offgrid);
    if (kitchen) queryParams.append("kitchen", kitchen);
    if (bathroom) queryParams.append("bathroom", bathroom);
    queryParams.append("minLength", lengthRange[0]);
    queryParams.append("maxLength", lengthRange[1]);
    if (gvwr) queryParams.append("maxGvwr", gvwr);

    const query = queryParams.toString();
    console.log("Query String:", query);
    const res = await fetch(`http://localhost:8000/recommend?${query}`);
    const data = await res.json();
    setResult(data.recommendation || data.message);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Airstream Selector</h1>
      <p>Find the perfect Airstream travel trailer for your lifestyle. Use the form below to select your preferences, and we'll help you narrow down the best models that match your needs. Whether you're a weekend adventurer or planning full-time travel, this tool makes it easy to explore your ideal fit.</p>
      <div>
        <label>Length Range:</label>
        <div style={{ margin: "20px 0" }}>
        <Range
          step={1} // Increment by 1
          min={16} // Minimum value
          max={33} // Maximum value
          values={lengthRange} // Current range values
          onChange={(values) => setLengthRange(values)} // Update state on change
          renderTrack={({ props, children }) => {
            const { key, ...restProps } = props; // Extract the key
            return (
              <div
                key={key} // Pass the key explicitly
                {...restProps} // Spread the remaining props
                style={{
                  ...restProps.style,
                  height: "2px",
                  background: `linear-gradient(
                    to right,
                    #ddd ${((lengthRange[0] - 16) / (33 - 16)) * 100}%,
                    #007bff ${((lengthRange[0] - 16) / (33 - 16)) * 100}%,
                    #007bff ${((lengthRange[1] - 16) / (33 - 16)) * 100}%,
                    #ddd ${((lengthRange[1] - 16) / (33 - 16)) * 100}%
                  )`,
                  borderRadius: "3px",
                  position: "relative",
                }}
              >
                {children}
              </div>
            );
          }}
          renderThumb={({ props, index }) => {
            const { key, ...restProps } = props; // Extract the key
            return (
              <div
                key={key} // Pass the key explicitly
                {...restProps} // Spread the remaining props
                style={{
                  ...restProps.style,
                  height: "15px",
                  width: "15px",
                  backgroundColor: "#007bff",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    bottom: "-25px",
                    color: "#007bff",
                    fontSize: "14px",
                  }}
                >
                  {lengthRange[index]} ft
                </span>
              </div>
            );
          }}
        />
        </div>
      </div>
      <div>
        <label>Max Weight of Travel Trailer (GVWR): </label>
        <input
          type="number"
          value={gvwr}
          onChange={(e) => setGvwr(e.target.value)}
          placeholder="Enter max GVWR (lbs)"
        />
      </div>
      <div>
        <label>Number of Sleepers: </label>
        <input type="number" value={sleeps} onChange={(e) => setSleeps(e.target.value)} placeholder="Enter min number of sleepers" />
      </div>
      <div>
        <label>Max Budget ($): </label>
        <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Enter max budget amount" />
      </div>
      <div>
        <label>Kitchen Features: </label>
        <input
          type="text"
          value={kitchen}
          onChange={(e) => setKitchen(e.target.value)}
          placeholder="e.g., full, compact"
        />
      </div>
      <div>
        <label>Bathroom Features: </label>
        <input
          type="text"
          value={bathroom}
          onChange={(e) => setBathroom(e.target.value)}
          placeholder="e.g., full, half"
        />
      </div>
      <div>
        <label>
          <input type="checkbox" checked={offgrid} onChange={() => setOffgrid(!offgrid)} />
          Interested in Off-Grid Features
        </label>
      </div>
      
      <button onClick={handleSubmit}>Find My Airstream</button>
      {result && typeof result === "object" ? (
        <div className="result-card">
          <div className="result-content">
            <div className="result-text">
              <h2>{result.Model}</h2>
              <p><strong>Length:</strong> {result.Length} ft</p>
              <p><strong>GVWR:</strong> {result.GVWR}</p>
              <p><strong>Sleeps:</strong> {result.Sleeps}</p>
              <p><strong>Price:</strong> ${result.Price}</p>
              <p><strong>Off-grid Features:</strong> {result["Off-grid features"]}</p>
              <p><strong>Kitchen:</strong> {result.Kitchen}</p>
              <p><strong>Bathroom:</strong> {result.Bathroom}</p>
            </div>
            {result.Photo && (
              <div className="result-image">
                <img
                  src={`/images/${result.Photo.replace(/\s+/g, '_')}`}
                  alt={result.Model}
                />
              </div>
            )}
          </div>
        </div>
      ) : result ? (
        <p>{result}</p>
      ) : null}
    </div>
  );
}

export default App;
