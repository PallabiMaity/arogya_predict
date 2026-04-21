import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import pickle

# Load dataset
df = pd.read_csv("diabetic_data.csv")

# Select important features
df = df[[
    "age",
    "time_in_hospital",
    "num_lab_procedures",
    "num_medications",
    "number_outpatient",
    "number_emergency",
    "number_inpatient",
    "readmitted"
]]

# Replace missing values
df = df.replace("?", np.nan)
df = df.dropna()

# Convert readmitted column to binary
df["readmitted"] = df["readmitted"].apply(
    lambda x: 0 if x == "NO" else 1
)

# Convert age from [50-60] → 50
def convert_age(age):
    return int(age.strip("[]").split("-")[0])

df["age"] = df["age"].apply(convert_age)

# Features and target
X = df.drop("readmitted", axis=1)
y = df["readmitted"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Test accuracy
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# Save model
pickle.dump(model, open("model.pkl", "wb"))

print("✅ Model saved as model.pkl")