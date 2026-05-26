import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../../components/common/Sidebar";
import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sync active tab from current URL
  const getTabFromPath = (path) => {
    if (path === "/admin-v2" || path === "/admin-v2/") return "Dashboard";
    if (path.startsWith("/admin-v2/events"))       return "Events";
    if (path.startsWith("/admin-v2/participants"))  return "Participants";
    if (path.startsWith("/admin-v2/leaderboard"))   return "Leaderboard";
    if (path.startsWith("/admin-v2/gallery"))       return "Gallery";
    if (path.startsWith("/admin-v2/donations"))     return "Donations";
    return "Dashboard";
  };

  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  function handleTabChange(tab) {
    setActiveTab(tab);
    const routes = {
      Dashboard:    "/admin-v2",
      Events:       "/admin-v2/events",
      Participants: "/admin-v2/participants",
      Leaderboard:  "/admin-v2/leaderboard",
      Gallery:      "/admin-v2/gallery",
      Donations:    "/admin-v2/donations",
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