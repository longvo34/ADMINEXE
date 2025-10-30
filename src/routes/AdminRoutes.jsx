import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/Login/AdminLogin";
import Dashboard from "../pages/Dashboard/Dashboard";
import AccountList from "../pages/Accounts/AccountList";
import FeedbackPage from "../pages/Feedback/FeedbackPage";
import TransactionPage from "../pages/Transactions/TransactionPage";
import ChatList from "../pages/Chat/ChatList";
import ChatDetail from "../pages/Chat/ChatDetail";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* ✅ Trang Login không dùng layout */}
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ✅ Các trang trong Admin dùng layout */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<AccountList />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/chat/:id" element={<ChatDetail />} />
      </Route>
    </Routes>
  );
}
