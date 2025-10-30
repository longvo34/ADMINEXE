import axios from "axios";

const API_BASE_URL = "https://loopus.nguyenhoangan.site/api";

/**
 * Lấy danh sách feedback (có thể filter theo type)
 * @param {string} [type] - Loại feedback: "bug", "suggestion", "other"
 * @returns {Promise<Object>} - Kết quả từ API
 */
export const getFeedbacks = async (type) => {
  try {
    const url = `${API_BASE_URL}/feedbacks`;
    const response = await axios.get(url, {
      params: type ? { type } : {}, // nếu có type thì filter
    });
    return response.data;
  } catch (error) {
    console.error("❌ [getFeedbacks] Lỗi khi lấy danh sách feedback:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết một feedback cụ thể
 * @param {string} feedbackId - ID của feedback
 * @returns {Promise<Object>} - Kết quả từ API
 */
export const getFeedbackDetail = async (feedbackId) => {
  try {
    const url = `${API_BASE_URL}/feedback`;
    const response = await axios.get(url, {
      params: { feedbackId },
    });
    return response.data;
  } catch (error) {
    console.error("❌ [getFeedbackDetail] Lỗi khi lấy chi tiết feedback:", error);
    throw error;
  }
};
