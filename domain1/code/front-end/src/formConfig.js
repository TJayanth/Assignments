// Goal 1 form schema — mirrors the exact feature set/order the gradient_boosting
// pipeline was trained on (domain1/code/goal1.ipynb), excluding patient_id and the target.
export const FIELD_GROUPS = [
  {
    title: "Demographics",
    fields: [
      { name: "age", label: "Age (years)", type: "number", min: 18, max: 100, step: 1, default: 55 },
      { name: "gender", label: "Gender", type: "select", options: ["female", "male"], default: "female" },
      { name: "bmi", label: "BMI", type: "number", min: 10, max: 60, step: 0.1, default: 27 },
      { name: "smoking_status", label: "Smoking Status", type: "select", options: ["never", "former", "current"], default: "never" },
    ],
  },
  {
    title: "Chronic Conditions",
    fields: [
      { name: "diabetes_flag", label: "Diabetes", type: "boolean", default: 0 },
      { name: "hypertension_flag", label: "Hypertension", type: "boolean", default: 0 },
      { name: "heart_disease_flag", label: "Heart Disease", type: "boolean", default: 0 },
      { name: "chronic_conditions_count", label: "Chronic Conditions Count", type: "number", min: 0, max: 10, step: 1, default: 1 },
    ],
  },
  {
    title: "Hospitalization Details",
    fields: [
      { name: "previous_admissions_12m", label: "Previous Admissions (last 12 months)", type: "number", min: 0, max: 20, step: 1, default: 0 },
      { name: "length_of_stay_days", label: "Length of Stay (days)", type: "number", min: 0, max: 60, step: 1, default: 4 },
      { name: "icu_admission_flag", label: "ICU Admission", type: "boolean", default: 0 },
      { name: "emergency_admission_flag", label: "Emergency Admission", type: "boolean", default: 0 },
      { name: "number_of_procedures", label: "Number of Procedures", type: "number", min: 0, max: 20, step: 1, default: 1 },
    ],
  },
  {
    title: "Lab Results",
    fields: [
      { name: "blood_glucose", label: "Blood Glucose (mg/dL)", type: "number", min: 0, max: 400, step: 0.1, default: 110 },
      { name: "cholesterol_level", label: "Cholesterol Level (mg/dL)", type: "number", min: 0, max: 400, step: 0.1, default: 180 },
      { name: "hemoglobin", label: "Hemoglobin (g/dL)", type: "number", min: 0, max: 25, step: 0.1, default: 13 },
      { name: "creatinine", label: "Creatinine (mg/dL)", type: "number", min: 0, max: 10, step: 0.01, default: 1 },
    ],
  },
  {
    title: "Medications",
    fields: [
      { name: "medications_count", label: "Medications Count", type: "number", min: 0, max: 30, step: 1, default: 5 },
      { name: "high_risk_medication_flag", label: "High-Risk Medication", type: "boolean", default: 0 },
      { name: "medication_changes_during_stay", label: "Medication Changes During Stay", type: "number", min: 0, max: 20, step: 1, default: 0 },
    ],
  },
  {
    title: "Discharge & Follow-up",
    fields: [
      { name: "followup_scheduled_flag", label: "Follow-up Scheduled", type: "boolean", default: 1 },
      { name: "discharge_destination", label: "Discharge Destination", type: "select", options: ["home", "nursing facility", "other hospital", "rehabilitation"], default: "home" },
      { name: "patient_education_score", label: "Patient Education Score (1-10)", type: "number", min: 1, max: 10, step: 0.1, default: 5 },
    ],
  },
  {
    title: "Insurance & Cost",
    fields: [
      { name: "insurance_type", label: "Insurance Type", type: "select", options: ["employer", "government", "private", "self-pay"], default: "private" },
      { name: "treatment_cost", label: "Treatment Cost ($)", type: "number", min: 0, max: 500000, step: 0.01, default: 25000 },
    ],
  },
];

export function buildInitialFormState() {
  const state = {};
  for (const group of FIELD_GROUPS) {
    for (const field of group.fields) {
      state[field.name] = field.default;
    }
  }
  return state;
}
