import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Overview from "./Overview";
import Events from "./ManageEvents";
import Leaderboard from "./Leaderboard";

/* The structure for this component is a flex container with a sidebar and main content area:
Each page content will be an imported component, in this folder. It must check what tab.name is being recieved from the sideboard to decided what mainContent is being rendered*/

function renderContent(activeTab, setActiveTab) {
    switch (activeTab) {
        case "Dashboard":
            return <Overview setActiveTab={setActiveTab} />;
        case "Events":
            return <Events />;
        case "Leaderboard":
            return <Leaderboard />;
        default:
            return <Overview setActiveTab={setActiveTab} />;
    }
}


function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");
    const navigate = useNavigate();

    return (
    <div className="admin-dashboard flex bg-[#0D0D0D] text-[#F0F0F0] min-h-screen">

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="admin-content flex-1 ml-[220px] ">
                {/* Breadcrumb */}
                <div className="breadcrumb ml-12 py-4">
                    <button className="text-[#A0A0A0]" onClick={() => navigate("/")}>
                        Home
                    </button> / <span className="text-[#F0F0F0] text-xl font-medium">{activeTab}</span>
                </div>
                {renderContent(activeTab, setActiveTab)}
            </div>
        

    </div>
    );
 } 
    
export default AdminDashboard;
