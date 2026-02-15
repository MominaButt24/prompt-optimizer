import React from "react";

export default function ModelInfo({ model, llmFallback }) {
  return (
    <div className="card model-info">
      <h4>Model</h4>
      <p>{model ? <strong>{model}</strong> : <em>Not used</em>}</p>
      {llmFallback ? (
        <p className="warning">LLM not available — used rule-based fallback</p>
      ) : null}
    </div>
  );
}
