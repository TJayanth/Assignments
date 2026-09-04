"""
Goal 1 inference API — serves the selected `gradient_boosting` pipeline
(domain1/temp/model/gradient_boosting.pkl) to the React front-end.
No retraining and no rebuilt preprocessing: the pickle already contains the
fitted ColumnTransformer + classifier from goal1.ipynb.
"""
from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# domain1/code/back-end/main.py -> domain1/temp/model/gradient_boosting.pkl
MODEL_PATH = Path(__file__).resolve().parents[2] / "temp" / "model" / "gradient_boosting.pkl"

# Tertile cut points recomputed from goal1.ipynb's inference-runner section
# (predict_proba over the full cleaned_dataSet.csv population).
RISK_LOW_CUT = 0.115879630144803
RISK_HIGH_CUT = 0.6577318866891518

# Exact training feature order (all cleaned_dataSet.csv columns except patient_id/readmission_flag).
FEATURE_ORDER = [
    "age", "gender", "bmi", "smoking_status", "diabetes_flag", "hypertension_flag",
    "heart_disease_flag", "chronic_conditions_count", "previous_admissions_12m",
    "length_of_stay_days", "icu_admission_flag", "emergency_admission_flag",
    "number_of_procedures", "blood_glucose", "cholesterol_level", "hemoglobin",
    "creatinine", "medications_count", "high_risk_medication_flag",
    "medication_changes_during_stay", "followup_scheduled_flag", "discharge_destination",
    "patient_education_score", "insurance_type", "treatment_cost",
]

_model = None


def get_model():
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
    return _model


class PatientInput(BaseModel):
    age: int = Field(ge=0, le=120)
    gender: Literal["female", "male"]
    bmi: float = Field(ge=0)
    smoking_status: Literal["never", "former", "current"]
    diabetes_flag: Literal[0, 1]
    hypertension_flag: Literal[0, 1]
    heart_disease_flag: Literal[0, 1]
    chronic_conditions_count: int = Field(ge=0)
    previous_admissions_12m: int = Field(ge=0)
    length_of_stay_days: int = Field(ge=0)
    icu_admission_flag: Literal[0, 1]
    emergency_admission_flag: Literal[0, 1]
    number_of_procedures: int = Field(ge=0)
    blood_glucose: float = Field(ge=0)
    cholesterol_level: float = Field(ge=0)
    hemoglobin: float = Field(ge=0)
    creatinine: float = Field(ge=0)
    medications_count: int = Field(ge=0)
    high_risk_medication_flag: Literal[0, 1]
    medication_changes_during_stay: int = Field(ge=0)
    followup_scheduled_flag: Literal[0, 1]
    discharge_destination: Literal["home", "nursing facility", "other hospital", "rehabilitation"]
    patient_education_score: float = Field(ge=0)
    insurance_type: Literal["employer", "government", "private", "self-pay"]
    treatment_cost: float = Field(ge=0)


class PredictionResponse(BaseModel):
    readmission_risk_score: float
    risk_segment: Literal["low", "medium", "high"]
    high_risk: bool
    model: str = "gradient_boosting"


app = FastAPI(title="MediCare Readmission Risk API (Goal 1)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "model_path": str(MODEL_PATH), "model_exists": MODEL_PATH.exists()}


@app.post("/predict", response_model=PredictionResponse)
def predict(patient: PatientInput):
    try:
        model = get_model()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    row = pd.DataFrame([patient.model_dump()])[FEATURE_ORDER]
    proba = float(model.predict_proba(row)[:, 1][0])
    label = int(model.predict(row)[0])

    if proba < RISK_LOW_CUT:
        segment = "low"
    elif proba < RISK_HIGH_CUT:
        segment = "medium"
    else:
        segment = "high"

    return PredictionResponse(
        readmission_risk_score=round(proba, 4),
        risk_segment=segment,
        high_risk=bool(label == 1),
    )
