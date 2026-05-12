import {useState} from "react";
import {T} from "../../components/admin/theme";

import Stats from "../../components/admin/overview/Stats";
import QuickActions from "../../components/admin/overview/QuickActions";
import UpcomingEvents from "../../components/admin/overview/UpcomingEvents";
import RecentActivity from "../../components/admin/overview/RecentActivity";
import PendingApplicattions from "../../components/admin/overview/PendingApplications";



const STATUS_BADGE = "System Online";
const DAY_LABEL = "Wednesday, September 3, 2025";


function Overview({ setActiveTab }) {
    const [modal, setModal] = useState(null);
    return (
        <div className="flex flex-col gap-8 px-20 w-full font-poppins">
            <div className="flex flex-row justify-between items-baseline font-poppins ">
                <div className="flex flex-col text-left">
                    <h2 className="text-[40px] font-bold mb-1">Overview</h2>
                    <p className="text-sm text-[#A0A0A0]">Manage events, participants, and competitions.</p>
                </div>
                <div className="flex flex-col justify-left items-end gap-2">
                    <h3 className="text-[12px]  mb-1" style={{ color: T.textSecond }}>{DAY_LABEL}</h3>
                    <span className="rounded-[20px] w-fit" style={{
                        background: T.activeBg, color: T.activeGreen, borderRadius: 20,
                        padding: "4px 12px", fontSize: 12, fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6,
                    }} role="status">
                        <span aria-hidden="true" className="rounded-full w-2 h-2" style={{ background: T.activeGreen, display: "inline-block" }} />
                        {STATUS_BADGE}
                    </span>
                </div>
            </div>
            
                <QuickActions setActiveTab={setActiveTab} />
                <UpcomingEvents />
                <div style= {{ display: "flex", flex: "1 0 0", gap: 24}}>
                    <PendingApplicattions />
                <RecentActivity />
                </div>
                <Stats />

        </div>
    );
}

export default Overview;