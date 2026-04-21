import React, { useEffect, useState } from "react";
import "./styles.css";

function PatientDashboard({ patientId }) {

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/patient/${patientId}`)
      .then(res => res.json())
      .then(setPatient);
  }, [patientId]);

  if (!patient) {
    return <h2 style={{ textAlign: "center", marginTop: "100px" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px"
      }}>
        <h2>Patient Dashboard</h2>

        {/* NEUTRAL USER ICON */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            width="40"
            alt="user"
          />
          <span>{patient.name}</span>
        </div>
      </div>

      {/* CARD */}
      <div className="card">

        <h3>Patient Details</h3>

        <p><b>Patient ID:</b> {patient.patient_id}</p>
        <p><b>Name:</b> {patient.name}</p>
        <p><b>Age:</b> {patient.age}</p>
        <p><b>Disease:</b> {patient.disease}</p>

        <hr />

        <h3>Health Status</h3>

        <p>
          <b>Risk Level:</b>
          <span style={{
            color:
              patient.risk === "Low Risk"
                ? "green"
                : patient.risk === "Medium Risk"
                ? "orange"
                : "red",
            marginLeft: "10px"
          }}>
            {patient.risk}
          </span>
        </p>

        <p><b>Probability:</b> {patient.probability}</p>

        <hr />

        <h3>Recommendation</h3>

        <div style={{
          padding: "15px",
          borderRadius: "10px",
          background:
            patient.risk === "Low Risk"
              ? "#e6ffe6"
              : patient.risk === "Medium Risk"
              ? "#fff5e6"
              : "#ffe6e6"
        }}>
          {patient.risk === "Low Risk" &&
            "You are in good condition. Maintain a healthy lifestyle."}

          {patient.risk === "Medium Risk" &&
            "Monitor your health regularly and consult a doctor."}

          {patient.risk === "High Risk" &&
            "Immediate medical attention is recommended."}
        </div>

      </div>

    </div>
  );
}

export default PatientDashboard;