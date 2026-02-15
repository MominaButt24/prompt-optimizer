import React from "react";

// ScoreCard: displays an expressive score with a badge and progress bar
export default function ScoreCard({ score }) {
  if (score === null || score === undefined) {
    return (
      <div className="card">
        <h3>Score</h3>
        <p className="muted">Not scored yet</p>
      </div>
    );
  }

  const pct = Math.max(0, Math.min(100, Math.round(score)));
  const label =
    pct > 80 ? "Excellent" : pct > 60 ? "Good" : pct > 40 ? "OK" : "Needs Work";

  const badgeClass = pct > 80 ? "green" : pct > 60 ? "yellow" : "red";

  return (
    <div className="card">
      <div className="score-wrap">
        <div className={`score-badge ${badgeClass}`}>{pct}</div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0 }}>{label}</h4>
          <div className="score-progress" aria-hidden>
            <div style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
