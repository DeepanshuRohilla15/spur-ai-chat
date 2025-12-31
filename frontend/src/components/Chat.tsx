import { useEffect, useRef, useState } from "react";
import "./Chat.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const API_URL = import.meta.env.VITE_API_URL + "/chat/message";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Restore sessionId & fetch previous messages
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chat_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
      fetchHistory(storedSessionId);
    }
  }, []);

  // Fetch chat history from backend
  async function fetchHistory(existingSessionId: string) {
    try {
      const res = await fetch(`${API_URL.replace("/message", "")}/${existingSessionId}`);
      const data = await res.json();

      if (Array.isArray(data.messages)) {
        setMessages(
          data.messages.map((m: any) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  }

  // Send user message to backend
  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });

      const data = await res.json();

      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("chat_session_id", data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="chatHeader">
        <h2>Support Chat</h2>
        <p>Ask questions about our store or policies.</p>
      </div>

      {/* Chat Messages */}
      <div className="chatBox">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            {m.content}
          </div>
        ))}

        {loading && <div className="typing">Agent is typing…</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="inputBox">
        <input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
