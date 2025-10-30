// src/services/transactionService.js
import axios from "axios";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api/transactions";

/**
 * 🟢 Lấy tất cả giao dịch (ADMIN)
 * @param {string} [transactionType] - "DEPOSIT" | "MEMBERSHIP" (tùy chọn)
 */
export const getAllTransactions = async (transactionType) => {
  try {
    const url = transactionType
      ? `${API_BASE_URL}?transactionType=${transactionType}`
      : API_BASE_URL;

    const res = await axios.get(url);

    // ✅ Debug log để xem dữ liệu thật
    console.log("📦 [getAllTransactions] Response:", res.data);

    // ✅ Nếu API trả về { status: 200, data: [...] }
    if (res?.data?.status === 200) {
      return res.data.data || [];
    }

    return [];
  } catch (error) {
    console.error("❌ [getAllTransactions] Error:", error);
    throw error;
  }
};

/**
 * 🟢 Lấy tất cả giao dịch của 1 user
 * @param {string} userId - ID của user
 * @param {string} [transactionType] - "DEPOSIT" | "MEMBERSHIP" (tùy chọn)
 */
export const getTransactionsByUser = async (userId, transactionType) => {
  try {
    let url = `${API_BASE_URL}/${userId}/user`;
    if (transactionType) url += `?transactionType=${transactionType}`;

    const res = await axios.get(url);
    console.log("📦 [getTransactionsByUser] Response:", res.data);

    if (res?.data?.status === 200) {
      return res.data.data || [];
    }

    return [];
  } catch (error) {
    console.error("❌ [getTransactionsByUser] Error:", error);
    throw error;
  }
};

/**
 * 🟢 Lấy chi tiết 1 giao dịch theo ID
 * @param {string} transactionId - ID của giao dịch
 */
export const getTransactionById = async (transactionId) => {
  try {
    const url = `${API_BASE_URL}/${transactionId}`;
    const res = await axios.get(url);
    console.log("📦 [getTransactionById] Response:", res.data);

    if (res?.data?.status === 200) {
      return res.data.data || null;
    }

    return null;
  } catch (error) {
    console.error("❌ [getTransactionById] Error:", error);
    throw error;
  }
};
