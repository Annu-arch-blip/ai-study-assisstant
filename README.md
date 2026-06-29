# AI Study Quiz Assistant

Turns any topic, or pasted notes/chapter/question paper, into a simple quiz
with beginner-friendly explanations. Built for students from class 1 through
college.

## Screenshots

| Home | Make a Quiz | Results |
|---|---|---|
| ![Home](frontend/screenshots/home.png) | ![New Quiz](frontend/screenshots/new-quiz.png) | ![Results](frontend/screenshots/results.png) |

## Tech stack

- **Frontend:** React (Vite) + Tailwind CSS v4 + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)
- **AI:** Groq (llama-3.3-70b-versatile) — free tier, hosted, extremely
          fast Llama inference, with JSON-mode + multi-layer validation
- **Auth:** JWT + bcrypt password hashing

## Why these choices (so you can explain this project confidently)

**Why Groq instead of Ollama or a paid API?**
Ollama runs locally on your own machine — great for development, but it
can't run on a free hosting tier (no free service gives enough RAM/CPU for
a multi-billion parameter model). Groq runs the same family of open models
(Llama 3.x) on custom inference hardware that's dramatically faster than
local Ollama, with a genuinely free API tier — no credit card required.
It also supports JSON-mode (response_format: { type: "json_object" }),
which guarantees syntactically valid JSON back from the model — solving the
"AI output must be valid JSON" requirement at the API level.

**Why "RAG-lite" instead of a real vector database?**
A vector DB (Pinecone, Atlas Vector Search) is built for retrieving relevant
passages out of *thousands* of documents. Here, a student pastes *one*
chapter — that's small enough to handle with simple keyword-overlap ranking
(`backend/src/utils/ragRetrieval.js`), which costs nothing and can't fail in
complex ways. It still does real retrieval: long text gets chunked and only
the most relevant chunks are sent to the AI, so the prompt stays focused.

**How crashes are prevented this time:**
1. `aiService.js` never throws — every path returns `{ success, ... }`.
2. Groq's JSON-mode forces syntactically valid JSON.
3. We still `try/catch` the JSON parse and validate each question's shape,
   as a second and third layer of defense.
4. `server.js` has `process.on("unhandledRejection")` and
   `process.on("uncaughtException")` handlers — so even an error we didn't
   anticipate gets logged instead of killing the server.

## Project structure

```
ai-study-quiz-assistant/
├── backend/
│   └── src/
│       ├── config/       → database connection
│       ├── controllers/  → request handling logic (auth, quiz, history)
│       ├── middleware/   → JWT auth guard, input validation
│       ├── models/       → Mongoose schemas (User, Quiz)
│       ├── routes/       → URL → controller mapping
│       ├── services/     → aiService.js (Groq integration)
│       ├── utils/        → JWT helper, RAG retrieval logic
│       └── server.js     → app entry point
└── frontend/
    └── src/
        ├── api/          → axios instance with auth token attached
        ├── components/   → Navbar, Loader, ErrorBanner, ProtectedRoute
        ├── context/      → AuthContext (login state)
        └── pages/        → Home, Login, Signup, NewQuiz, QuizPlay,
                             QuizResults, History
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGODB_URI` — your MongoDB Atlas connection string (whitelist your IP in
  Atlas → Network Access, like you did before)
- `JWT_SECRET` — generate with:
  `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `GEMINI_API_KEY` — free key from https://aistudio.google.com/app/apikey

```bash
npm run dev
```

Server runs on `http://localhost:5000`. Visit `http://localhost:5000/api/health`
to confirm it's alive.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs on `http://localhost:5173`.

## Security checklist (matches the PRD)

- ✅ Passwords hashed with bcrypt (never stored in plain text)
- ✅ JWT-based auth, 7-day expiry
- ✅ Every quiz/history query scoped to `req.user._id` — no cross-user access
- ✅ Input validation on all auth + quiz endpoints (`express-validator`)
- ✅ Global rate limiting (100 req/15min) + stricter limits on auth (20/15min)
  and AI generation (15/5min) routes
- ✅ Prompt-injection mitigation: study material is clearly labeled as "data,
  not instructions" in the AI prompt, and length-capped before it ever
  reaches the model
- ✅ `helmet` for safe HTTP headers
- ✅ No sensitive data in logs (passwords never logged; JWT payload has no
  PII, only user ID)

## What's deliberately NOT in this MVP (per the PRD's "out of scope")

PDF/image upload, OCR, difficulty levels, teacher dashboard, audio mode,
multi-language support. These are listed as future scope in the PRD — easy
to add later without restructuring what's here.

## Deploying

- **Backend:** Render or Railway (you've used Render before — same Node
  service setup, just point start command to `npm start`)
- **Frontend:** Netlify or Vercel (you've shipped on Netlify before — same
  flow, just set `VITE_API_URL` to your deployed backend URL as an
  environment variable in Netlify's dashboard)
- **Database:** MongoDB Atlas (already set up from past projects)
