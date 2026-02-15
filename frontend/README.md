# Frontend (React)

This is a minimal React app (created to be compatible with create-react-app).

Quick start:

```
cd frontend
npm install
npm start
```

The dev server proxies requests to the FastAPI backend at `http://localhost:8000` (see `package.json` -> `proxy`).

A new UI toggle lets you choose between `rule` and `llm` modes. Selecting `llm` will send `{"mode":"llm"}` with the request — the backend will only use an LLM if it is configured (see backend `.env` and README).

This UI is responsive and includes:

- a loading spinner when optimizing ✅
- a model info card showing the LLM model used (if any) ✅
- a model selector (fetches `/models` from backend) ✅
- toast notifications for success/fallback/errors ✅
- responsive layout for mobile screens ✅

Note: `/models` will return available LLM models if your backend has LLM support configured.

Sample demo prompts to try from the UI:

- "Summarize the latest research on transfer learning in 5 bullets for a technical audience."
- "Write a friendly email asking for feedback on a draft project proposal."
- "Generate 10 practice problems for learning arrays in JavaScript with answers."
