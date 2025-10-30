// 📦 storageService.js (Web - KHÔNG DÙNG TOKEN)

const USER_KEY = "userInfo";
const ADMIN_KEY = "adminInfo";

// ======================
// 🔹 Lưu user / admin
// ======================
export const saveUser = (user) => {
  try {
    if (!user) return;
    const oldUser = getUser();
    const oldUserId = oldUser ? oldUser.userId : null;

    // 🟢 Nếu đổi tài khoản thì xóa chatId cũ
    if (oldUserId && oldUserId !== user.userId) {
      clearChatId(oldUserId);
      console.log("🗑️ [STORAGE] Switch acc khác, clear chatId cũ của", oldUserId);
    }

    const key = user.role === "admin" ? ADMIN_KEY : USER_KEY;
    localStorage.setItem(key, JSON.stringify(user));
    console.log("💾 [STORAGE] Đã lưu user:", user.userId, "| Role:", user.role);
  } catch (error) {
    console.error("❌ Error saving user:", error);
  }
};

// ======================
// 🔹 Lấy user hoặc admin (ưu tiên admin trước nếu tồn tại)
// ======================
export const getUser = () => {
  try {
    const admin = localStorage.getItem(ADMIN_KEY);
    if (admin) return JSON.parse(admin);
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("❌ Error getting user:", error);
    return null;
  }
};

// ======================
// 🔹 Xóa user / admin
// ======================
export const clearUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ADMIN_KEY);
    console.log("🗑️ [STORAGE] Đã xóa user/admin info");
  } catch (error) {
    console.error("❌ Error clearing user:", error);
  }
};

// ======================
// 🔹 Lấy userId
// ======================
export const getUserId = () => {
  try {
    const user = getUser();
    const userId = user ? user.userId : null;
    console.log("👤 [STORAGE] Lấy userId:", userId);
    return userId;
  } catch (error) {
    console.error("❌ Error getting userId:", error);
    return null;
  }
};

// ======================
// 🔹 Lấy role
// ======================
export const getUserRole = () => {
  try {
    const user = getUser();
    const role = user ? user.role : null;
    console.log("👑 [STORAGE] Lấy userRole:", role);
    return role;
  } catch (error) {
    console.error("❌ Error getting userRole:", error);
    return null;
  }
};

// ======================
// 🔹 Chat ID theo userId
// ======================
export const saveChatId = (userId, chatId) => {
  try {
    const key = `chatId_${userId}`;
    localStorage.setItem(key, chatId);
    console.log("💾 [STORAGE] Đã lưu chatId cho user", userId, ":", chatId);
  } catch (error) {
    console.error("❌ Error saving chatId:", error);
  }
};

export const getChatId = (userId) => {
  try {
    const key = `chatId_${userId}`;
    const chatId = localStorage.getItem(key);
    console.log("💾 [STORAGE] Lấy chatId cho user", userId, ":", chatId);
    return chatId;
  } catch (error) {
    console.error("❌ Error getting chatId:", error);
    return null;
  }
};

export const clearChatId = (userId) => {
  try {
    const key = `chatId_${userId}`;
    localStorage.removeItem(key);
    console.log("🗑️ [STORAGE] Đã xóa chatId cho user", userId);
  } catch (error) {
    console.error("❌ Error clearing chatId:", error);
  }
};

// ======================
// 🔹 Clear toàn bộ (giữ chatId)
// ======================
export const clearAll = () => {
  try {
    clearUser();
    console.log("🗑️ [STORAGE] Đã clear user/admin (giữ chatId)");
  } catch (error) {
    console.error("❌ Error clearing all:", error);
  }
};
