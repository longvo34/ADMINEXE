import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  getChatsByStatus,
  adminAcceptChat,
  adminSendMessage,
  getChatMessages,
} from "../../services/chatService";
import {
  getUserId,
  getUserRole,
  getUser,
} from "../../services/storageService";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const messagesEndRef = useRef(null);

  const currentUser = getUser();
  const adminId = getUserId();
  const role = getUserRole();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ FIXED: Format chat data
  const formatChats = (apiResponse) => {
  const chatsArray = apiResponse?.data?.data || [];
  return chatsArray.map(chat => {
    // ✅ FIX: Extract username đúng từ user object (fullName ưu tiên, fallback username hoặc chatId slice)
    const userFullName = chat.user?.fullName || chat.user?.username || null;
    const fallbackName = userFullName || chat.username || `User ${chat.chatId?.slice(-6)}`;
    
    return {
      ...chat,
      username: fallbackName,  // ← Sử dụng tên thật nếu có
      lastMessage: chat.messages?.[0]?.content || 
                   chat.lastMessageContent || 
                   chat.lastMessage || 
                   "Chưa có tin nhắn",
    };
  });
};

  // ✅ OPTIMIZED: Memoized fetchChats
  const fetchChats = useCallback(async () => {
    try {
      setLoadingChats(true);
      
      const [notYetRes, receptionRes] = await Promise.all([
        getChatsByStatus("NOT_YET"),
        getChatsByStatus("RECEPTION")
      ]);
      
      const notYetChats = formatChats(notYetRes);
      const receptionChats = formatChats(receptionRes);
      
      const allChats = [...notYetChats, ...receptionChats]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      
      setChats(allChats);
      console.log("✅ Loaded", allChats.length, "chats");
      
    } catch (error) {
      console.error("❌ fetchChats ERROR:", error);
    } finally {
      setLoadingChats(false);
    }
  }, []);

  // ✅ Select chat
  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    
    try {
      if (chat.status === "NOT_YET") {
        await adminAcceptChat(chat.chatId, adminId);
      }
      await loadMessages(chat.chatId);
    } catch (error) {
      console.error("❌ handleSelectChat ERROR:", error);
    }
  };

  // ✅ Load messages
  const loadMessages = async (chatId) => {
    try {
      setLoadingMessages(true);
      const res = await getChatMessages(chatId);
      
      let messagesData = [];
      if (res?.data) {
        if (Array.isArray(res.data)) {
          messagesData = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          messagesData = res.data.data;
        } else if (res.data.messages && Array.isArray(res.data.messages)) {
          messagesData = res.data.messages;
        }
      }
      
      setMessages(messagesData || []);
    } catch (error) {
      console.error("❌ loadMessages ERROR:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      await adminSendMessage(adminId, selectedChat.chatId, newMessage);
      setNewMessage("");
      await loadMessages(selectedChat.chatId);
      fetchChats(); // Chỉ refresh 1 lần sau khi gửi
    } catch (error) {
      console.error("❌ Send message ERROR:", error);
      alert("Lỗi gửi tin nhắn!");
    }
  };

  // ✅ FIXED: SMART REFRESH - Chỉ khi KHÔNG có chat đang mở
  useEffect(() => {
    fetchChats(); // Load lần đầu
    
    // ✅ Chỉ refresh khi KHÔNG có chat đang mở
    if (!selectedChat) {
      const interval = setInterval(() => {
        fetchChats();
      }, 10000); // 10s thay vì 3s
      
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    }
  }, [fetchChats, selectedChat]);

  // ✅ Cleanup interval khi unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  // ✅ Role check
  useEffect(() => {
    if (!currentUser || role !== "ADMIN") {
      alert("❌ Bạn cần quyền admin!");
      window.location.href = "/admin-login";
    }
  }, [currentUser, role]);

  return (
    <div style={{
      display: "flex",
      height: "90vh",
      backgroundColor: "#fff",
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    }}>
      {/* Sidebar */}
      <div style={{
        width: "30%",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
        padding: 16,
        backgroundColor: "#fafbfc",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: "#1c1e21", fontSize: 18, fontWeight: "bold" }}>
            💬 Danh sách chat ({chats.length})
          </h3>
          <button 
            onClick={fetchChats}
            disabled={loadingChats}
            style={{
              padding: "4px 12px",
              fontSize: 12,
              backgroundColor: loadingChats ? "#ccc" : "#0084ff",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: loadingChats ? "not-allowed" : "pointer",
            }}
          >
            🔄
          </button>
        </div>
        
        {loadingChats ? (
          <div style={{ padding: 20, textAlign: "center", color: "#888" }}>⏳ Đang tải...</div>
        ) : chats.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#888" }}>Không có chat nào</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => handleSelectChat(chat)}
              style={{
                padding: 12,
                borderRadius: 8,
                cursor: "pointer",
                marginBottom: 4,
                backgroundColor: selectedChat?.chatId === chat.chatId ? "#e3f2fd" : "white",
                borderLeft: chat.status === "NOT_YET" ? "4px solid #ff9800" : "4px solid #4caf50",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                <strong style={{ fontSize: 14, color: "#1c1e21" }}>
                  {chat.username}
                </strong>
                <span style={{ 
                  fontSize: 11, 
                  marginLeft: 8,
                  padding: "2px 6px",
                  borderRadius: 10,
                  backgroundColor: chat.status === "NOT_YET" ? "#fff3cd" : "#d4edda",
                  color: chat.status === "NOT_YET" ? "#856404" : "#155724",
                }}>
                  {chat.status === "NOT_YET" ? "⏳ Chờ" : "✅ Hỗ trợ"}
                </span>
              </div>
              <p style={{
                fontSize: 13,
                color: "#65676b",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {chat.lastMessage}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Chat Box */}
      <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            <div style={{
              borderBottom: "1px solid #ddd",
              padding: "16px 20px",
              backgroundColor: "#f8f9fa",
            }}>
              <h3 style={{ margin: 0, color: "#1c1e21" }}>
                💬 Chat với: <strong>{selectedChat.username}</strong>
                <span style={{ 
                  fontSize: 13, 
                  marginLeft: 12,
                  padding: "4px 8px",
                  borderRadius: 12,
                  backgroundColor: selectedChat.status === "NOT_YET" ? "#fff3cd" : "#d4edda",
                  color: selectedChat.status === "NOT_YET" ? "#856404" : "#155724",
                }}>
                  {selectedChat.status === "NOT_YET" ? "⏳ Chờ hỗ trợ" : "✅ Đang hỗ trợ"}
                </span>
              </h3>
            </div>

            <div style={{
              flex: 1,
              padding: 20,
              overflowY: "auto",
              backgroundColor: "#fff",
              position: "relative",
            }}>
              {loadingMessages ? (
                <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
                  ⏳ Đang tải tin nhắn...
                </div>
              ) : !Array.isArray(messages) || messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
                  📭 Chưa có tin nhắn nào
                </div>
              ) : (
                <>
                 {messages.map((msg, i) => {
  const isAdmin = msg.sender?.role === "ADMIN";

  return (
    <div
      key={i}
      style={{
        display: "flex",
        justifyContent: isAdmin ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: 18,
          backgroundColor: isAdmin ? "#0084ff" : "#e4e6eb",
          color: isAdmin ? "#fff" : "#1c1e21",
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          textAlign: "left",
        }}
      >
        <div>{msg.message}</div>

        {msg.createdAt && (
          <div
            style={{
              fontSize: 11,
              opacity: 0.7,
              marginTop: 4,
              textAlign: isAdmin ? "right" : "left",
            }}
          >
            {new Date(msg.createdAt).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
})}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div style={{
              borderTop: "1px solid #ddd",
              padding: 12,
              display: "flex",
              gap: 8,
              backgroundColor: "#f8f9fa",
            }}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 20,
                  border: "1px solid #ddd",
                  outline: "none",
                  fontSize: 14,
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                style={{
                  backgroundColor: newMessage.trim() ? "#0084ff" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  padding: "10px 20px",
                  cursor: newMessage.trim() ? "pointer" : "not-allowed",
                  fontWeight: 500,
                }}
              >
                Gửi
              </button>
            </div>
          </>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            color: "#888",
            fontSize: 16,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
            <div>Chọn một cuộc trò chuyện để bắt đầu hỗ trợ</div>
          </div>
        )}
      </div>
    </div>
  );
}