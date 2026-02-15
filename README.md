# AI Prompt Optimizer (Demo)

A lightweight 1–2 day demo app that improves and scores AI prompts.

## Stack

- Frontend: React (create-react-app)
- Backend: FastAPI
- Communication: REST API

## Setup

Backend

```
cd backend
python -m venv venv
venv\Scripts\activate    # on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

**Optional (LLM mode)**

- Create a `.env` file in `backend/` with:

```
GEN_API_KEY=your_gemini_api_key_here
```

- To use Gemini model, include `"mode":"llm"` in the request body (requires `google-generativeai` and a valid `GEN_API_KEY`). The server will fall back to rule-based rewriting if the model isn't available.

Frontend

```
cd frontend
npm install
npm start
```

The React dev server is proxied to the FastAPI backend (`proxy` in `package.json`) so you can call `/optimize` from the client.

## Features

- Rule-based prompt scoring
- Simple prompt rewriting placeholder (no external LLM calls)
- Frontend with prompt input, templates, prompt builder, and localStorage save

Sample prompts:

- "Summarize the article about climate change in 5 bullets for a general audience."
- "Write a cover letter for a software engineering role focusing on backend development and Python experience."
- "Generate practice exercises for learning Python loops for beginners."
