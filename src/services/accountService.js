import axios from "axios";

const API_URL = "https://loopus.nguyenhoangan.site/api/users";  // ✅ Full URL nhất quán (từ getAllUsers)


export const HARDCODED_USERS = [
  {
    userId: "U001",
    fullName: "Trần Văn Đức",
    username: "ducvann@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-11T23:54:45+07:00",
  },
  {
    userId: "U002",
    fullName: "Đặng Nguyễn Hữu Khoa",
    username: "cfvnkhoa@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-11T23:53:40+07:00",
  },
  {
    userId: "U003",
    fullName: "Võ Ngọc Bích Linh",
    username: "linhngocvo2312@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-10T23:55:57+07:00",
  },
  {
    userId: "U004",
    fullName: "Phạm Hoàng Thiên",
    username: "phamthiendeptrai@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-10T23:50:08+07:00",
  },
  {
    userId: "U005",
    fullName: "Nguyễn Mạnh Tiến",
    username: "tiennmse170204@fpt.edu.vn",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-10T23:48:02+07:00",
  },
  {
    userId: "U006",
    fullName: "Vũ Thị Trâm Anh",
    username: "cuteAnh@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-10T23:46:05+07:00",
  },
  {
    userId: "U007",
    fullName: "Nguyễn Quốc Chánh",
    username: "chanhnqse160851@fpt.edu.vn",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-09T23:44:09+07:00",
  },
  {
    userId: "U008",
    fullName: "Trịnh Tiến Đạt",
    username: "datttse184725@fpt.edu.vn",
    dateOfBirth: "2004-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-09T23:40:57+07:00",
  },
  {
    userId: "U009",
    fullName: "Trịnh Kim Phát",
    username: "phattkss180837@fpt.edu.vn",
    dateOfBirth: "2004-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-09T21:25:52+07:00",
  },
  {
    userId: "U010",
    fullName: "Lê Vĩnh Phát",
    username: "phatlvhe179015@fpt.edu.vn",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-09T21:08:44+07:00",
  },
  {
    userId: "U011",
    fullName: "Nguyễn Duy Thịnh",
    username: "nguyenduythinh42@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-08T20:58:06+07:00",
  },
  {
    userId: "U012",
    fullName: "Lê Thế Giang",
    username: "blackgiang@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-08T20:22:51+07:00",
  },
  {
    userId: "U013",
    fullName: "Biện Thị Trúc Phương",
    username: "phuongbttse171613@fpt.edu.vn",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-07T11:01:27+07:00",
  },
  {
    userId: "U014",
    fullName: "Đỗ Hoàng Bảo Trân",
    username: "trangdhbse182181@fpt.edu.vn",
    dateOfBirth: "2004-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-06T14:38:11+07:00",
  },
  {
    userId: "U015",
    fullName: "Nguyễn Hoàng Nhật Anh",
    username: "chuoideptrai@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-05T17:13:26+07:00",
  },
  {
    userId: "U016",
    fullName: "Lê Đức Thành",
    username: "thanhldse170144@fpt.edu.vn",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-05T19:35:39+07:00",
  },
  {
    userId: "U017",
    fullName: "Trần Đông Thạnh",
    username: "thanhtdse171719@fpt.edu.vn",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-04T10:43:35+07:00",
  },
  {
    userId: "U018",
    fullName: "Võ Việt Thắng",
    username: "thangvvse180202@fpt.edu.vn",
    dateOfBirth: "2004-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-04T19:19:15+07:00",
  },
  {
    userId: "U019",
    fullName: "Phan Văn Dũng",
    username: "vandungphanhd@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-03T20:41:46+07:00",
  },
  {
    userId: "U020",
    fullName: "Nguyễn Thành Đạt",
    username: "datntse170123@fpt.edu.vn",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-03T17:43:02+07:00",
  },
  {
    userId: "U021",
    fullName: "Nguyễn Tuấn An",
    username: "nguyenan233@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-02T00:02:40+07:00",
  },
  {
    userId: "U022",
    fullName: "Trương Hoài An",
    username: "antruongHoai@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-01T23:42:25+07:00",
  },
  {
    userId: "U023",
    fullName: "Lâm Quốc Huy",
    username: "huyhandsome@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-01T22:31:05+07:00",
  },
  {
    userId: "U024",
    fullName: "Bùi Phương Thảo",
    username: "thaobui@gmail.com",
    dateOfBirth: "2003-01-01",
    bankNumber: "N/A",
    bio: "Không có",
    role: "USER",
    createdAt: "2025-11-01T17:43:19+07:00",
  },
];

/**
 * 🟢 Lấy tất cả users (trừ ADMIN nếu cần filter ở frontend)
 * @returns {Promise} Response data từ server (e.g., {status, message, data})
 */
export const getAllUsers = async () => {
  console.log("📦 [Mock] Đang trả về HARDCODED_USERS (không gọi API thật)");
  return Promise.resolve({
    status: 200,
    data: HARDCODED_USERS,
  });
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