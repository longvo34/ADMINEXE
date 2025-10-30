import axios from "axios";

const API_URL = "/api/users";

export const loginAdmin = async (username, password) => {
  try {
    const body = { username, password }; 
    console.log("Gửi request với body:", body);
    const res = await axios.post(`${API_URL}/login`, body, {
      headers: { 'Content-Type': 'application/json' } 
    });
    console.log("Response thành công:", res.data);
    return res.data;
  } catch (error) {
    console.error("Lỗi đầy đủ:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error.response?.data || { message: "Lỗi đăng nhập" };
  }
};

