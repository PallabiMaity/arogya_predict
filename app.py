from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import pickle
import numpy as np
from datetime import datetime, timezone

# -------- LOAD MODEL --------
model = pickle.load(open("model.pkl", "rb"))

# -------- DATABASE --------
client = MongoClient("mongodb://127.0.0.1:27017")
db = client["hospital_db"]
collection = db["patients"]
doctors = db["doctors"]

app = FastAPI()

# -------- CORS --------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- INPUT --------
class Patient(BaseModel):
    patient_id: str
    name: str
    contact: str
    age: int
    disease: str
    admission_date: str
    discharge_date: str


# -------- PREDICT (YOUR ORIGINAL LOGIC - UNCHANGED) --------
@app.post("/predict")
def predict(data: Patient):

    admission = datetime.strptime(data.admission_date, "%Y-%m-%d")
    discharge = datetime.strptime(data.discharge_date, "%Y-%m-%d")

    time_in_hospital = (discharge - admission).days
    days_after = (datetime.now(timezone.utc) - discharge.replace(tzinfo=timezone.utc)).days

    disease = data.disease.lower()

    # FEATURE ENGINEERING
    if disease == "diabetes":
        med = 5 if data.age < 50 else 8
        lab = 25 if data.age < 50 else 40
    elif disease == "cardiac":
        med = 6 if data.age < 50 else 10
        lab = 30 if data.age < 50 else 50
    elif disease == "copd":
        med = 4 if data.age < 50 else 7
        lab = 20 if data.age < 50 else 35
    else:
        med = 4
        lab = 20

    out = 1 if data.age < 50 else 3
    emergency = 0 if data.age < 50 else 2
    inp = 1 if data.age < 50 else 4

    input_data = np.array([[data.age, time_in_hospital, lab, med, out, emergency, inp]])
    ml_score = model.predict_proba(input_data)[0][1]

    # CLINICAL SCORE
    clinical = 0

    if data.age < 30:
        clinical += 0.02
    elif data.age < 45:
        clinical += 0.05
    elif data.age < 60:
        clinical += 0.1
    else:
        clinical += 0.18

    if disease in ["diabetes", "cardiac"]:
        clinical += 0.05

    if time_in_hospital > 7:
        clinical += 0.1
    elif time_in_hospital > 3:
        clinical += 0.05

    # TIME SCORE
    if days_after > 40:
        time_score = 0.30
    elif days_after > 30:
        time_score = 0.25
    elif days_after > 20:
        time_score = 0.18
    elif days_after > 10:
        time_score = 0.10
    elif days_after > 3:
        time_score = 0.05
    else:
        time_score = 0

    # FINAL PROBABILITY
    final_prob = (
        ml_score * 0.55 + # ml 
        clinical * 0.25 + #age
        time_score * 0.20 # days count after discharge
    )

    # CRITICAL RULES
    if data.age >= 75 and days_after > 30:
        final_prob = max(final_prob, 0.85)

    final_prob = max(min(final_prob, 0.95), 0.05)

    if final_prob < 0.3:
        risk = "Low Risk"
    elif final_prob < 0.7:
        risk = "Medium Risk"
    else:
        risk = "High Risk"

    result = {
        "patient_id": data.patient_id,
        "name": data.name,
        "contact": data.contact,
        "age": data.age,
        "disease": data.disease,
        "admission_date": data.admission_date,
        "discharge_date": data.discharge_date,
        "probability": round(float(final_prob), 3),
        "risk": risk
    }

    collection.insert_one(result)
    result.pop("_id", None)

    return result


# -------- DYNAMIC UPDATE (FIXED + SAFE) --------
def dynamic_update(p):

    date_val = p.get("discharge_date")

    # HANDLE NONE
    if not date_val:
        return float(p.get("probability", 0)), p.get("risk", "Low Risk")

    # HANDLE DATETIME OR STRING
    if isinstance(date_val, datetime):
        discharge = date_val
    else:
        try:
            discharge = datetime.fromisoformat(str(date_val))
        except:
            try:
                discharge = datetime.strptime(str(date_val), "%Y-%m-%d")
            except:
                discharge = datetime.strptime(str(date_val), "%d-%m-%Y")

    # TIME CALCULATION (UPDATED)
    days_after = (datetime.now(timezone.utc) - discharge.replace(tzinfo=timezone.utc)).days

    base = float(p.get("probability", 0))

    if days_after > 40:
        boost = 0.30
    elif days_after > 20:
        boost = 0.20
    else:
        boost = 0.05

    updated = min(base + boost, 0.95)

    if updated < 0.3:
        risk = "Low Risk"
    elif updated < 0.7:
        risk = "Medium Risk"
    else:
        risk = "High Risk"

    return round(updated, 3), risk


# -------- DOCTOR DASHBOARD --------
@app.get("/patients")
def get_patients():

    patients = list(collection.find({}, {"_id": 0}))

    low, medium, high = [], [], []

    for p in patients:
        prob, risk = dynamic_update(p)

        p["probability"] = prob
        p["risk"] = risk

        if risk == "Low Risk":
            low.append(p)
        elif risk == "Medium Risk":
            medium.append(p)
        else:
            high.append(p)

    return {
        "low": low,
        "medium": medium,
        "high": high,
        "counts": {
            "low": len(low),
            "medium": len(medium),
            "high": len(high)
        }
    }


# -------- PATIENT DASHBOARD --------
@app.get("/patient/{patient_id}")
def get_patient(patient_id: str):

    p = collection.find_one({"patient_id": patient_id}, {"_id": 0})

    if not p:
        return {"error": "Not found"}

    prob, risk = dynamic_update(p)

    p["probability"] = prob
    p["risk"] = risk

    return p

## doctor log in
@app.post("/doctor-login")
def doctor_login(data: dict):

    doctor = doctors.find_one({
        "doctor_id": data.get("doctor_id"),
        "password": data.get("password")
    })

    if not doctor:
        return {"status": "fail", "message": "Invalid credentials"}

    return {
        "status": "success",
        "doctor_id": doctor["doctor_id"],
        "name": doctor.get("name", "Doctor")
    }