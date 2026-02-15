"""prompt_utils.py

Utility functions for scoring and rewriting prompts.
This uses simple rule-based heuristics so it's easy to understand and extend.
"""
import os
import re
from typing import Optional

# Optional LLM (Gemini) support — load safely and fall back to rule-based behavior
GEN_API_KEY = None
model = None

# Try to load environment variables from .env (optional)
try:
    from dotenv import load_dotenv

    load_dotenv()
    GEN_API_KEY = os.getenv("GEN_API_KEY")
except Exception:
    print("dotenv not available or .env not loaded; continuing without LLM support")

# Try to import and configure Google Gemini SDK (optional)
try:
    import google.generativeai as genai

    if GEN_API_KEY:
        try:
            genai.configure(api_key=GEN_API_KEY)
            model = genai.GenerativeModel("gemini-2.5-flash")
        except Exception as e:
            model = None
            print("Failed to initialize Gemini model:", e)
    else:
        print("GEN_API_KEY not set — LLM mode disabled")
except Exception as e:
    print("google.generativeai not available; LLM mode disabled:", e)


def score_prompt(prompt: str) -> float:
    """Return a score between 0 and 100 for the prompt.

    Scoring rules (simple, rule-based):
    - +30 if contains an explicit task or instruction word
    - +20 if contains constraints or examples ("format", "limit", "example")
    - +20 if it mentions audience or role
    - +20 if it's concise (< 200 chars)
    - -10 if it's vague (question-only or single word)
    """
    s = prompt.lower()
    score = 0

    # explicit task indicators
    if re.search(r"\b(write|explain|summarize|generate|create|optimize|fix|translate)\b", s):
        score += 30

    # constraints / examples
    if any(k in s for k in ("format", "limit", "example", "steps", "length")):
        score += 20

    # audience / role
    if any(k in s for k in ("audience", "role", "for a", "junior", "expert", "student")):
        score += 20

    # brevity
    if len(prompt) < 200:
        score += 20

    # penalize overly vague prompts
    if len(prompt.strip().split()) <= 3:
        score -= 10

    # clamp
    score = max(0, min(100, score))
    return float(score)



def rewrite_prompt(prompt: str) -> str:
    """A naive, deterministic prompt rewriter.

    This is a placeholder for where an LLM would normally be used.
    It attempts to:
    - Make the task explicit
    - Add structure (audience, format) if missing
    - Add an example request if the prompt looks too short
    """
    p = prompt.strip()

    if not p:
        return "Write a clear, actionable prompt describing the task, audience, and desired format."

    # If it's very short, expand with a template
    if len(p.split()) <= 6:
        return f"Please {p}. Provide a concise, step-by-step response with examples where helpful. Target audience: beginners." 

    # Add clarity: ensure it starts with an action verb
    if not re.match(r"^(write|explain|summarize|generate|create|analyze|compare)\b", p.lower()):
        p = "Write: " + p

    # If audience not mentioned, add a default
    if not re.search(r"\b(audience|for|target|role)\b", p.lower()):
        p += "\n\nAudience: beginners who are new to the topic."

    # If format not mentioned, suggest a format
    if not re.search(r"\b(format|list|steps|bullets|paragraph|example)\b", p.lower()):
        p += "\n\nFormat: short bullets or numbered steps with an example." 

    return p


def rewrite_prompt_gemini(prompt: str, override_model_name: str | None = None) -> dict:
    """
    Rewrite a prompt using Google Gemini (via google.generativeai).

    Attempts:
    - Use explicit override_model_name if provided
    - Fall back to GEN_MODEL env var if set
    - Try the configured 'model' object
    - Discover available models via genai.list_models()

    Returns dict: { "text": str, "model": Optional[str], "fallback": bool }
    """
    result_text = None
    used_model = None
    fallback = False

    # If no model available at all, return fallback immediately
    if model is None:
        print("Gemini model not configured, falling back to rule-based rewrite")
        return {"text": rewrite_prompt(prompt), "model": None, "fallback": True}

    # Determine override order
    env_override = os.getenv("GEN_MODEL")
    attempts = []
    if override_model_name:
        attempts.append(override_model_name)
    if env_override:
        attempts.append(env_override)

    # helper to try a model name
    def try_generate_by_name(name):
        nonlocal result_text, used_model
        try:
            gm = genai.GenerativeModel(name)
            response = gm.generate_content(f"Rewrite this prompt to be clear, structured, and include audience/format: {prompt}")
            text = getattr(response, "text", None)
            if text:
                result_text = text.strip()
                used_model = name
                return True
        except Exception as e:
            print(f"Attempt with model {name} failed:", e)
        return False

    # Try overrides first
    for name in attempts:
        if try_generate_by_name(name):
            return {"text": result_text, "model": used_model, "fallback": False}

    # Try the initially configured model object
    try:
        response = model.generate_content(f"Rewrite this prompt to be clear, structured, and include audience/format: {prompt}")
        text = getattr(response, "text", None)
        if text:
            return {"text": text.strip(), "model": getattr(model, "model_name", None) or "configured", "fallback": False}
    except Exception as e:
        msg = str(e).lower()
        print("Gemini generate error on configured model:", e)
        if not ("not found" in msg or "call listmodels" in msg or "404" in msg):
            # Some other error; fallback immediately
            return {"text": rewrite_prompt(prompt), "model": None, "fallback": True}

    # Discovery: iterate available models and try candidates
    try:
        for m in genai.list_models():
            name = getattr(m, "name", None) or m.get("name")
            if not name:
                continue
            if any(k in name.lower() for k in ("gemini", "bison", "chat")):
                if try_generate_by_name(name):
                    return {"text": result_text, "model": used_model, "fallback": False}
        print("No working LLM model found; falling back to rule-based rewrite")
    except Exception as e:
        print("Failed to list models or discover alternatives:", e)

    return {"text": rewrite_prompt(prompt), "model": None, "fallback": True}

def optimize_prompt(prompt: str, mode: str = "rule", model_name: Optional[str] = None) -> dict:
    """Optimize prompt using selected mode.

    Returns a dict with optimized_prompt, score, model (optional), and llm_fallback (bool).
    """
    model_used = None
    llm_fallback = False

    if mode == "llm":
        # rewrite_prompt_gemini returns a dict with keys: text, model, fallback
        res = rewrite_prompt_gemini(prompt, override_model_name=model_name)
        optimized = res.get("text") if isinstance(res, dict) else rewrite_prompt(prompt)
        model_used = res.get("model") if isinstance(res, dict) else None
        llm_fallback = bool(res.get("fallback")) if isinstance(res, dict) else False
        score = score_prompt(optimized)
    else:
        optimized = rewrite_prompt(prompt)
        score = score_prompt(optimized)

    return {
        "optimized_prompt": optimized,
        "score": score,
        "model": model_used,
        "llm_fallback": llm_fallback,
    }


def list_models() -> list:
    """Return a list of available model names. Safe if genai isn't available.

    Returns a list of strings (model names) or an empty list on error / not configured.
    """
    try:
        if "genai" not in globals():
            return []
        models = []
        for m in genai.list_models():
            name = getattr(m, "name", None) or (m.get("name") if isinstance(m, dict) else None)
            if name:
                models.append(name)
        return models
    except Exception as e:
        print("list_models error:", e)
        return []
