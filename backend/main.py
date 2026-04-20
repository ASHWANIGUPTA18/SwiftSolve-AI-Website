"""
SwiftSolve AI — FastAPI Backend
================================
Endpoints:
  POST /chat          — Main chat endpoint
  GET  /leads         — View all captured leads (protected in prod)
  GET  /health        — Health check
"""

import os
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from chatbot import chat, get_conversation_summary, clear_session
from leads_manager import save_lead, extract_lead_info, get_all_leads

load_dotenv()

# ──────────────────────────────────────────────
# App setup
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown hooks."""
    print("SwiftSolve AI backend starting...")
    yield
    print("SwiftSolve AI backend shutting down.")


app = FastAPI(
    title="SwiftSolve AI Chatbot API",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow requests from dev server and all Vercel/production domains
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5176,http://localhost:3000,http://127.0.0.1:5176"
).split(",")

# Allow Vercel preview domains and custom production domain
ALLOWED_ORIGIN_REGEX = r"https://(.*\.vercel\.app|swiftsolveai\.com|.*\.swiftsolveai\.com)"

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Request / Response models
# ──────────────────────────────────────────────
class ChatRequest(BaseModel):
    session_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique session identifier. Generate once per browser session.",
    )
    message: str = Field(..., min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    lead_detected: bool = False


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.get("/health")
async def health():
    return {"status": "ok", "service": "SwiftSolve AI Chatbot"}


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """
    Main chat endpoint.
    1. Sends user message to LangChain / Claude
    2. Scans for contact info in the user's message
    3. Persists any extracted lead data to leads.json
    4. Returns assistant reply
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Get AI reply
    try:
        reply = chat(session_id=req.session_id, user_message=req.message)
    except Exception as e:
        # Surface LLM errors clearly for debugging
        raise HTTPException(status_code=502, detail=f"LLM error: {str(e)}")

    # Extract and persist any contact info the user just shared
    extracted = extract_lead_info(req.message)
    lead_detected = bool(extracted)

    if lead_detected:
        save_lead(
            session_id=req.session_id,
            lead_data={
                **extracted,
                "last_message": req.message[:500],  # snippet for context
            },
        )

    return ChatResponse(
        session_id=req.session_id,
        reply=reply,
        lead_detected=lead_detected,
    )


@app.get("/summary/{session_id}")
async def session_summary(session_id: str):
    """Return an AI-generated summary of the conversation (for CRM/hand-off)."""
    summary = get_conversation_summary(session_id)
    if not summary:
        raise HTTPException(status_code=404, detail="No conversation found for this session.")
    return {"session_id": session_id, "summary": summary}


@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Clear conversation memory for a session."""
    clear_session(session_id)
    return {"detail": "Session cleared."}


@app.get("/leads")
async def list_leads():
    """
    Return all captured leads.
    ⚠️  Add authentication before exposing this in production!
    """
    return {"leads": get_all_leads()}
