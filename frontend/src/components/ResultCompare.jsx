import React, { useEffect, useState } from "react";

// ResultCompare: shows original and optimized with animations and copy feedback
export default function ResultCompare({
  original,
  optimized,
  onOptimize,
  loading,
  onCopy,
}) {
  const [copied, setCopied] = useState(null);
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    if (optimized) {
      setEnter(true);
      const t = setTimeout(() => setEnter(false), 800);
      return () => clearTimeout(t);
    }
  }, [optimized]);

  function copy(text, label) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(label);
    onCopy && onCopy(`${label} copied to clipboard`);
    setTimeout(() => setCopied(null), 1600);
  }

  return (
    <section className={`card compare`}>
      <div>
        <h4>Original</h4>
        <div className="result-block">
          <pre style={{ margin: 0 }}>{original || <em>(empty)</em>}</pre>
        </div>
        <div style={{ marginTop: 8 }}>
          <button
            className="btn btn-secondary"
            onClick={() => copy(original, "Original")}
            disabled={loading}
          >
            📋 Copy
          </button>
        </div>
      </div>

      <div>
        <h4>Optimized</h4>
        <div className={`result-block ${enter ? "result-enter" : ""}`}>
          <pre style={{ margin: 0 }}>
            {optimized || <em>(not optimized yet)</em>}
          </pre>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <button
            className="btn btn-secondary"
            onClick={() => copy(optimized, "Optimized")}
            disabled={loading}
          >
            {copied === "Optimized" ? "✅ Copied" : "📋 Copy"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onOptimize()}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : "Re-Optimize"}
          </button>
        </div>
      </div>
    </section>
  );
}
