import { useState, } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { SquaresFour, CalendarDots, UsersThree, Trophy, Images, HandHeart, Question, SignOut } from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import "./Sidebar.css";

/* Sidebar Component
--------------
Sidebar is a functional component that renders a navigation sidebar. It uses the user's role to determine which navigation items to display. The component also manages the state of the active tab and provides a function to handle tab clicks. only visible on the dashboard which is for admins and judges */
const setRole = localStorage.setItem("role", "admin"); // Set role to "admin" for testing purposes. Change to "judge" or remove for regular user.
const role = localStorage.getItem("role");


const icons = {
    dashboard: <SquaresFour size={24} />,
    events: <CalendarDots size={24} />,
    participants: <UsersThree size={24} />,
    leaderboard: <Trophy size={24} />,
    gallery: <Images size={24} />,
    donations: <HandHeart size={24} />
};

/* 
Navigation Tabs 
-----------------
navTabs will store the navigation items, Rendering them based on the user's role.
admin -> Dashboard, Events, Participants, Leaderboard, Gallery, Donations
judge -> Dashboard, Events
*/
const navTabs = [
    ...(role === "admin"
        ? [
            { name: "Dashboard", path: "admin/dashboard", icon: icons.dashboard },
            { name: "Events", path: "admin/events", icon: icons.events },
            { name: "Participants", path: "admin/participants", icon: icons.participants },
            { name: "Leaderboard", path: "admin/leaderboard", icon: icons.leaderboard },
            { name: "Gallery", path: "admin/gallery", icon: icons.gallery },
            { name: "Donations", path: "admin/donations", icon: icons.donations }
        ]
        : []),
    ...(role === "judge"
        ? [
            { name: "Dashboard", path: "judge/dashboard", icon: icons.dashboard },
            { name: "Events", path: "judge/events", icon: icons.events }
        ]
        : [])
];



function Sidebar() {
    const [activeTab, setActiveTab] = useState(navTabs[0].name);
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <aside className="sidebar-container flex flex-col justify-between w-56 h-screen px-[14px] py-6 bg-white ">
            <div className="flex flex-col ">
                <Link to="/" className="sidebar-logo">
                    SheIs<span className="sidebar-logo-accent">Design</span>
                </Link>
                <div className="w-[187px]">
                    <nav className="sidebar-nav flex flex-col mt-6">
                        {navTabs.map((tab) => {
                            const isActive = activeTab === tab.name;
                            return (
                                <button
                                    key={tab.name}
                                    to={tab.path}
                                    className={`sidebar-nav-item ${activeTab === tab.name ? "active" : ""} w-full flex items-center gap-3  py-[10px] px-3 text-white text-sm hover:bg-gray-100 hover:text-gray-200 active:text-white active:font-semibold rounded-[10px] mb-[2px] border-none  transition-colors duration-200 font-[DM Sans]`}
                                    onClick={() => {
                                        setActiveTab(tab.name);
                                        navigate(`/${tab.path}`);
                                    }}
                                    style={{
                                        background: isActive ? "#FE4081" : "transparent",
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                >
                                    <span className="sidebar-nav-icon">{tab.icon}</span>
                                    <span className="sidebar-nav-label">{tab.name}</span>
                                </button>
                            )
                        })
                        }
                    </nav>
                </div>
            </div>
            <div className="sidebar-footer w-[187px]">
                <div className="w-[180px] h-[1px] bg-[#E2E2E2]/40 my-4 mx-1"></div>
                <div className="sidebar-footer-nav flex flex-col mt-6">
                    <button className="w-full flex items-center gap-2  py-[10px] px-3 text-[#888] text-sm font-medium mb-3 rounded-[10px] border-none hover:bg-gray-100/20 hover:text-gray-200 transition-colors duration-200 font-[DM Sans]">
                        <Question size={24} />
                        Help & Docs
                    </button>
                    <button
                        className="sidebar-logout-btn w-full flex items-center gap-2 py-[10px] px-3 mb-[2px] text-sm text-red-600 font-medium hover:bg-gray-100/20 rounded-lg transition-colors duration-200 font-[DM Sans]"
                        onClick={() => handleLogout()}>
                        <SignOut size={24} />
                        Log out
                    </button>
                </div>
            </div>
        </aside>
    );

}

export default Sidebar;