const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function evaluateReadmissionRisk(payload) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const detail = errorBody?.detail ? JSON.stringify(errorBody.detail) : `Request failed with status ${response.status}`;
    throw new Error(detail);
  }

  return response.json();
}
