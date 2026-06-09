/* The purpose of the Sidebar has changed instead of navigating to a different page it just storing what the active tab is so that the AdminDashboard knows what to render. The Sidebar will now act as a control panel for the AdminDashboard, managing the state of the active tab and providing a way for the user to switch between different sections of the dashboard. */
import { Link, useNavigate } from "react-router-dom";
import { SquaresFour, CalendarDots, UsersThree, Trophy, Images, HandHeart, Question, SignOut, ArrowsOutSimple } from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import "./Sidebar.css";

/* Sidebar Component
--------------
Sidebar is a functional component that renders a navigation sidebar. It uses the user's role to determine which navigation items to display. The component also manages the state of the active tab and provides a function to handle tab clicks. only visible on the dashboard which is for admins and judges */
// Set role to "admin" for testing purposes. Change to "judge" or remove for regular user.
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
            { name: "Dashboard", icon: icons.dashboard },
            { name: "Events", icon: icons.events },
            { name: "Participants", icon: icons.participants },
            { name: "Leaderboard", icon: icons.leaderboard },
            { name: "Gallery", icon: icons.gallery },
            { name: "Donations", icon: icons.donations }
        ]
        : []),
    ...(role === "judge"
        ? [
            { name: "Dashboard", icon: icons.dashboard },
            { name: "Events", icon: icons.events }
        ]
        : [])
];



function Sidebar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
 function handleReturnToSite(){
        navigate("/");
 }
    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <aside className="sidebar-container flex flex-col justify-between w-56 h-screen px-[14px] py-6 bg-white ">
            <div className="flex flex-col ">
                <Link to="/" className="sidebar-logo" alt="Navigate to Home">
                    SheIs<span className="sidebar-logo-accent">Design</span>
                </Link>
                <div className="w-[187px]">
                    <nav className="sidebar-nav flex flex-col mt-6">
                        {navTabs.map((tab) => {
                            const isActive = activeTab === tab.name;
                            return (
                                <button
                                    key={tab.name}
                                    className={`sidebar-nav-item ${isActive ? "active" : ""} w-full flex items-center gap-3  py-[10px] px-3 text-white text-sm hover:bg-gray-100 hover:text-gray-200 active:text-white active:font-semibold rounded-[10px] mb-[2px] border-none  transition-colors duration-200 font-[DM Sans]`}
                                    onClick={() => setActiveTab(tab.name)}
                                    style={{
                                        background: isActive ? "#FE4081" : "transparent",
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                >
                                    <span className="sidebar-nav-icon">{tab.icon}</span>
                                    <span className="sidebar-nav-label">{tab.name}</span>
                                </button>
                            )
                        })}
                    </nav>
                </div>
            </div>
            <div className="sidebar-footer w-[187px]">
                <div className="w-[180px] h-[1px] bg-[#E2E2E2]/40 my-4 mx-1"></div>
                <div className="sidebar-footer-nav flex flex-col mt-6">
                    <button  /* onclick={handleReturnToSite()} */ className="w-full flex items-center gap-2  py-[10px] px-3 text-[#888] text-sm font-medium mb-3 rounded-[10px] hover:bg-gray-100/20 hover:text-gray-200 transition-colors duration-200 font-[DM Sans]">
                        <ArrowsOutSimple size={24} />
                        View Main Site
                    </button>
                    <button
                        className="sidebar-logout-btn w-full flex items-center gap-2 py-[10px] px-3 mb-[2px] text-sm text-red-600 font-medium hover:bg-gray-100/20 rounded-lg transition-colors duration-200 font-[DM Sans]"
                        onClick={handleLogout}>
                        <SignOut size={24} />
                        Log out
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;