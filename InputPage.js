import React, { useState } from "react";
import "./styles.css";

function InputPage({ goHome }) {

  const [form, setForm] = useState({});
  const [result, setResult] = useState(null); // ✅ store prediction

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      // ✅ SHOW RESULT (instead of going back immediately)
      setResult(data);

    } catch (error) {
      console.error(error);
      alert("Error ❌");
    }
  };

  return (
    <div style={{ padding: "30px" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px"
      }}>
        <h2>Add Patient Details</h2>

        <button className="button" onClick={goHome}>
          ← Dashboard
        </button>
      </div>

      {/* FORM */}
      <div className="card">

        <input className="input" placeholder="Patient ID"
          onChange={e => handleChange("patient_id", e.target.value)} />

        <input className="input" placeholder="Name"
          onChange={e => handleChange("name", e.target.value)} />

        <input className="input" placeholder="Contact"
          onChange={e => handleChange("contact", e.target.value)} />

        <input className="input" placeholder="Age"
          onChange={e => handleChange("age", e.target.value)} />

        {/* DROPDOWN */}
        <select className="input"
          onChange={e => handleChange("disease", e.target.value)}>
          <option value="">Select Disease</option>
          <option value="diabetes">Diabetes</option>
          <option value="hypertension">Hypertension</option>
          <option value="heart disease">Heart Disease</option>
        </select>

        {/* DATES */}
        <p><b>Admission Date (Date of Hospital Entry)</b></p>
        <input className="input" type="date"
          onChange={e => handleChange("admission_date", e.target.value)} />

        <p><b>Discharge Date (Date of Leaving Hospital)</b></p>
        <input className="input" type="date"
          onChange={e => handleChange("discharge_date", e.target.value)} />

        <br />

        <button className="button primary" onClick={handleSubmit}>
          Submit
        </button>

      </div>

      {/* ✅ RESULT DISPLAY */}
      {result && (
        <div className="card" style={{ marginTop: "20px" }}>

          <h3>Prediction Result</h3>

          <p>
            <b>Risk:</b>
            <span style={{
              color:
                result.risk === "Low Risk"
                  ? "green"
                  : result.risk === "Medium Risk"
                  ? "orange"
                  : "red",
              marginLeft: "10px"
            }}>
              {result.risk}
            </span>
          </p>

          <p>
            <b>Probability:</b> {result.probability}
          </p>

          {/* OPTIONAL MESSAGE */}
          <div style={{
            marginTop: "10px",
            padding: "10px",
            borderRadius: "8px",
            background:
              result.risk === "Low Risk"
                ? "#e6ffe6"
                : result.risk === "Medium Risk"
                ? "#fff5e6"
                : "#ffe6e6"
          }}>
            {result.risk === "Low Risk" &&
              "Patient is stable. Maintain healthy lifestyle."}

            {result.risk === "Medium Risk" &&
              "Monitor regularly and consult doctor."}

            {result.risk === "High Risk" &&
              "Immediate medical attention required!"}
          </div>

          <br />

          {/* GO BACK BUTTON */}
          <button className="button" onClick={goHome}>
            Back to Dashboard
          </button>

        </div>
      )}

    </div>
  );
}

export default InputPage;