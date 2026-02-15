import React from "react";

// TemplatePanel: quick insert templates (resume, coding, study)
export default function TemplatePanel({ onInsert }) {
  const templates = [
    {
      name: "Resume",
      text: "Write a professional resume summary for a software engineer with 5 years experience in backend systems.",
    },
    {
      name: "Coding",
      text: "Generate a code example showing pagination in Python with an explanation and complexity analysis.",
    },
    {
      name: "Study",
      text: "Create a study plan for learning data structures in 6 weeks with daily tasks.",
    },
  ];

  return (
    <section className="card">
      <h3>Templates</h3>
      <div className="row">
        {templates.map((t) => (
          <button
            key={t.name}
            className="secondary"
            onClick={() => onInsert(t.text)}
          >
            {t.name}
          </button>
        ))}
      </div>
    </section>
  );
}
