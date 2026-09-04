const SEGMENT_STYLES = {
  low: { color: "#1b7f3a", background: "#e6f6ea", label: "Low Risk" },
  medium: { color: "#a3670b", background: "#fdf1dc", label: "Medium Risk" },
  high: { color: "#b3261e", background: "#fbe6e5", label: "High Risk" },
};

export default function ResultCard({ result }) {
  if (!result) return null;

  const style = SEGMENT_STYLES[result.risk_segment] ?? SEGMENT_STYLES.medium;
  const percent = Math.round(result.readmission_risk_score * 1000) / 10;

  return (
    <div className="result-card" style={{ borderColor: style.color }}>
      <div className="result-header">
        <span className="segment-badge" style={{ color: style.color, background: style.background }}>
          {style.label}
        </span>
        <span className="binary-label">
          Model classification:{" "}
          <strong style={{ color: result.high_risk ? "#b3261e" : "#1b7f3a" }}>
            {result.high_risk ? "High Risk" : "Not High Risk"}
          </strong>
        </span>
      </div>

      <div className="score-row">
        <span>Readmission risk probability</span>
        <span className="score-value">{percent}%</span>
      </div>
      <div className="probability-bar">
        <div
          className="probability-fill"
          style={{ width: `${percent}%`, background: style.color }}
        />
      </div>

      <p className="result-footnote">
        Score is tentative and may not reflect the final risk assessment.
      </p>
    </div>
  );
}
