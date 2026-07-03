import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getMyConversations, getMessages, sendMessage, getErrorMessage } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { findConversationForJob } from "../utils/helpers";
import StatusBadge from "../components/StatusBadge";
import UserAvatar from "../components/UserAvatar";

const Chat = () => {
  const { user } = useAuth();
  const { markChatAsRead, refresh } = useNotifications();
  const [searchParams] = useSearchParams();
  const conversationParam = searchParams.get("conversation");
  const jobParam = searchParams.get("job");
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadConversations = async () => {
    try {
      const { data } = await getMyConversations();
      const list = data.conversations || [];
      setConversations(list);
      markChatAsRead(list);
      refresh();

      if (conversationParam && list.some((c) => c._id === conversationParam)) {
        setActiveId(conversationParam);
      } else if (jobParam) {
        const conv = findConversationForJob(list, jobParam);
        if (conv) setActiveId(conv._id);
      } else if (list.length && !activeId) {
        setActiveId(list[0]._id);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    if (!conversationId) return;
    setMsgLoading(true);
    try {
      const { data } = await getMessages(conversationId);
      setMessages(data.messages || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setMsgLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [conversationParam, jobParam]);

  useEffect(() => {
    if (activeId) loadMessages(activeId);
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getOtherUser = (conv) => {
    if (!conv || !user) return { name: "User", image: "" };
    const clientId = conv.clientId?._id || conv.clientId;
    const isClient = clientId?.toString() === user._id?.toString();
    const other = isClient ? conv.providerId : conv.clientId;
    return {
      name: other?.fullName || other?.name || "User",
      image: other?.profileImage || "",
    };
  };

  const activeConv = conversations.find((c) => c._id === activeId);
  const activeOther = activeConv ? getOtherUser(activeConv) : null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    setSending(true);
    try {
      await sendMessage({ conversationId: activeId, message: text.trim() });
      setText("");
      await loadMessages(activeId);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <Container fluid="md" className="px-2 px-md-3">
      <h1 className="page-title mb-3 mb-md-4 animate-in">Messages</h1>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="sh-card chat-empty p-5 animate-in">
          <div className="chat-empty-icon">💬</div>
          <h5>No conversations yet</h5>
          <p className="text-muted mb-0 small">
            When a client accepts your application, you can chat here.
          </p>
        </div>
      ) : (
        <div className="chat-layout animate-in">
          <Row className="g-0">
            <Col md={4}>
              <div className="chat-sidebar">
                <div className="chat-sidebar-header">Conversations</div>
                {conversations.map((conv) => {
                  const other = getOtherUser(conv);
                  return (
                    <div
                      key={conv._id}
                      className={`chat-thread-item ${conv._id === activeId ? "active" : ""}`}
                      onClick={() => setActiveId(conv._id)}
                      onKeyDown={(e) => e.key === "Enter" && setActiveId(conv._id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <UserAvatar src={other.image} name={other.name} size={42} />
                        <div className="flex-grow-1 min-width-0">
                          <div className="d-flex justify-content-between align-items-center gap-1">
                            <strong className="text-truncate small">{other.name}</strong>
                            {conv.jobId?.status && (
                              <StatusBadge status={conv.jobId.status} style={{ fontSize: "0.65rem" }} />
                            )}
                          </div>
                          <div className="small text-muted text-truncate">
                            {conv.jobId?.title || "Job chat"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Col>
            <Col md={8}>
              <div className="chat-panel">
                {activeConv && activeOther ? (
                  <>
                    <div className="chat-panel-header d-flex align-items-center gap-3">
                      <UserAvatar src={activeOther.image} name={activeOther.name} size={48} />
                      <div>
                        <h6 className="mb-0 fw-bold">{activeOther.name}</h6>
                        <small className="text-muted">{activeConv.jobId?.title}</small>
                      </div>
                    </div>
                    <div className="chat-messages">
                      {msgLoading ? (
                        <div className="text-center py-4">
                          <Spinner size="sm" />
                        </div>
                      ) : messages.length === 0 ? (
                        <p className="text-muted small text-center py-4">
                          No messages yet. Say hello! 👋
                        </p>
                      ) : (
                        messages.map((m) => {
                          const mine =
                            (m.senderId?._id || m.senderId)?.toString() === user?._id?.toString();
                          const senderName = m.senderId?.fullName || m.senderId?.name || "User";
                          const senderImage = m.senderId?.profileImage || "";

                          return (
                            <div
                              key={m._id}
                              className={`chat-message-row ${mine ? "mine" : "theirs"}`}
                            >
                              {!mine && (
                                <UserAvatar
                                  src={senderImage}
                                  name={senderName}
                                  size={32}
                                  className="user-avatar-fallback--sm"
                                />
                              )}
                              <div className={`chat-bubble ${mine ? "mine" : "theirs"}`}>
                                {!mine && (
                                  <div className="small fw-semibold mb-1" style={{ color: "var(--sh-primary)" }}>
                                    {senderName}
                                  </div>
                                )}
                                {m.message}
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <Form onSubmit={handleSend} className="chat-input-bar d-flex gap-2">
                      <Form.Control
                        className="sh-input flex-grow-1"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={!activeId || sending}
                      />
                      <Button
                        type="submit"
                        className="btn-sh-primary px-3"
                        disabled={!activeId || sending || !text.trim()}
                      >
                        {sending ? "…" : "Send"}
                      </Button>
                    </Form>
                  </>
                ) : (
                  <div className="chat-empty">
                    <div className="chat-empty-icon">💬</div>
                    <p>Select a conversation to start chatting</p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default Chat;
