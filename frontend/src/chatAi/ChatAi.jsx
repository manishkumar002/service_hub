import React, { useState, useRef, useEffect } from "react";
import {
  ChatDotsFill,
  XLg,
  PlusLg,
  Robot,
  Paperclip,
  SendFill,
  ArrowRight,
  FileEarmarkText,
} from "react-bootstrap-icons";

// ---- API endpoints ----
const API_BASE = "http://localhost:8080/api";
const UPLOAD_URL = `${API_BASE}/upload-file`;
const PDF_CHAT_URL = `${API_BASE}/pdf-chat`;
const AI_CHAT_URL = `${API_BASE}/ai-chat`;
const AI_SEARCH_URL = `${API_BASE}/ai-search`;

export default function ChatAi({ brandName = "Support Assistant" }) {
  const [isOpen, setIsOpen] = useState(false);

  // "ai" | "pdf" | "search"
  const [mode, setMode] = useState("ai");

  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null); // { name }
  const [isUploading, setIsUploading] = useState(false);

  const bodyRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const addMessage = (sender, text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), sender, text },
    ]);
  };

  const handleNewChat = () => {
    setMessages([
      { id: Date.now(), sender: "bot", text: "Hi! How can I help you today?" },
    ]);
    setUploadedFile(null);
    setMode("ai");
  };

  // Switching mode clears any uploaded file if leaving PDF mode
  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode !== "pdf") {
      setUploadedFile(null);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  // Uploading a file always switches the widget into PDF mode
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file again later
    if (!file) return;

    setMode("pdf");
    setIsUploading(true);
    addMessage("bot", `Uploading "${file.name}"...`);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData, // do NOT set Content-Type manually, browser sets the boundary
      });

      if (!res.ok) throw new Error(`Upload failed (${res.status})`);

      const data = await res.json();

      setUploadedFile({ name: file.name });
      addMessage(
        "bot",
        data?.message ||
          `"${file.name}" uploaded successfully. Ask me anything about it.`,
      );
    } catch (err) {
      addMessage("bot", `Sorry, the file upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedFile = () => setUploadedFile(null);

  const getEndpointForMode = () => {
    if (mode === "pdf") return PDF_CHAT_URL;
    if (mode === "search") return AI_SEARCH_URL;
    return AI_CHAT_URL;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    if (mode === "pdf" && !uploadedFile) {
      addMessage("bot", "Please upload a PDF first, then ask your question.");
      return;
    }

    addMessage("user", text);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(getEndpointForMode(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data = await res.json();

      // Handles whichever key your backend returns the answer under
      const answer =
        data?.answer ||
        data?.result ||
        data?.response ||
        "Sorry, I didn't get a proper answer.";

      addMessage("bot", answer);
    } catch (err) {
      addMessage("bot", `Something went wrong: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const modeOptions = [
    { value: "ai", label: "AI Chat" },
    { value: "pdf", label: "PDF Chat" },
    { value: "search", label: "DB Search" },
  ];

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleChat}
        aria-label="Open chat"
        className="btn rounded-circle shadow d-flex align-items-center justify-content-center"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          backgroundColor: "#2563eb",
          zIndex: 1080,
        }}
      >
        <ChatDotsFill color="white" size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={toggleChat}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.15)",
            zIndex: 1070,
          }}
        />
      )}

      {/* Chat modal / window */}
      <div
        className="card shadow-lg"
        style={{
          position: "fixed",
          bottom: "96px",
          right: "24px",
          width: "380px",
          maxWidth: "90vw",
          height: "560px",
          maxHeight: "78vh",
          borderRadius: "16px",
          overflow: "hidden",
          zIndex: 1080,
          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? "translateY(0) scale(1)"
            : "translateY(16px) scale(0.98)",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        {/* Header */}
        <div className="card-header bg-white d-flex align-items-center justify-content-between border-bottom">
          <h2 className="h6 mb-0 fw-semibold text-dark">{brandName}</h2>
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={handleNewChat}
              className="btn btn-sm btn-link text-decoration-none text-secondary p-0 d-flex align-items-center gap-1"
            >
              <PlusLg size={14} />
              New Chat
            </button>
            <button
              onClick={toggleChat}
              aria-label="Close chat"
              className="btn btn-sm btn-link text-secondary p-0 d-flex align-items-center"
            >
              <XLg size={18} />
            </button>
          </div>
        </div>

        {/* Mode selector (radio = only one mode active at a time) */}
        <div className="px-3 py-2 bg-white border-bottom d-flex gap-3">
          {modeOptions.map((opt) => (
            <label
              key={opt.value}
              className="d-flex align-items-center gap-1 small mb-0"
              style={{
                cursor: "pointer",
                color: mode === opt.value ? "#2563eb" : "#374151",
                fontWeight: mode === opt.value ? 600 : 400,
              }}
            >
              <input
                type="radio"
                name="chat-mode"
                value={opt.value}
                checked={mode === opt.value}
                onChange={() => handleModeChange(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>

        {/* Uploaded file chip (only relevant in PDF mode) */}
        {mode === "pdf" && uploadedFile && (
          <div className="px-3 py-2 bg-white border-bottom d-flex align-items-center gap-2">
            <FileEarmarkText size={14} color="#2563eb" />
            <span className="small text-truncate" style={{ maxWidth: "220px" }}>
              {uploadedFile.name}
            </span>
            <button
              onClick={removeUploadedFile}
              className="btn btn-sm btn-link text-secondary p-0 ms-auto"
              aria-label="Remove file"
            >
              <XLg size={12} />
            </button>
          </div>
        )}

        {/* Messages body */}
        <div
          ref={bodyRef}
          className="card-body d-flex flex-column gap-2 overflow-auto"
          style={{ backgroundColor: "#f5f6f8" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex align-items-end gap-2 ${
                msg.sender === "user"
                  ? "align-self-end flex-row-reverse"
                  : "align-self-start"
              }`}
              style={{ maxWidth: "85%" }}
            >
              {msg.sender === "bot" && (
                <div
                  className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "32px", height: "32px" }}
                >
                  <Robot color="#6b7280" size={16} />
                </div>
              )}
              <div
                className="px-3 py-2 rounded-4"
                style={{
                  backgroundColor: msg.sender === "user" ? "#2563eb" : "#fff",
                  color: msg.sender === "user" ? "#fff" : "#1f2937",
                  fontSize: "14px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {(isSending || isUploading) && (
            <div
              className="d-flex align-items-end gap-2 align-self-start"
              style={{ maxWidth: "85%" }}
            >
              <div
                className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "32px", height: "32px" }}
              >
                <Robot color="#6b7280" size={16} />
              </div>
              <div
                className="px-3 py-2 rounded-4"
                style={{
                  backgroundColor: "#fff",
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                {isUploading ? "Uploading..." : "Typing..."}
              </div>
            </div>
          )}
        </div>

        {/* Footer / input */}
        <div className="card-footer bg-white border-top">
          <div className="d-flex align-items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: "36px", height: "36px" }}
              aria-label="Attach file"
              onClick={handleAttachClick}
              disabled={isUploading}
              title="Upload a PDF"
            >
              <Paperclip color="#6b7280" size={16} />
            </button>
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder={
                mode === "pdf"
                  ? "Ask something about your PDF..."
                  : mode === "search"
                    ? "Search the database..."
                    : "Type your message..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
            />
            <button
              onClick={sendMessage}
              className="btn rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#2563eb",
              }}
              aria-label="Send message"
              disabled={isSending || !input.trim()}
            >
              <SendFill color="white" size={16} />
            </button>
          </div>
        </div>

        <div className="text-center small text-muted py-1 border-top">
          Powered by <b style={{ color: "#2563eb" }}>softTech</b>
        </div>
      </div>
    </>
  );
}
