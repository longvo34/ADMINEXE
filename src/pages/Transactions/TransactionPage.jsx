// src/pages/Transactions/TransactionPage.jsx
import React, { useEffect, useState } from "react";
import {
  getAllTransactions,
  getTransactionById,
} from "../../services/transactionService";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6; // số dòng mỗi trang

  // 🧩 Gọi API lấy tất cả giao dịch
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions(transactionType);

      // ✅ API service trả về mảng dữ liệu trực tiếp
      if (Array.isArray(data)) {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransactions(sorted);
      } else if (data?.data && Array.isArray(data.data)) {
        // fallback nếu backend gói trong `data`
        const sorted = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransactions(sorted);
      } else {
        console.warn("⚠️ Không nhận được dữ liệu hợp lệ từ API");
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách giao dịch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [transactionType]);

  // 🧭 Lọc theo tên người dùng
  const filteredTransactions = transactions.filter((t) =>
    t.user?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Phân trang
  const totalPages = Math.ceil(filteredTransactions.length / limit);
  const paginated = filteredTransactions.slice((page - 1) * limit, page * limit);

  // 🔍 Xem chi tiết 1 giao dịch
  const handleViewDetail = async (transactionId) => {
    try {
      const data = await getTransactionById(transactionId);
      if (data?.data) {
        setSelectedTransaction(data.data);
        setIsModalOpen(true);
      } else if (data) {
        setSelectedTransaction(data);
        setIsModalOpen(true);
      } else {
        console.warn("⚠️ Không nhận được dữ liệu chi tiết hợp lệ");
      }
    } catch (error) {
      console.error("❌ Lỗi khi xem chi tiết:", error);
    }
  };

  // 🔧 Hàm chuyển transactionType thành text thân thiện
  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case "DEPOSIT":
        return "Nạp tiền";
      case "MEMBERSHIP":
        return "Gói thành viên";
      default:
        return type;
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>💳 Danh sách giao dịch</h2>

      {/* Bộ lọc */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <select
          value={transactionType}
          onChange={(e) => {
            setTransactionType(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        >
          <option value="">Tất cả loại</option>
          <option value="DEPOSIT">Nạp tiền</option>
          <option value="MEMBERSHIP">Thành viên</option>
        </select>

        <input
          type="text"
          placeholder="Tìm theo tên người dùng..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "6px 10px",
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
      </div>

      {/* Danh sách giao dịch */}
      {loading ? (
        <p>⏳ Đang tải dữ liệu...</p>
      ) : paginated.length === 0 ? (
        <p>Không có giao dịch nào.</p>
      ) : (
        <div
          style={{
            maxHeight: 420,
            overflowY: "auto",
            borderRadius: 8,
            border: "1px solid #eee",
            padding: 8,
            background: "#fafafa",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {paginated.map((t) => (
              <li
                key={t.transactionId}
                onClick={() => handleViewDetail(t.transactionId)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: 12,
                  cursor: "pointer",
                  background: "#fff",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f2f2f2")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                <strong>{t.user?.fullName || "Không rõ"}</strong>
                <br />
                <b>Loại:</b> {getTransactionTypeLabel(t.transactionType)}
                <br />
                <b>Số tiền:</b> {t.amount?.toLocaleString() || 0}₫
                <br />
                <small style={{ color: "#777" }}>
                  {t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ PAGINATION */}
      {totalPages > 0 && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            padding: "12px 0",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: page === 1 ? "#f5f5f5" : "#fff",
              color: page === 1 ? "#999" : "#333",
              cursor: page === 1 ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            ⬅ Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #ddd",
                background: page === pageNum ? "#007bff" : "#fff",
                color: page === pageNum ? "white" : "#333",
                cursor: "pointer",
                fontWeight: page === pageNum ? "bold" : "normal",
                minWidth: 40,
              }}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: page === totalPages ? "#f5f5f5" : "#fff",
              color: page === totalPages ? "#999" : "#333",
              cursor: page === totalPages ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            Sau ➡
          </button>

          <span style={{ fontSize: 14, color: "#666", whiteSpace: "nowrap" }}>
            Trang {page}/{totalPages}
          </span>
        </div>
      )}

      {/* Modal chi tiết giao dịch */}
      {isModalOpen && selectedTransaction && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: 24,
              borderRadius: 12,
              width: "90%",
              maxWidth: 500,
              position: "relative",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                border: "none",
                background: "transparent",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <h3>Chi tiết giao dịch</h3>
            <p>
              <b>Người dùng:</b>{" "}
              {selectedTransaction.user?.fullName || "Không rõ"}
            </p>
            <p>
              <b>Email:</b> {selectedTransaction.user?.username}
            </p>
            <p>
              <b>Loại:</b> {getTransactionTypeLabel(selectedTransaction.transactionType)}
            </p>
            <p>
              <b>Số tiền:</b>{" "}
              {selectedTransaction.amount?.toLocaleString()}₫
            </p>
            <p>
              <b>Thời gian:</b>{" "}
              {selectedTransaction.createdAt
                ? new Date(selectedTransaction.createdAt).toLocaleString()
                : "Không có"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
