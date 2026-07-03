import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  getPendingApplicationsSummary,
  getMyAppliedJobs,
  getMyConversations,
} from "../api/services";

const NotificationContext = createContext(null);

const seenChatsKey = (userId) => `sh_seen_chats_${userId}`;
const getSeenIds = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const saveSeenIds = (key, ids) => {
  localStorage.setItem(key, JSON.stringify(ids));
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, role, user } = useAuth();
  const location = useLocation();
  const userId = user?._id;

  const [pendingApplications, setPendingApplications] = useState(0);
  const [unreadChat, setUnreadChat] = useState(0);
  const [providerUpdates, setProviderUpdates] = useState(0);

  const syncChatUnread = useCallback(
    (conversations) => {
      if (!userId) return;
      const seen = new Set(getSeenIds(seenChatsKey(userId)));
      const unread = conversations.filter((c) => !seen.has(c._id)).length;
      setUnreadChat(unread);
    },
    [userId],
  );

  const markChatAsRead = useCallback(
    (conversations) => {
      if (!userId) return;
      const ids = (conversations || []).map((c) => c._id);
      saveSeenIds(seenChatsKey(userId), ids);
      setUnreadChat(0);
    },
    [userId],
  );

  const refresh = useCallback(async () => {
    if (!isAuthenticated || !userId) return;

    try {
      if (role === "client") {
        const { data } = await getPendingApplicationsSummary();
        const total = data.totalPending || 0;
        if (location.pathname.startsWith("/applications")) {
          setPendingApplications(0);
        } else {
          setPendingApplications(total);
        }
      }

      if (role === "provider") {
        const { data } = await getMyAppliedJobs();
        const accepted = (data.applications || []).filter(
          (a) => a.status === "accepted",
        ).length;
        setProviderUpdates(accepted);
      }

      if (role === "client" || role === "provider") {
        const { data } = await getMyConversations();
        const list = data.conversations || [];
        if (location.pathname.startsWith("/chat")) {
          markChatAsRead(list);
        } else {
          syncChatUnread(list);
        }
      }
    } catch {
      /* non-critical */
    }
  }, [
    isAuthenticated,
    role,
    userId,
    location.pathname,
    markChatAsRead,
    syncChatUnread,
  ]);

  useEffect(() => {
    refresh();
    if (!isAuthenticated) return undefined;
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, [refresh, isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        pendingApplications,
        unreadChat,
        providerUpdates,
        refresh,
        markChatAsRead,
        syncChatUnread,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
};
