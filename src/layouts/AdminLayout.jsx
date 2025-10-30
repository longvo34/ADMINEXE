import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/global.css";

export default function AdminLayout() {
  return (
    <div className='admin-layout'>
      <Sidebar />
      <div className='main-content'>
        <Header />
        <div className='page-content'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}