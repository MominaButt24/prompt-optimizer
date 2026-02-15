import React, { useState, useRef, useEffect } from "react";

// PromptInput: main textarea input, Optimize and Save actions
export default function PromptInput({
  prompt,
  onChange,
  onOptimize,
  onSave,
  mode,
  onModeChange,
  loading,
}) {
  const [name, setName] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    // auto-resize
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    const sh = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = sh + 8 + "px";
  }, [prompt]);

  function handleCopy() {
    navigator.clipboard.writeText(prompt || "");
  }

  function handleSave() {
    const label = name || new Date().toLocaleString();
    onSave(label);
    setName("");
  }

  return (
    <section className="card">
      <h2>Prompt</h2>
      <textarea
        ref={textareaRef}
        className="prompt-textarea"
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or build a prompt here – be specific about the task, audience, and format."
        aria-label="Prompt"
      />

      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="segment"
            role="tablist"
            aria-label="Optimization mode"
          >
            <button
              className={mode === "rule" ? "active" : ""}
              onClick={() => onModeChange("rule")}
              disabled={loading}
              title="Fast rule-based optimization"
            >
              Basic
            </button>
            <button
              className={mode === "llm" ? "active" : ""}
              onClick={() => onModeChange("llm")}
              disabled={loading}
              title="Smart AI optimization (may use LLM)"
            >
              Smart AI
            </button>
          </div>
          <div
            className="small muted"
            title="Choose Smart AI for LLM-based rewrites"
          >
            Need more help?
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-primary"
            onClick={onOptimize}
            disabled={loading || !prompt}
            aria-disabled={loading || !prompt}
          >
            {loading ? <span className="spinner" /> : "Optimize"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
            disabled={loading}
            title="Copy prompt"
          >
            📋 Copy
          </button>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Save name (optional)"
            disabled={loading}
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.03)",
              background: "transparent",
              color: "var(--text)",
            }}
          />
          <button
            className="btn btn-secondary"
            onClick={handleSave}
            disabled={loading || !prompt}
          >
            💾 Save
          </button>
        </div>
      </div>
    </section>
  );
}
