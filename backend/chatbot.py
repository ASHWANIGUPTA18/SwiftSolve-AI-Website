"""
LangChain chatbot engine for SwiftSolve AI.

Architecture:
  - ChatOpenAI (GPT) as the LLM
  - ChatPromptTemplate with system prompt + message history placeholder
  - RunnableWithMessageHistory for per-session conversation memory
  - InMemoryChatMessageHistory for session storage (swap for Redis in production)
"""

import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

from prompts import SYSTEM_PROMPT

# ──────────────────────────────────────────────
# Hardcoded FAQ responses — zero API cost
# Keys are trigger keywords (any word in the list matches).
# ──────────────────────────────────────────────
FAQ_RESPONSES = {
    frozenset(["services", "offer", "do you do", "what do you", "what you do", "offerings"]): (
        "We offer four core services:\n"
        "- Website Development — from £500\n"
        "- AI Chatbots — from £800\n"
        "- WhatsApp Automation Bots — from £600\n"
        "- AI Integration Services — custom quote\n\n"
        "Which one interests you most?"
    ),
    frozenset(["website", "web", "landing page", "web app", "ecommerce", "e-commerce"]): (
        "Our website packages:\n"
        "- Landing page: £500–£1,200\n"
        "- Business site (5–10 pages): £1,200–£3,500\n"
        "- E-commerce store: £2,500–£6,000+\n"
        "- Custom web app: £4,000–£15,000+\n\n"
        "All include responsive design, SEO basics & 1-month support. Want a free quote?"
    ),
    frozenset(["chatbot", "chat bot", "ai bot", "gpt", "ai assistant"]): (
        "Our AI chatbot packages:\n"
        "- Basic FAQ bot: £800–£1,500\n"
        "- Lead-generation bot: £1,500–£3,000\n"
        "- Full AI assistant (GPT-powered): £3,000–£7,000+\n\n"
        "Includes custom training, personality design & website/WhatsApp integration. Interested in a free consultation?"
    ),
    frozenset(["whatsapp", "whats app", "whatsapp bot", "whatsapp automation"]): (
        "Our WhatsApp automation packages:\n"
        "- Order/enquiry handling bot: £600–£1,500\n"
        "- Full customer support bot: £1,500–£4,000\n"
        "- Broadcast + automation flows: £1,000–£3,000\n\n"
        "Includes WhatsApp Business API setup & flow design. Want to get started?"
    ),
    frozenset(["price", "pricing", "cost", "how much", "rates", "charge", "fee"]): (
        "Here's a quick overview of our pricing:\n"
        "- Websites: from £500\n"
        "- AI Chatbots: from £800\n"
        "- WhatsApp Bots: from £600\n"
        "- AI Integration: custom (typically £1,500–£20,000+)\n\n"
        "Which service would you like an exact quote for?"
    ),
    frozenset(["contact", "reach", "email", "phone", "get in touch", "talk to", "speak to", "human", "team"]): (
        "You can reach our team by sharing your contact details here and we'll get back to you within 24 hours.\n\n"
        "Or book a free 20-minute discovery call — just let me know and our team will send you the link!"
    ),
    frozenset(["timeline", "how long", "time", "duration", "turnaround", "delivery", "deadline"]): (
        "Typical delivery times:\n"
        "- Landing page: 1–2 weeks\n"
        "- Business website: 3–6 weeks\n"
        "- AI chatbot: 2–4 weeks\n"
        "- WhatsApp bot: 2–3 weeks\n"
        "- Custom AI integration: 4–12 weeks\n\n"
        "Timeline depends on scope. Want to discuss your specific requirements?"
    ),
    frozenset(["who are you", "what is swiftsolve", "about you", "about swiftsolve", "tell me about"]): (
        "SwiftSolve AI is a UK-based digital agency specialising in websites, AI chatbots, WhatsApp automation, and AI integration for businesses.\n\n"
        "Our goal is to help businesses grow with smart, affordable digital solutions. How can we help you today?"
    ),
    frozenset(["hello", "hi", "hey", "hiya", "good morning", "good afternoon", "good evening", "howdy"]): (
        "Hi there! I'm Alex, SwiftSolve AI's virtual assistant.\n\n"
        "I can help you with info on our services, pricing, and getting started. What can I help you with today?"
    ),
    frozenset(["book", "call", "consultation", "meeting", "appointment", "schedule", "demo"]): (
        "A free 20-minute discovery call is a great next step — no obligation at all!\n\n"
        "Could I grab your name, email, and phone number? Our team will send you the booking link within 24 hours."
    ),
    frozenset(["location", "where are you", "uk", "based", "country", "city"]): (
        "We're a UK-based digital agency serving clients across the UK and internationally.\n\n"
        "All work is done remotely so we can work with you wherever you are. Any other questions?"
    ),
}


def _match_faq(message: str) -> str | None:
    """Return a hardcoded answer if the message matches a FAQ, else None."""
    msg = message.lower()
    for keywords, response in FAQ_RESPONSES.items():
        if any(kw in msg for kw in keywords):
            return response
    return None


# ──────────────────────────────────────────────
# In-memory session store  {session_id: ChatMessageHistory}
# For production: replace with RedisChatMessageHistory
# ──────────────────────────────────────────────
_session_store: dict[str, ChatMessageHistory] = {}


def _get_session_history(session_id: str) -> ChatMessageHistory:
    """Return (or create) a message history object for the given session."""
    if session_id not in _session_store:
        _session_store[session_id] = ChatMessageHistory()
    return _session_store[session_id]


def _build_chain():
    """
    Build the LangChain LCEL chain:
        Prompt  →  LLM  →  StrOutputParser (via invoke returning AIMessage)
    Wrapped with RunnableWithMessageHistory for automatic memory injection.
    """
    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.3,
        max_tokens=150,
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        # Placeholder is populated automatically by RunnableWithMessageHistory
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ])

    # Core chain: prompt | llm
    core_chain = prompt | llm

    # Wrap with message history management
    chain_with_history = RunnableWithMessageHistory(
        core_chain,
        _get_session_history,
        input_messages_key="input",
        history_messages_key="history",
    )

    return chain_with_history


# Build once at module load
_chain = _build_chain()


def chat(session_id: str, user_message: str) -> str:
    """
    Send a user message and return the assistant's response.
    Checks hardcoded FAQ first — zero API cost for common questions.
    """
    # Check FAQ first — no API call needed
    faq_reply = _match_faq(user_message)
    if faq_reply:
        return faq_reply

    # Fall back to OpenAI for complex/unknown questions
    config = {"configurable": {"session_id": session_id}}
    response = _chain.invoke(
        {"input": user_message},
        config=config,
    )
    return response.content


def get_conversation_summary(session_id: str) -> Optional[str]:
    """
    Return a plain-text summary of the conversation so far.
    Useful for agent hand-off or CRM notes.
    """
    history = _get_session_history(session_id)
    if not history.messages:
        return None

    messages_text = "\n".join(
        f"{'User' if m.type == 'human' else 'Alex'}: {m.content}"
        for m in history.messages
    )

    # Ask GPT to summarise
    llm = ChatOpenAI(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0,
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )

    summary_prompt = (
        "Summarise the following sales conversation in 3–5 bullet points. "
        "Include: services discussed, budget/timeline mentioned, contact info shared, "
        "and recommended next action.\n\n"
        f"{messages_text}"
    )

    return llm.invoke(summary_prompt).content


def clear_session(session_id: str) -> None:
    """Remove session history (e.g., after lead is saved)."""
    _session_store.pop(session_id, None)
