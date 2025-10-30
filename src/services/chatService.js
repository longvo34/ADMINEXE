// src/services/chatService.js
import axios from "axios";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api/support";

/**
 * 🟢 4. Lấy tất cả tin nhắn trong 1 box chat - FIXED
 */
export const getChatMessages = async (chatId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${chatId}/messages`);
    console.log("✅ [getChatMessages] RAW Response:", res);
    
    // ✅ TRẢ VỀ ĐÚNG FORMAT cho React
    return {
      status: res.status,
      data: res.data // ← TRẢ res.data trực tiếp, KHÔNG unwrap
    };
  } catch (error) {
    console.error("❌ [getChatMessages] Error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🟢 1. Lấy danh sách chat - FIXED
 */
export const getChatsByStatus = async (status = "NOT_YET") => {
  try {
    const res = await axios.get(`${API_BASE_URL}/chat?status=${status}`);
    console.log(`✅ [getChatsByStatus ${status}] Response:`, res.data);
    return {
      status: res.status,
      data: res.data
    };
  } catch (error) {
    console.error(`❌ [getChatsByStatus ${status}] Error:`, error);
    throw error;
  }
};

/**
 * 🟢 2. Admin tiếp nhận chat - FIXED
 */
export const adminAcceptChat = async (chatId, adminId) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/${chatId}/reception?adminId=${adminId}`);
    console.log("✅ [adminAcceptChat] Success:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ [adminAcceptChat] Error:", error);
    throw error;
  }
};

/**
 * 🟢 3. Admin gửi tin nhắn - FIXED  
 */
export const adminSendMessage = async (adminId, chatId, message) => {
  try {
    const url = `${API_BASE_URL}/${adminId}/${chatId}?message=${encodeURIComponent(message)}`;
    const res = await axios.post(url);
    console.log("✅ [adminSendMessage] Success");
    return res.data;
  } catch (error) {
    console.error("❌ [adminSendMessage] Error:", error);
    throw error;
  }
};