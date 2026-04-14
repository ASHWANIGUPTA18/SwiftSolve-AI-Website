# SwiftSolve AI — Chatbot System

A production-ready AI sales chatbot built with **LangChain + Claude (Anthropic)** on the backend and **React + Vite** on the frontend.

---

## Project Structure

```
SwifySolve AI/
├── backend/                    # Python FastAPI + LangChain backend
│   ├── main.py                 # API routes (/chat, /leads, /summary)
│   ├── chatbot.py              # LangChain chain with conversation memory
│   ├── prompts.py              # System prompt (persona + pricing + sales logic)
│   ├── leads_manager.py        # Lead extraction + JSON storage
│   ├── requirements.txt
│   └── .env.example
│
└── animated-landing-page/      # React + Vite frontend
    └── src/
        └── components/
            └── ChatWidget.jsx  # Floating chat UI component
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

Get your API key at: https://console.anthropic.com/

```bash
# Run the backend
uvicorn main:app --reload --port 8000
```

API will be live at: http://localhost:8000  
Interactive docs: http://localhost:8000/docs

---

### 2. Frontend Setup

```bash
cd animated-landing-page

# Install dependencies (already done if node_modules exists)
npm install

# Set backend URL
cp .env.example .env.local
# .env.local already has: VITE_CHAT_API_URL=http://localhost:8000

# Run the dev server
npm run dev
```

Frontend will be at: http://localhost:5173

---

## API Reference

### `POST /chat`
Send a message and receive an AI reply.

**Request:**
```json
{
  "session_id": "uuid-string",
  "message": "What services do you offer?"
}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "reply": "Great question! SwiftSolve AI offers four core services...",
  "lead_detected": false
}
```

---

### `GET /leads`
Returns all captured leads from `leads.json`.

> ⚠️ Add authentication before exposing in production.

---

### `GET /summary/{session_id}`
Returns an AI-generated bullet-point summary of the conversation (useful for CRM hand-off).

---

### `DELETE /session/{session_id}`
Clears conversation memory for a session.

---

### `GET /health`
Simple health check.

---

## How Lead Capture Works

1. User sends a message containing an email or phone number
2. `leads_manager.py` extracts contact info with regex
3. Lead is saved/updated in `leads.json` keyed by `session_id`
4. The bot (via the system prompt) is instructed to ask for name, email, phone, and requirement

The `leads.json` file is created automatically in the `backend/` directory.

---

## Customisation

### Change the AI Model
In `.env`:
```
CLAUDE_MODEL=claude-sonnet-4-6    # smarter but costs more
CLAUDE_MODEL=claude-haiku-4-5-20251001  # faster & cheaper (default)
```

### Update Pricing / Services
Edit `backend/prompts.py` — the `SYSTEM_PROMPT` constant contains all business info.

### Change Widget Position / Colours
Edit `animated-landing-page/src/components/ChatWidget.jsx` — all styles use Tailwind classes.

---

## Deployment

### Backend → Render.com (Free tier)

1. Push your code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo, set root to `backend/`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `ANTHROPIC_API_KEY=your_key`
7. Add `ALLOWED_ORIGINS=https://yourfrontenddomain.com`

### Frontend → Vercel

1. Go to https://vercel.com → New Project
2. Import your repo, set root to `animated-landing-page/`
3. Add environment variable: `VITE_CHAT_API_URL=https://your-render-backend.onrender.com`
4. Deploy

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| LLM       | Claude (Anthropic) via LangChain    |
| Memory    | LangChain `ChatMessageHistory` (in-memory; swap Redis for prod) |
| Backend   | Python 3.11+ / FastAPI / Uvicorn    |
| Frontend  | React 18 / Vite / Tailwind CSS      |
| Lead store| JSON file (swap PostgreSQL for prod) |

---

## Security Notes

- Never commit `.env` to git — it's in `.gitignore`
- The `/leads` endpoint has no auth — add an API key check before going live
- Rate-limit the `/chat` endpoint in production (use `slowapi` or a CDN rule)
