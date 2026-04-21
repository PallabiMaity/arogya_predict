import React, { useState } from "react";
import "./styles.css";

function LoginPage({ setPage, setCurrentDoctor }) {

  const [role, setRole] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [patientId, setPatientId] = useState("");

  // ✅ DOCTOR LOGIN
  const handleDoctorLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/doctor-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          doctor_id: doctorId,
          password: password
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        // ✅ STORE DOCTOR NAME
        setCurrentDoctor(data.name);

        // ✅ GO TO DOCTOR DASHBOARD
        setPage({ type: "doctor" });

      } else {
        alert("Invalid Doctor ID or Password ❌");
      }

    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>

      <h1 style={{ marginBottom: "20px" }}>ArogyaPredict</h1>

      {/* SELECT ROLE */}
      {!role && (
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            className="button primary"
            onClick={() => setRole("doctor")}
          >
            Doctor Login
          </button>

          <button
            className="button"
            onClick={() => setRole("patient")}
          >
            Patient Login
          </button>
        </div>
      )}

      {/* DOCTOR LOGIN */}
      {role === "doctor" && (
        <div className="card" style={{ marginTop: "20px", display: "inline-block" }}>

          <h3>Doctor Login</h3>

          <input
            className="input"
            placeholder="Doctor ID"
            value={doctorId}
            onChange={e => setDoctorId(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <br />

          <button
            className="button primary"
            onClick={handleDoctorLogin}
          >
            Login
          </button>

          <br /><br />

          <button
            className="button"
            onClick={() => setRole("")}
          >
            ← Back
          </button>

        </div>
      )}

      {/* PATIENT LOGIN */}
      {role === "patient" && (
        <div className="card" style={{ marginTop: "20px", display: "inline-block" }}>

          <h3>Patient Login</h3>

          <input
            className="input"
            placeholder="Patient ID"
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
          />

          <br />

          <button
            className="button primary"
            onClick={() =>
              setPage({
                type: "patient",
                id: patientId
              })
            }
          >
            Login
          </button>

          <br /><br />

          <button
            className="button"
            onClick={() => setRole("")}
          >
            ← Back
          </button>

        </div>
      )}

    </div>
  );
}

export default LoginPage;