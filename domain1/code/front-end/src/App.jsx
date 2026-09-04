import { useState } from "react";
import { FIELD_GROUPS, buildInitialFormState } from "./formConfig.js";
import { evaluateReadmissionRisk } from "./api.js";
import ResultCard from "./ResultCard.jsx";

function toPayload(formState) {
  const payload = {};
  for (const group of FIELD_GROUPS) {
    for (const field of group.fields) {
      const raw = formState[field.name];
      payload[field.name] = field.type === "select" ? raw : Number(raw);
    }
  }
  return payload;
}

export default function App() {
  const [formState, setFormState] = useState(buildInitialFormState());
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await evaluateReadmissionRisk(toPayload(formState));
      setResult(response);
    } catch (err) {
      setError(err.message || "Failed to evaluate patient risk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header>
        <h1>Patient Admission — Readmission Risk Assessment</h1>
        <p className="subtitle">
          Enter patient details at admission and evaluate readmission risk using the Goal 1 model.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        {FIELD_GROUPS.map((group) => (
          <fieldset key={group.title}>
            <legend>{group.title}</legend>
            <div className="field-grid">
              {group.fields.map((field) => (
                <label key={field.name} className="field">
                  <span>{field.label}</span>
                  {field.type === "select" && (
                    <select
                      value={formState[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                  {field.type === "boolean" && (
                    <select
                      value={formState[field.name]}
                      onChange={(e) => handleChange(field.name, Number(e.target.value))}
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  )}
                  {field.type === "number" && (
                    <input
                      type="number"
                      value={formState[field.name]}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required
                    />
                  )}
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Evaluating..." : "Evaluate Readmission Risk"}
        </button>
      </form>

      {error && <p className="error-banner">{error}</p>}

      <ResultCard result={result} />
    </div>
  );
}
