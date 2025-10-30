import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/authService";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await loginAdmin(username, password);

    if (res.status === 200 && res.data) {
      // ✅ Lưu thông tin admin
      localStorage.setItem("adminInfo", JSON.stringify(res.data));

      alert("Đăng nhập thành công!");
      navigate("/dashboard");
    } else {
      alert(res.message || "Sai thông tin đăng nhập!");
    }
  } catch (err) {
    alert(err.message || "Đăng nhập thất bại!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-container" style={{ textAlign: "center", marginTop: 100 }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} style={{ display: "inline-block", textAlign: "left" }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: 250 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, width: 250 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 8,
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
