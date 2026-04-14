import { useState, useRef, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_CHAT_API_URL || "http://localhost:8000";

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Hey! I'm Swifty, your SwiftSolve AI assistant.\n\nI can help you with websites, AI chatbots, WhatsApp bots & AI integrations. What are you looking to build?",
  ts: new Date(),
};

const QUICK_CHIPS = ["Our services", "Pricing", "Book a free call", "WhatsApp bot"];

function getOrCreateSessionId() {
  const key = "swiftsolve_sid";
  let id = localStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
  return id;
}

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Swifty image avatar ───────────────────────────────────────────────────────
function SwiftyAvatar({ size = 36 }) {
  return (
    <img
      src="/swifty.png"
      alt="Swifty"
      style={{
        width: size, height: size,
        objectFit: "contain",
        flexShrink: 0,
        filter: "drop-shadow(0 2px 8px rgba(99,102,241,0.5))",
      }}
    />
  );
}

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "16px" }}>
      <SwiftyAvatar size={36} />
      <div style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "18px 18px 18px 4px",
        padding: "12px 18px",
        display: "flex", gap: "5px", alignItems: "center",
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#818cf8",
            animation: "swiftyBounce 1.3s infinite ease-in-out",
            animationDelay: `${i * 0.18}s`,
            display: "block",
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Message ──────────────────────────────────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div style={{
        display: "flex", justifyContent: "flex-end",
        marginBottom: "16px",
        animation: "swiftyMsgIn 0.2s ease-out forwards",
      }}>
        <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <div style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            borderRadius: "20px 20px 4px 20px",
            padding: "12px 16px",
            fontSize: "14px",
            lineHeight: "1.55",
            whiteSpace: "pre-wrap",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
          }}>
            {msg.text}
          </div>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", paddingRight: "4px" }}>
            {formatTime(msg.ts)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: "10px",
      marginBottom: "16px",
      animation: "swiftyMsgIn 0.2s ease-out forwards",
    }}>
      <SwiftyAvatar size={36} />
      <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "18px 18px 18px 4px",
          padding: "12px 16px",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#d1d5db",
          whiteSpace: "pre-wrap",
        }}>
          {msg.text}
        </div>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", paddingLeft: "4px" }}>
          {formatTime(msg.ts)}
        </span>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([WELCOME_MESSAGE]);
  const [input, setInput]         = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [error, setError]         = useState(null);

  const sessionId   = useRef(getOrCreateSessionId());
  const messagesEnd = useRef(null);
  const inputRef    = useRef(null);
  const showChips   = messages.length === 1 && !isTyping;

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 180); setHasUnread(false); }
  }, [isOpen]);

  const sendMessage = useCallback(async (override) => {
    const text = (override ?? input).trim();
    if (!text || isTyping) return;
    setInput(""); setError(null);
    setMessages(p => [...p, { id: Date.now(), role: "user", text, ts: new Date() }]);
    setIsTyping(true);
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId.current, message: text }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(p => [...p, { id: Date.now() + 1, role: "assistant", text: data.reply, ts: new Date() }]);
      if (!isOpen) setHasUnread(true);
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, isOpen]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{`
        @keyframes swiftyBounce {
          0%,60%,100% { transform:translateY(0); opacity:0.4; }
          30%          { transform:translateY(-5px); opacity:1; }
        }
        @keyframes swiftyMsgIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes swiftyWidgetIn {
          from { opacity:0; transform:translateY(16px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes swiftyGlow {
          0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,0.6), 0 8px 24px rgba(99,102,241,0.4); }
          50%      { box-shadow:0 0 0 8px rgba(99,102,241,0), 0 8px 24px rgba(99,102,241,0.4); }
        }
        @keyframes swiftyFloat {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-4px); }
        }
        .swifty-scroll::-webkit-scrollbar { width:4px; }
        .swifty-scroll::-webkit-scrollbar-track { background:transparent; }
        .swifty-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:4px; }
        .swifty-chip:hover { background:rgba(99,102,241,0.2) !important; border-color:rgba(99,102,241,0.5) !important; color:#a5b4fc !important; transform:translateY(-1px); }
        .swifty-input:focus { outline:none; border-color:rgba(99,102,241,0.6) !important; box-shadow:0 0 0 3px rgba(99,102,241,0.1) !important; }
        .swifty-send:hover:not(:disabled) { transform:scale(1.05); box-shadow:0 4px 16px rgba(99,102,241,0.5); }
      `}</style>

      {/* ── Launcher ── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label="Chat with Swifty"
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 9999,
          width: "60px", height: "60px", borderRadius: "50%",
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
          animation: !isOpen ? "swiftyGlow 2.5s infinite" : "none",
          boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        ) : (
          <div style={{ animation: "swiftyFloat 3s ease-in-out infinite" }}>
            <SwiftyAvatar size={38} />
          </div>
        )}
        {hasUnread && !isOpen && (
          <span style={{
            position: "absolute", top: "2px", right: "2px",
            width: "14px", height: "14px", borderRadius: "50%",
            background: "#f43f5e", border: "2.5px solid #09090b",
            animation: "swiftyGlow 1.5s infinite",
          }} />
        )}
      </button>

      {/* ── Widget ── */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: "104px", right: "28px", zIndex: 9998,
          width: "375px", maxWidth: "calc(100vw - 2.5rem)",
          height: "min(580px, 84vh)",
          display: "flex", flexDirection: "column",
          borderRadius: "24px",
          overflow: "hidden",
          background: "linear-gradient(160deg, #0f0e1a 0%, #09090f 60%, #0a0818 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1) inset",
          animation: "swiftyWidgetIn 0.28s cubic-bezier(0.34,1.3,0.64,1) forwards",
        }}>

          {/* Header */}
          <div style={{
            padding: "18px 18px 16px",
            background: "linear-gradient(180deg, rgba(79,70,229,0.15) 0%, transparent 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: "14px",
            flexShrink: 0,
          }}>
            {/* Robot avatar with glow ring */}
            <div style={{ position: "relative" }}>
              <div style={{
                width: "58px", height: "58px", borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
                border: "1px solid rgba(99,102,241,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "swiftyFloat 4s ease-in-out infinite",
              }}>
                <SwiftyAvatar size={52} />
              </div>
              <span style={{
                position: "absolute", bottom: "1px", right: "1px",
                width: "12px", height: "12px", borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid #09090f",
                boxShadow: "0 0 8px #22c55e",
              }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  color: "#f9fafb", fontWeight: 700, fontSize: "16px",
                  letterSpacing: "-0.3px",
                }}>
                  Swifty
                </span>
                <span style={{
                  fontSize: "10px", color: "#818cf8",
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: "20px", padding: "1px 8px",
                  fontWeight: 600, letterSpacing: "0.2px",
                }}>
                  AI Assistant
                </span>
              </div>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                SwiftSolve AI &bull; Typically replies instantly
              </span>
            </div>

            {/* Minimise */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: "30px", height: "30px", borderRadius: "8px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(255,255,255,0.3)",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div className="swifty-scroll" style={{ flex: 1, overflowY: "auto", padding: "18px 16px 8px" }}>

            {/* Welcome hint */}
            {messages.length === 1 && (
              <div style={{
                textAlign: "center", marginBottom: "20px",
              }}>
                <div style={{
                  display: "inline-block",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "11px", color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.2px",
                }}>
                  Today &bull; Conversation started
                </div>
              </div>
            )}

            {messages.map(msg => <Message key={msg.id} msg={msg} />)}
            {isTyping && <TypingIndicator />}

            {error && (
              <div style={{
                textAlign: "center", padding: "10px 16px", marginBottom: "8px",
                background: "rgba(244,63,94,0.08)",
                border: "1px solid rgba(244,63,94,0.2)",
                borderRadius: "12px", fontSize: "12px", color: "#fb7185",
              }}>
                {error}
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Quick chips */}
          {showChips && (
            <div style={{
              padding: "0 16px 12px",
              display: "flex", flexWrap: "wrap", gap: "8px", flexShrink: 0,
            }}>
              {QUICK_CHIPS.map(chip => (
                <button key={chip} className="swifty-chip" onClick={() => sendMessage(chip)} style={{
                  fontSize: "12px", color: "rgba(255,255,255,0.45)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px", padding: "7px 14px",
                  cursor: "pointer", transition: "all 0.2s",
                  fontWeight: 500,
                }}>
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "12px 16px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex", alignItems: "flex-end", gap: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "10px 10px 10px 16px",
              transition: "border-color 0.2s",
            }}
              onFocusCapture={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"}
              onBlurCapture={e  => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Message Swifty..."
                rows={1}
                maxLength={500}
                className="swifty-input"
                style={{
                  flex: 1, resize: "none", border: "none",
                  background: "transparent",
                  fontSize: "14px", color: "#e5e7eb",
                  lineHeight: "1.5", maxHeight: "100px",
                  overflowY: "auto", fontFamily: "inherit",
                  caretColor: "#818cf8",
                }}
              />
              <button
                className="swifty-send"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                style={{
                  width: "38px", height: "38px", borderRadius: "12px", flexShrink: 0,
                  background: (!input.trim() || isTyping)
                    ? "rgba(99,102,241,0.2)"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none", cursor: (!input.trim() || isTyping) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                  opacity: (!input.trim() || isTyping) ? 0.4 : 1,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4 20-7Z"/>
                  <path d="M22 2 11 13"/>
                </svg>
              </button>
            </div>
            <p style={{ textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.15)", marginTop: "10px" }}>
              Swifty by SwiftSolve AI &bull; Powered by GPT-4o mini
            </p>
          </div>
        </div>
      )}
    </>
  );
}
