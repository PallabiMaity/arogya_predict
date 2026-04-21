import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import "./styles.css";

function DoctorDashboard({ goInput, doctorName, refresh }) {

  const [data, setData] = useState({ low: [], medium: [], high: [], counts: {} });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
  fetch("http://127.0.0.1:8000/patients")
    .then(res => res.json())
    .then(setData);
    }, [refresh]);

  // ✅ KEEP ORIGINAL FILTER LOGIC + ADD SEARCH
  const getFilteredData = () => {

    let list = [...data.low, ...data.medium, ...data.high];

    // FILTER (original feature)
    if (filter !== "all") {
      list = data[filter];
    }

    // SEARCH (new feature, does NOT break filter)
    if (search) {
      list = list.filter(p =>
        p.patient_id.toLowerCase().includes(search.toLowerCase())
      );
    }

    return list;
  };

  // ✅ CARDS (UNCHANGED + UI IMPROVED)
  const renderCard = (label, value, color, key) => (
    <div
      onClick={() => setFilter(key)}
      className="card"
      style={{
        flex: 1,
        borderLeft: `6px solid ${color}`,
        border: filter === key ? `3px solid ${color}` : "none",
        cursor: "pointer"
      }}
    >
      <h4>{label}</h4>
      <h2>{value}</h2>
    </div>
  );

  // ✅ CHART (UNCHANGED)
  const chartData = [
    { name: "Low", value: data.counts.low || 0 },
    { name: "Medium", value: data.counts.medium || 0 },
    { name: "High", value: data.counts.high || 0 }
  ];

  const COLORS = ["green", "orange", "red"];

  return (
    <div style={{ padding: "30px" }}>

      {/* 🔷 HEADER (UPGRADED, NOT REPLACED) */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h2>Doctor Dashboard</h2>

        {/* 👩‍⚕️ DOCTOR PROFILE */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#fff",
          padding: "8px 12px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
            width="40"
            alt="doctor"
          />
          <span>{doctorName}</span>
        </div>
      </div>

      {/* 🔍 SEARCH (ADDED FEATURE) */}
      <input
        className="input"
        placeholder="Search Patient ID..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <br /><br />

      {/* ➕ ADD PATIENT */}
      <button className="button primary" onClick={goInput}>
        + Add Patient
      </button>

      {/* 📊 CARDS + CHART */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

        {/* CARDS */}
        <div style={{ display: "flex", gap: "20px", flex: 3 }}>
          {renderCard("Low", data.counts.low, "green", "low")}
          {renderCard("Medium", data.counts.medium, "orange", "medium")}
          {renderCard("High", data.counts.high, "red", "high")}
        </div>

        {/* CHART */}
        <div className="card" style={{ flex: 1 }}>
          <h4>Risk Distribution</h4>
          <PieChart width={200} height={200}>
            <Pie data={chartData} dataKey="value" innerRadius={40} outerRadius={70}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

      </div>

      {/* 📌 TITLE */}
      <h3 style={{ marginTop: "20px" }}>
        {filter === "all"
          ? "All Patients"
          : filter.toUpperCase() + " Risk Patients"}
      </h3>

      {/* 📋 TABLE */}
      <div className="card">
        <table width="100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Disease</th>
              <th>Risk</th>
              <th>Probability</th>
            </tr>
          </thead>

          <tbody>
            {getFilteredData().map((p, i) => (
              <tr key={i}>
                <td>{p.patient_id}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.disease}</td>
                <td style={{
                  color:
                    p.risk === "Low Risk"
                      ? "green"
                      : p.risk === "Medium Risk"
                      ? "orange"
                      : "red"
                }}>
                  {p.risk}
                </td>
                <td>{p.probability}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default DoctorDashboard;