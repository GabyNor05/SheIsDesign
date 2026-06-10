import { Link, useNavigate } from "react-router-dom";
import {
    SquaresFour, CalendarDots, UsersThree, Trophy,
    Images, HandHeart, SignOut, ArrowsOutSimple
} from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import "./Sidebar.css";

const ALL_TABS = {
    admin: [
        { name: "Dashboard",    icon: <SquaresFour size={20} />  },
        { name: "Events",       icon: <CalendarDots size={20} /> },
        { name: "Participants", icon: <UsersThree size={20} />   },
        { name: "Leaderboard",  icon: <Trophy size={20} />       },
        // { name: "Gallery",      icon: <Images size={20} />       },
        { name: "Donations",    icon: <HandHeart size={20} />    },
    ],
    judge: [
        { name: "Dashboard", icon: <SquaresFour size={20} />  },
        { name: "Events",    icon: <CalendarDots size={20} /> },
    ],
};

function Sidebar({ activeTab, setActiveTab }) {
    const navigate         = useNavigate();
    const { logout, user } = useAuth();

    // Read role from localStorage (same as original working code),
    // fall back to user object if available
    const rawRole = localStorage.getItem("role")
        || user?.role
        || user?.Role
        || "";
    const role = String(rawRole).toLowerCase().trim();

    const navTabs = ALL_TABS[role] ?? ALL_TABS.admin; // default to admin tabs if role matches

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <aside className="sidebar-container">
            <div className="sidebar-top">
                <Link to="/" className="sidebar-logo">
                    SheIs<span className="sidebar-logo-accent">Design</span>
                </Link>

                <nav className="sidebar-nav">
                    {navTabs.map((tab) => {
                        const isActive = activeTab === tab.name;
                        return (
                            <button
                                key={tab.name}
                                className={`sidebar-nav-item${isActive ? " active" : ""}`}
                                onClick={() => setActiveTab(tab.name)}
                            >
                                <span className="sidebar-nav-icon">{tab.icon}</span>
                                <span className="sidebar-nav-label">{tab.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-footer__divider" />
                <button
                    className="sidebar-nav-item"
                    onClick={() => navigate("/")}
                >
                    <span className="sidebar-nav-icon"><ArrowsOutSimple size={20} /></span>
                    <span className="sidebar-nav-label">View Main Site</span>
                </button>
                <button className="sidebar-logout-btn" onClick={handleLogout}>
                    <span className="sidebar-nav-icon"><SignOut size={20} /></span>
                    <span className="sidebar-nav-label">Log out</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;