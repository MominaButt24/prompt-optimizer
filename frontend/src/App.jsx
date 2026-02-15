import React, { useState, useEffect, useRef } from "react";
import PromptInput from "./components/PromptInput";
import ScoreCard from "./components/ScoreCard";
import ResultCompare from "./components/ResultCompare";
import TemplatePanel from "./components/TemplatePanel";
import PromptWizard from "./components/PromptWizard";
import ModelInfo from "./components/ModelInfo";
import ModelSelector from "./components/ModelSelector";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import "./App.css";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [optimized, setOptimized] = useState("");
  const [score, setScore] = useState(null);
  const [saved, setSaved] = useState([]);
  const [mode, setMode] = useState("rule");
  const [loading, setLoading] = useState(false);
  const [modelUsed, setModelUsed] = useState(null);
  const [llmFallback, setLlmFallback] = useState(false);
  const [toast, setToast] = useState(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function onScroll() {
      setHeaderScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    localStorage.getItem("selected_model") || null,
  );

  useEffect(() => {
    const s = localStorage.getItem("saved_prompts");
    if (s) setSaved(JSON.parse(s));

    // load available models on mount
    loadModels();
  }, []);

  useEffect(() => {
    localStorage.setItem("saved_prompts", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    if (selectedModel) localStorage.setItem("selected_model", selectedModel);
    else localStorage.removeItem("selected_model");
  }, [selectedModel]);

  async function loadModels() {
    setLoadingModels(true);
    try {
      const res = await fetch("/models");
      const data = await res.json();
      setAvailableModels(data.models || []);
      if (!selectedModel && data.models && data.models.length) {
        setSelectedModel(data.models[0]);
      }
    } catch (e) {
      console.error("Failed to load models", e);
    } finally {
      setLoadingModels(false);
    }
  }

  async function handleOptimize(currentPrompt) {
    if (!currentPrompt || loading) return;
    setLoading(true);
    setToast(null);
    try {
      const res = await fetch("/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          mode,
          model_name: selectedModel,
        }),
      });
      const data = await res.json();
      setOptimized(data.optimized_prompt);
      setScore(data.score);
      setModelUsed(data.model || null);
      setLlmFallback(Boolean(data.llm_fallback));

      // scroll result into view after optimize
      setTimeout(() => {
        if (resultRef.current)
          resultRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
      }, 220);

      if (mode === "llm") {
        if (data.llm_fallback)
          setToast("LLM unavailable; fell back to rule-based rewrite");
        else setToast(`LLM used: ${data.model || "unknown"}`);
      } else {
        setToast("Optimized using rule-based mode");
      }
    } catch (err) {
      console.error("Failed to call backend", err);
      setToast("Backend request failed. Is the FastAPI server running?");
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  function handleSave(name) {
    setSaved((s) => [
      { name, prompt, optimized, score, savedAt: Date.now() },
      ...s,
    ]);
  }

  return (
    <div className="app-container">
      <header className={headerScrolled ? "scrolled" : ""}>
        <div className="header-left">
          <div className="brand">
            <h1>
              AI Prompt Optimizer <span className="small-badge">AI</span>
            </h1>
            <p className="small">Improve and score your prompts</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="mode-indicator small">
            Mode: <strong>{mode}</strong>
          </div>
          <div className="theme-toggle">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </header>
      <Hero
        onQuickPrompt={(s) => setPrompt(s)}
        onOptimize={() => handleOptimize(prompt)}
      />

      <main>
        <div className="left">
          <div className="card-panel">
            <ModelSelector
              models={availableModels}
              selected={selectedModel}
              onSelect={setSelectedModel}
              onRefresh={loadModels}
              loading={loadingModels}
            />

            <div className="stack">
              <TemplatePanel onInsert={setPrompt} />
              <PromptWizard onBuild={setPrompt} />
            </div>

            <PromptInput
              prompt={prompt}
              onChange={setPrompt}
              onOptimize={() => handleOptimize(prompt)}
              onSave={handleSave}
              mode={mode}
              onModeChange={setMode}
              loading={loading}
            />
          </div>
        </div>

        <div className="right">
          <ScoreCard score={score} />
          <ModelInfo model={modelUsed} llmFallback={llmFallback} />
          <div ref={resultRef}>
            <ResultCompare
              original={prompt}
              optimized={optimized}
              onOptimize={() => handleOptimize(optimized)}
              loading={loading}
              onCopy={(msg) => setToast(msg)}
            />
          </div>

          <section className="saved card">
            <h3>Saved Prompts</h3>
            <ul>
              {saved.map((it, i) => (
                <li key={i}>
                  <div className="saved-item">
                    <div>
                      <strong>{it.name}</strong>
                      <div className="small muted">
                        {new Date(it.savedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="saved-actions">
                      <button
                        className="secondary"
                        onClick={() => setPrompt(it.prompt)}
                      >
                        Load
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <Features />
      <Footer />

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
