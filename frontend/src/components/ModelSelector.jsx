import React from "react";

export default function ModelSelector({
  models,
  selected,
  onSelect,
  onRefresh,
  loading,
}) {
  return (
    <section className="card">
      <h3>Model</h3>
      <div className="row">
        <select
          value={selected || ""}
          onChange={(e) => onSelect(e.target.value)}
          disabled={loading}
        >
          {models.length === 0 ? (
            <option value="" disabled>
              (no models loaded) — click Refresh
            </option>
          ) : (
            <>
              <option value="" disabled>
                Select a model
              </option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </>
          )}
        </select>
        <button
          className="secondary"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh available models"
        >
          Refresh
        </button>
      </div>
      <p className="muted">
        Tip: choose a model when using <strong>LLM</strong> mode. If you see
        "(no models loaded)", your backend may not have an active LLM API key or
        models are still loading.
      </p>
    </section>
  );
}
