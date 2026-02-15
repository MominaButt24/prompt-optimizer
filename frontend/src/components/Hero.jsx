import React from "react";

export default function Hero({ onQuickPrompt, onOptimize }) {
  const samples = [
    "Summarize the article about climate change in 5 bullets for a general audience.",
    "Write a professional resume summary for a backend engineer with Python experience.",
    "Generate 10 practice problems for learning arrays in JavaScript with answers.",
  ];

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <h2>
            <span className="gradient">Optimize your AI prompts</span>
            <div
              style={{ fontSize: "0.92rem", marginTop: 6 }}
              className="small muted"
            >
              Faster, clearer, and ready for production workflows.
            </div>
          </h2>
          <p className="small muted">
            Improve clarity and relevance with instant rewrites, scoring, and
            quick templates.
          </p>
          <div className="hero-actions">
            <button className="cta" onClick={() => onOptimize()}>
              Optimize Current Prompt
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onQuickPrompt(samples[0])}
            >
              Use Sample
            </button>
          </div>
        </div>
        <div className="hero-samples">
          <h4>Sample prompts</h4>
          <div className="chips">
            {samples.map((s) => (
              <button key={s} className="chip" onClick={() => onQuickPrompt(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
