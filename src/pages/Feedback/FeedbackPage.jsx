import React, { useEffect, useState } from "react";
import { getFeedbacks, getFeedbackDetail } from "../../services/feedbackService";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false); // Thêm state loading cho chi tiết
  const [type, setType] = useState(""); // "" | "bug" | "suggestion"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6; // 🔹 chỉ hiển thị 6 feedback mỗi trang

  // 🧩 Gọi API lấy danh sách feedback
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await getFeedbacks(type);
      if (res.status === 0) {
        const data = res.data || [];

        // ✅ Sắp xếp theo ngày tạo (nếu có), ưu tiên mới nhất
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });

        setFeedbacks(sorted);
      } else {
        console.warn("⚠️ API feedbacks trả về status không phải 0:", res.status);
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách feedback:", error);
      alert("Không thể tải danh sách feedback. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Lấy chi tiết feedback khi click
  const handleViewDetail = async (feedbackId) => {
    if (!feedbackId) {
      console.warn("⚠️ feedbackId không hợp lệ");
      return;
    }

    try {
      setDetailLoading(true);
      setSelectedFeedback(null); // Reset trước khi load
      const res = await getFeedbackDetail(feedbackId);
      if (res.status === 0) {
        setSelectedFeedback(res.data);
        setIsModalOpen(true);
      } else {
        console.error("❌ API trả về status không phải 0:", res.status);
        alert("Không thể tải chi tiết feedback!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết feedback:", error);
      alert("Không thể tải chi tiết feedback. Vui lòng thử lại!");
    } finally {
      setDetailLoading(false);
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [type]);

  // 🧭 Tìm kiếm theo tên người dùng (với fallback nếu không có user)
  const filteredFeedbacks = feedbacks.filter((fb) =>
    (fb.user?.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Phân trang
  const totalPages = Math.ceil(filteredFeedbacks.length / limit);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h2>📋 Feedback khách hàng</h2>

      {/* Bộ lọc + tìm kiếm */}
      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <div>
          <label htmlFor="type">Lọc theo loại: </label>
          <select
            id="type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            style={{ marginLeft: 8 }}
          >
            <option value="">Tất cả</option>
            <option value="bug">Báo lỗi</option>
            <option value="suggestion">Góp ý</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Tìm theo tên người dùng..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: "4px 8px",
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <p>⏳ Đang tải dữ liệu...</p>
      ) : paginatedFeedbacks.length === 0 ? (
        <p>Không có feedback nào.</p>
      ) : (
        // ✅ Thêm vùng scroll
        <div
          style={{
            maxHeight: "450px",
            overflowY: "auto",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: "8px 12px",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {paginatedFeedbacks.map((fb) => (
              <li
                key={fb.feedbackId}
                onClick={() => !detailLoading && handleViewDetail(fb.feedbackId)}
                style={{
                  padding: 12,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  marginBottom: 8,
                  cursor: detailLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: detailLoading ? 0.7 : 1,
                  backgroundColor: detailLoading ? "#f5f5f5" : "white",
                }}
                onMouseEnter={(e) =>
                  !detailLoading && (e.currentTarget.style.background = "#f7faff")
                }
                onMouseLeave={(e) =>
                  !detailLoading && (e.currentTarget.style.background = "white")
                }
              >
                <strong>{fb.user?.fullName || "N/A"}</strong>
                <br />
                <b>Loại:</b>{" "}
                {fb.type === "BUG"
                  ? "Báo lỗi"
                  : fb.type === "SUGGESTION"
                  ? "Góp ý"
                  : fb.type || "N/A"}
                <br />
                <b>Nội dung:</b> {fb.content || "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{ marginRight: 8 }}
          >
            ⬅ Trước
          </button>
          <span>
            Trang {page}/{totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{ marginLeft: 8 }}
          >
            Sau ➡
          </button>
        </div>
      )}

      {/* Modal chi tiết feedback */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)", // Tăng độ tối để nổi bật hơn
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
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)", // Tăng shadow để popup rõ hơn
              position: "relative",
              transform: "scale(1)", // Có thể thêm animation nếu cần
              transition: "transform 0.2s ease-in-out",
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

            <h3 style={{ marginBottom: 16, color: "#333" }}>📝 Chi tiết Feedback</h3>
            
            {detailLoading ? (
              <p style={{ textAlign: "center", color: "#666" }}>⏳ Đang tải chi tiết...</p>
            ) : selectedFeedback ? (
              <div style={{ lineHeight: 1.6 }}>
                <p><strong>Người gửi:</strong> {selectedFeedback.user?.fullName || "N/A"}</p>
                <p><strong>Email:</strong> {selectedFeedback.user?.username || "N/A"}</p>
                <p>
                  <strong>Loại:</strong>{" "}
                  {selectedFeedback.type === "BUG"
                    ? "Báo lỗi"
                    : selectedFeedback.type === "SUGGESTION"
                    ? "Góp ý"
                    : selectedFeedback.type || "N/A"}
                </p>
                <p>
                  <strong>Nội dung:</strong> {selectedFeedback.content || "N/A"}
                </p>
                {selectedFeedback.createdAt && (
                  <p><strong>Ngày gửi:</strong> {new Date(selectedFeedback.createdAt).toLocaleDateString('vi-VN')}</p>
                )}
                {selectedFeedback.imageUrl && (
                  <div style={{ marginTop: 16 }}>
                    <img
                      src={selectedFeedback.imageUrl}
                      alt="feedback"
                      style={{
                        width: "100%",
                        maxHeight: 300,
                        borderRadius: 8,
                        objectFit: "cover",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#ff0000" }}>Không tải được thông tin. Vui lòng thử lại!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}