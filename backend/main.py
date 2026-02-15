"""FastAPI server for the AI Prompt Optimizer demo app.

Run with:
    uvicorn main:app --reload
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from prompt_utils import optimize_prompt, list_models


class PromptRequest(BaseModel):
    prompt: str
    mode: Optional[str] = "rule"
    model_name: Optional[str] = None


class PromptResponse(BaseModel):
    optimized_prompt: str
    score: float
    model: Optional[str] = None
    llm_fallback: Optional[bool] = False


app = FastAPI(title="AI Prompt Optimizer")

# Allow local development from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


@app.post("/optimize", response_model=PromptResponse)
async def optimize(req: PromptRequest):
    """Optimize and score the provided prompt."""
    if req.prompt is None:
        raise HTTPException(status_code=400, detail="Missing 'prompt' in request body")

    result = optimize_prompt(req.prompt, mode=req.mode, model_name=req.model_name)
    return PromptResponse(**result)


@app.get("/models")
async def get_models():
    """Return a list of available LLM models (if supported)."""
    models = list_models()
    return {"models": models}
