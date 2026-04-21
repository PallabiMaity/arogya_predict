import React, { useState } from "react";
import DoctorDashboard from "./DoctorDashboard";
import InputPage from "./InputPage";
import PatientDashboard from "./PatientDashboard";
import LoginPage from "./LoginPage";

function App() {

  const [page, setPage] = useState("login");
  const [currentDoctor, setCurrentDoctor] = useState("");

  // LOGIN PAGE
  if (page === "login") {
    return <LoginPage setPage={setPage} setCurrentDoctor={setCurrentDoctor} />;
  }

  // DOCTOR DASHBOARD
  if (typeof page === "object" && page.type === "doctor") {
    return (
      <DoctorDashboard
        doctorName={currentDoctor}
        goInput={() => setPage("input")}
      />
    );
  }

  // INPUT PAGE (FIXED)
  if (page === "input") {
  return <InputPage goHome={() => setPage({ type: "doctor", refresh: Date.now() })} />;
  }

  // PATIENT DASHBOARD
  if (typeof page === "object" && page.type === "patient") {
    return <PatientDashboard patientId={page.id} />;
  }

  return null;
}

export default App;