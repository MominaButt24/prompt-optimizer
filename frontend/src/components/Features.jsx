import React from "react";

export default function Features() {
  const items = [
    {
      title: "Score & Improve",
      body: "Get an instant quality score and a clearer rewrite.",
    },
    {
      title: "Templates & Builder",
      body: "Use templates or a small prompt wizard to compose structured prompts.",
    },
    {
      title: "Save & Compare",
      body: "Keep prompts in local storage and compare original vs optimized.",
    },
  ];

  return (
    <section className="features card">
      <h3>Why use Prompt Optimizer?</h3>
      <div className="feature-grid">
        {items.map((it) => (
          <div key={it.title} className="feature-item">
            <h4>{it.title}</h4>
            <p className="small">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
