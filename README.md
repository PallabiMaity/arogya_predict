#  AarogyaPredict

AarogyaPredict is an AI-powered healthcare monitoring system that predicts patient risk levels (Low, Medium, High) using machine learning and provides real-time insights through doctor and patient dashboards.

---

##  Features

*  **Patient Risk Prediction** (Low / Medium / High)
*  **Doctor Dashboard** – view and manage all patients
*  **Patient Dashboard** – view personal health status
*  **Dynamic Risk Update** based on discharge date
*  **Add Patient Records**
*  **Doctor Login System**
*  **Search Patient by ID**
*  **Probability-based Risk Classification**

---

##  Working Principle

1. Doctor enters patient details
2. Machine Learning model predicts probability
3. Risk is classified into:

   * Low Risk
   * Medium Risk
   * High Risk
4. Dynamic logic updates risk over time
5. Results are displayed on dashboards

---

##  Tech Stack

### 🔹 Frontend

* React.js
* CSS

### 🔹 Backend

* FastAPI (Python)

### 🔹 Database

* MongoDB

### 🔹 Machine Learning

* Logistic Regression / Probability-based model

---

##  Project Structure

```
arogya-predict/
 ├── backend/
 │    ├── app.py
 │    ├── train_model.py
 │    ├── diabetic_data.csv
 │
 ├── frontend/
 │    ├── public/
 │    ├── src/
 │    ├── package.json
 │
 ├── README.md
```

---

##  Setup Instructions

### 1️ Clone Repository

```
git clone https://github.com/YOUR_USERNAME/arogya-predict.git
cd arogya-predict
```

---

### 2️ Run Backend

```
cd backend
pip install -r requirements.txt
python -m uvicorn app:app --reload
```

---

### 3️ Run Frontend

```
cd frontend
npm install
npm start
```

---

## ⚠️ Important Note

The trained ML model file (`model.pkl`) is not included due to GitHub size limitations.
You can generate it by running:

```
python train_model.py
```

---

## 📊 Risk Levels

| Risk Level     | Description                 |
| -------------- | --------------------------- |
| 🟢 Low Risk    | Stable condition            |
| 🟡 Medium Risk | Needs monitoring            |
| 🔴 High Risk   | Immediate medical attention |

---

##  Future Enhancements

*  SMS Notification System
*  Emergency Alerts
*  Appointment Booking
*  Advanced Analytics Dashboard

---



---

## 📌 Conclusion

AarogyaPredict helps in early detection of patient risk using AI and improves healthcare decision-making through real-time monitoring and smart dashboards.

