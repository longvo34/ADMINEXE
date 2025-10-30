import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/users";  // ✅ Full URL nhất quán (từ getAllUsers)

/**
 * 🟢 Lấy tất cả users (trừ ADMIN nếu cần filter ở frontend)
 * @returns {Promise} Response data từ server (e.g., {status, message, data})
 */
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ In ra để kiểm tra
    console.log("📜 Kết quả API /api/users:", response.data);

    return response.data; // Trả về { status, message, data }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API getAllUsers:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🟢 Lấy chi tiết 1 user theo ID (FIX: Thêm hàm này để resolve import error ở AccountList)
 * @param {string} userId - UUID của user
 * @returns {Promise} Response data từ server
 */
export const getUserDetail = async (userId) => {
  if (!userId) {
    console.warn("⚠️ [getUserDetail] userId undefined hoặc rỗng");
    throw new Error("userId required");
  }
  try {
    const res = await axios.get(`${API_URL}/${userId}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("✅ [getUserDetail] Response cho userId", userId, ":", res.data);
    return res.data;  // Trả về data trực tiếp (nhất quán với getAllUsers)
  } catch (error) {
    console.error("❌ [getUserDetail] Error cho userId", userId, ":", error.response?.data || error.message);
    throw error;
  }
};

/**
 * 🟢 Lấy tất cả banks
 * @returns {Promise} Response data từ server (e.g., {status, message, data})
 */
export const getAllBanks = async () => {
  try {
    const response = await axios.get(`${BANKS_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ In ra để kiểm tra
    console.log("📜 Kết quả API /api/banks:", response.data);

    return response.data; // Trả về { status, message, data }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API getAllBanks:", error.response?.data || error.message);
    throw error;
  }
};