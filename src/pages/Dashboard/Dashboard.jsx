import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  useEffect(() => {
    if (!adminInfo) {
      navigate("/"); // điều hướng về trang login
    }
  }, [adminInfo, navigate]);

  if (!adminInfo) return null; // tránh render phần còn lại khi chưa có thông tin

  return (
    <div style={{ padding: "20px" }}>
      <h2>👤 Thông tin Admin</h2>
      <p><strong>Username:</strong> {adminInfo.username}</p>
      <p><strong>Họ tên:</strong> {adminInfo.fullName}</p>
      <p><strong>Ngày sinh:</strong> {adminInfo.dateOfBirth}</p>
      <p><strong>Ngày tạo:</strong> {new Date(adminInfo.createdAt).toLocaleString()}</p>

      <button
        onClick={() => {
          localStorage.removeItem("adminInfo");
          navigate("/");
        }}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
