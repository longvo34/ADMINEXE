import React, { useEffect, useState } from "react";
import { getAllUsers, getAllBanks } from "../../services/accountService";

export default function AccountList() {
  const [users, setUsers] = useState([]);
  const [banks, setBanks] = useState({}); // Map bankId -> bankName
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8; // số user mỗi trang

  // 🧩 Gọi API danh sách user (trừ ADMIN)
  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      if (res.status === 200) {
        const filtered = res.data
  .filter((u) => u.role !== "ADMIN")
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
setUsers(filtered);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách user:", err);
    }
  };

  // 🧩 Gọi API danh sách banks và map thành object {bankId: bankName}
  const fetchBanks = async () => {
    try {
      const res = await getAllBanks();
      console.log("📜 Kết quả API /api/banks:", res); // Debug: Kiểm tra res
      if (res && res.status === 200 && Array.isArray(res.data)) {
        const bankMap = {};
        res.data.forEach(bank => {
          if (bank.bankId && bank.bankName) {
            bankMap[bank.bankId] = bank.bankName;
          }
        });
        setBanks(bankMap);
        console.log("✅ Loaded banks map:", bankMap); // Debug: Kiểm tra map
      } else {
        console.error("❌ API getAllBanks không hợp lệ - res:", res);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách banks:", err);
    }
  };

  // 🧩 Tìm chi tiết user từ danh sách đã load
  const handleViewDetail = async (userId) => {
    if (!userId) {
      console.warn("⚠️ userId không hợp lệ");
      return;
    }

    // Lazy load banks nếu chưa có
    if (Object.keys(banks).length === 0) {
      console.log("🔄 Đang load banks...");
      await fetchBanks();
    }

    const user = users.find(u => u.userId === userId);
    if (user) {
      console.log("🔍 User bankId:", user.bankId);
      console.log("🔍 Banks keys:", Object.keys(banks));
      setSelectedUser(user);
      setIsModalOpen(true);
      console.log("✅ User:", user.fullName);
    } else {
      console.error("❌ Không tìm thấy user:", userId);
      alert("Không tìm thấy user!");
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    loadData();
  }, []);

  // Tìm kiếm
  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filteredUsers.length / limit);
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  // Lấy tên ngân hàng
  const getBankName = (bankId) => {
    if (!bankId) return "N/A (Chưa liên kết)";
    const name = banks[bankId];
    console.log(`🔍 Tìm bankId ${bankId}: ${name || "KHÔNG TÌM THẤY"}`); // Debug
    return name || "N/A";
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>👥 Quản lý tài khoản người dùng</h2>

      {/* Tìm kiếm */}
      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <input
          type="text"
          placeholder="🔍 Tìm theo tên..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "6px 10px",
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
      </div>

      {loading ? (
        <p>⏳ Đang tải...</p>
      ) : paginatedUsers.length === 0 ? (
        <p>Không có người dùng.</p>
      ) : (
        <div
          style={{
            maxHeight: "450px",
            overflowY: "auto",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: "8px 12px",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Họ tên</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Email</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Ngày sinh</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr key={u.userId}>
                  <td style={{ padding: 8 }}>{u.fullName}</td>
                  <td style={{ padding: 8 }}>{u.username}</td>
                  <td style={{ padding: 8 }}>{u.dateOfBirth}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => handleViewDetail(u.userId)}
                      style={{
                        background: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "4px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{ marginRight: 8 }}
          >
            ⬅ Trước
          </button>
          <span> Trang {page}/{totalPages} </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{ marginLeft: 8 }}
          >
            Sau ➡
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: "white",
              padding: 24,
              borderRadius: 12,
              width: "90%",
              maxWidth: 500,
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "50%",
                width: 30,
                height: 30,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✖
            </button>

            <h3 style={{ marginBottom: 16, color: "#333" }}>👤 Thông tin người dùng</h3>
            
            {selectedUser ? (
              <div style={{ lineHeight: 1.6 }}>
                <p><strong>Họ tên:</strong> {selectedUser.fullName || "N/A"}</p>
                <p><strong>Email:</strong> {selectedUser.username || "N/A"}</p>
                <p><strong>Ngày sinh:</strong> {selectedUser.dateOfBirth || "N/A"}</p>
                <p><strong>Số tài khoản ngân hàng:</strong> {selectedUser.bankNumber || "N/A"}</p>
                <p><strong>Bio:</strong> {selectedUser.bio || "Không có"}</p>
                <p><strong>Ngày tạo:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('vi-VN') : "N/A"}</p>
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#ff0000" }}>Không tải được thông tin!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}