import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../../components/common/Sidebar";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (path) => {
    if (path === "/admin" || path === "/admin/") return "Dashboard";
    if (path.startsWith("/admin/events"))        return "Events";
    if (path.startsWith("/admin/participants"))   return "Participants";
    if (path.startsWith("/admin/leaderboard"))    return "Leaderboard";
    if (path.startsWith("/admin/gallery"))        return "Gallery";
    if (path.startsWith("/admin/donations"))      return "Donations";
    return "Dashboard";
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  function handleTabChange(tab) {
    setActiveTab(tab);
    const routes = {
      Dashboard:    "/admin",
      Events:       "/admin/events",
      Participants: "/admin/participants",
      Leaderboard:  "/admin/leaderboard",
      Gallery:      "/admin/gallery",
      Donations:    "/admin/donations",
    };
    if (routes[tab]) navigate(routes[tab]);
  }

  return (
    <div className="admin-layout">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div className="admin-layout__content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;