// src/pages/Transactions/TransactionPage.jsx
import React, { useEffect, useState } from "react";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 6;

  // 12 BẢN GHI CỨNG ĐÚNG THEO ẢNH
  const HARDCODED_TRANSACTIONS = [
  {
    transactionId: "TXN001",
    user: { fullName: "Trần Văn Đức", username: "ducvann@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-11T23:54:45+07:00", // 11-11-2025 23:54:45
  },
  {
    transactionId: "TXN002",
    user: { fullName: "Đặng Nguyễn Hữu Khoa", username: "cfvnkhoa@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-11T23:53:40+07:00", // 11-11-2025 23:53:40
  },
  {
    transactionId: "TXN003",
    user: { fullName: "Võ Ngọc Bích Linh", username: "linhngocvo2312@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-10T23:55:57+07:00", // 10-11-2025 23:55:57
  },
  {
    transactionId: "TXN004",
    user: { fullName: "Phạm Hoàng Thiên", username: "phamthiendeptrai@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-10T23:50:08+07:00", // 10-11-2025 23:50:08
  },
  {
    transactionId: "TXN005",
    user: { fullName: "Nguyễn Mạnh Tiến", username: "tiennmse170204@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-10T23:48:02+07:00", // 10-11-2025 23:48:02
  },
  {
    transactionId: "TXN006",
    user: { fullName: "Vũ Thị Trâm Anh", username: "cuteAnh@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-10T23:46:05+07:00", // 10-11-2025 23:46:05
  },
  {
    transactionId: "TXN007",
    user: { fullName: "Nguyễn Quốc Chánh", username: "chanhnqse160851@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-09T23:44:09+07:00", // 09-11-2025 23:44:09
  },
  {
    transactionId: "TXN008",
    user: { fullName: "Trịnh Tiến Đạt", username: "datttse184725@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-09T23:40:57+07:00", // 09-11-2025 23:40:57
  },
  {
    transactionId: "TXN009",
    user: { fullName: "Trịnh Kim Phát", username: "phattkss180837@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-09T21:25:52+07:00", // 09-11-2025 21:25:52
  },
  {
    transactionId: "TXN010",
    user: { fullName: "Lê	Vĩnh Phát", username: "phatlvhe179015@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-09T21:08:44+07:00", // 09-11-2025 21:08:44
  },
  {
    transactionId: "TXN011",
    user: { fullName: "Nguyễn Duy Thịnh", username: "nguyenduythinh42@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-08T20:58:06+07:00", // 08-11-2025 20:58:06
  },
  {
    transactionId: "TXN012",
    user: { fullName: "Lê Thế Giang", username: "blackgiang@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-08T20:22:51+07:00", // 08-11-2025 20:22:51
  },
    {
    transactionId: "TXN013",
    user: { fullName: "Biện	Thị Trúc Phương", username: "phuongbttse171613@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-07T11:01:27+07:00", // 07-11-2025 11:01:27
  },
  {
    transactionId: "TXN014",
    user: { fullName: "Đỗ	Hoàng Bảo	Trân", username: "trangdhbse182181@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-06T14:38:11+07:00", // 06-11-2025 14:38:11
  },
  {
    transactionId: "TXN015",
    user: { fullName: "Nguyễn Hoàng Nhật Anh", username: "chuoideptrai@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-05T17:13:26+07:00", // 05-11-2025 17:13:26
  },
  {
    transactionId: "TXN016",
    user: { fullName: "Lê	Đức	Thành", username: "thanhldse170144@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-05T19:35:39+07:00", // 05-11-2025 19:35:39
  },
  {
    transactionId: "TXN017",
    user: { fullName: "	Trần Đông Thạnh", username: "thanhtdse171719@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-04T10:43:35+07:00", // 04-11-2025 10:43:35
  },
  {
    transactionId: "TXN018",
    user: { fullName: "	Võ Việt Thắng", username: "thangvvse180202@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-04T19:19:15+07:00", // 04-11-2025 19:19:15
  },
  {
    transactionId: "TXN019",
    user: { fullName: "Phan Văn Dũng", username: "vandungphanhd@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-03T20:41:46+07:00", // 03-11-2025 20:41:46
  },
  {
    transactionId: "TXN020",
    user: { fullName: "Nguyễn	Thành	Đạt", username: "datntse170123@fpt.edu.vn" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-03T17:43:02+07:00", // 03-11-2025 17:43:02
  },
  {
    transactionId: "TXN021",
    user: { fullName: "Nguyễn Tuấn An", username: "nguyenan233@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-02T00:02:40+07:00", // 02-11-2025 00:02:40
  },
  {
    transactionId: "TXN022",
    user: { fullName: "Trương Hoài An", username: "antruongHoai@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-01T23:42:25+07:00", // 01-11-2025 23:42:25
  },
  {
    transactionId: "TXN023",
    user: { fullName: "Lâm Quốc Huy", username: "huyhandsome@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-01T22:31:05+07:00", // 01-11-2025 22:31:05
  },
  {
    transactionId: "TXN024",
    user: { fullName: "Bùi Phương Thảo", username: "thaobui@gmail.com" },
    transactionType: "MEMBERSHIP",
    amount: 50000,
    createdAt: "2025-11-01T17:43:19+07:00", // 01-11-2025 17:43:19
  },

];


  const fetchTransactions = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const sorted = [...HARDCODED_TRANSACTIONS].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setTransactions(sorted);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [transactionType]);

  const filteredTransactions = transactions.filter((t) =>
    t.user?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / limit);
  const paginated = filteredTransactions.slice((page - 1) * limit, page * limit);

  const handleViewDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const getTransactionTypeLabel = (type) =>
    type === "MEMBERSHIP" ? "Gói thành viên" : type;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).replace(/\//g, "-");

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>Danh sách giao dịch</h2>

      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <select
          value={transactionType}
          onChange={(e) => { setTransactionType(e.target.value); setPage(1); }}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="">Tất cả loại</option>
          <option value="MEMBERSHIP">Thành viên</option>
        </select>

        <input
          type="text"
          placeholder="Tìm theo tên người dùng..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: 200, padding: "6px 10px", border: "1px solid #ccc", borderRadius: 6 }}
        />
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : paginated.length === 0 ? (
        <p>Không có giao dịch nào.</p>
      ) : (
        <div style={{ maxHeight: 420, overflowY: "auto", borderRadius: 8, border: "1px solid #eee", padding: 8, background: "#fafafa" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {paginated.map((t) => (
              <li
                key={t.transactionId}
                onClick={() => handleViewDetail(t)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: 12,
                  cursor: "pointer",
                  background: "#fff",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f2f2f2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                <strong>{t.user?.fullName || "Không rõ"}</strong>
                <br />
                <b>Loại:</b> {getTransactionTypeLabel(t.transactionType)}
                <br />
                <b>Số tiền:</b> {t.amount?.toLocaleString()}₫
                <br />
                <small style={{ color: "#777" }}>
                  {formatDate(t.createdAt)}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PHÂN TRANG */}
      {totalPages > 0 && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "12px 0" }}>
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", background: page === 1 ? "#f5f5f5" : "#fff", color: page === 1 ? "#999" : "#333", cursor: page === 1 ? "not-allowed" : "pointer", fontWeight: 500 }}>
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button key={pageNum} onClick={() => setPage(pageNum)}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd", background: page === pageNum ? "#007bff" : "#fff", color: page === pageNum ? "white" : "#333", cursor: "pointer", fontWeight: page === pageNum ? "bold" : "normal", minWidth: 40 }}>
              {pageNum}
            </button>
          ))}

          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", background: page === totalPages ? "#f5f5f5" : "#fff", color: page === totalPages ? "#999" : "#333", cursor: page === totalPages ? "not-allowed" : "pointer", fontWeight: 500 }}>
            Sau
          </button>

          <span style={{ fontSize: 14, color: "#666", whiteSpace: "nowrap" }}>
            Trang {page}/{totalPages}
          </span>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && selectedTransaction && (
        <div onClick={() => setIsModalOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: "white", padding: 24, borderRadius: 12, width: "90%", maxWidth: 500, position: "relative", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
            <button onClick={() => setIsModalOpen(false)}
              style={{ position: "absolute", top: 8, right: 8, border: "none", background: "transparent", fontSize: 18, cursor: "pointer" }}>
              X
            </button>

            <h3>Chi tiết giao dịch</h3>
            <p><b>Người dùng:</b> {selectedTransaction.user?.fullName || "Không rõ"}</p>
            <p><b>Email:</b> {selectedTransaction.user?.username}</p>
            <p><b>Loại:</b> {getTransactionTypeLabel(selectedTransaction.transactionType)}</p>
            <p><b>Số tiền:</b> {selectedTransaction.amount?.toLocaleString()}₫</p>
            <p><b>Thời gian:</b> {formatDate(selectedTransaction.createdAt)}</p>
          </div>
        </div>
      )}
    </div>
  );
}