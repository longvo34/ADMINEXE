import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Accounts", path: "/accounts" },
    { name: "Feedback", path: "/feedback" },
    { name: "Transactions", path: "/transactions" },
    { name: "Chat", path: "/chat" },
  ];

  return (
    <aside className="sidebar">
      <h3>Admin Menu</h3>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
