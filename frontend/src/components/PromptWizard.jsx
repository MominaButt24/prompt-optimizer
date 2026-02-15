import React, { useState } from "react";

// PromptWizard: small form to build a structured prompt
export default function PromptWizard({ onBuild }) {
  const [task, setTask] = useState("");
  const [audience, setAudience] = useState("beginners");
  const [format, setFormat] = useState("bulleted");

  function build() {
    const p = `${task.trim()}\nAudience: ${audience}.\nFormat: ${format}.`;
    onBuild(p);
  }

  return (
    <section className="card">
      <h3>Prompt Builder</h3>
      <input
        placeholder="Task (e.g., Explain recursion)"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <div className="row">
        <input
          placeholder="Audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
        <input
          placeholder="Format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        />
      </div>
      <div className="row">
        <button onClick={build}>Build</button>
      </div>
    </section>
  );
}
