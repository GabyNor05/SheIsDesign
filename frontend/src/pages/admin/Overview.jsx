import Stats from "../../components/admin/overview/Stats";
import QuickActions from "../../components/admin/overview/QuickActions";
import UpcomingEvents from "../../components/admin/overview/UpcomingEvents";

const T = {
    // Backgrounds
    bg: "#0D0D0D",   // page background
    surface: "#1A1A1A",   // card / sidebar background
    surfaceHi: "#242424",   // elevated card, hover surface
    border: "#2E2E2E",   // subtle dividers
    // Brand
    pink: "#FF2D78",   // primary CTA / active state
    pinkDim: "#3D0F22",   // pink tint background (accessible)
    // Text — all WCAG AA on #1A1A1A
    textPrimary: "#F0F0F0",  // 15.3:1 on surface
    textSecond: "#A0A0A0",  // 5.9:1 on surface — AA large
    textMuted: "#6B6B6B",  // decorative only
    // Status
    activeGreen: "#22C55E",
    activeBg: "#052512",
    upBlue: "#60A5FA",
    upBg: "#0A1628",
    draftGray: "#A0A0A0",
    draftBg: "#222222",
    closedRed: "#F87171",
    closedBg: "#200B0B",
};

const STATUS_BADGE = "System Online";
const DAY_LABEL = "Wednesday, September 3, 2025";

const STATS = [
    { id: 1, value: "1,247", label: "Total Participants", sub: "↑ 12% this month", icon: "👥" },
    { id: 2, value: "5", label: "Upcoming Events", sub: "Next: 14 Sep 2025", icon: "📅" },
    { id: 3, value: "3,840", label: "Total Submissions", sub: "↑ 8% this week", icon: "📎" },
    { id: 4, value: "R 48k", label: "Total Donations", sub: "↑ 14% all-time", icon: "💝" },
];



const STATUS_MAP = {
    ACTIVE: { bg: "#10e26633", color: T.activeGreen, dot: T.activeGreen },
    UPCOMING: { bg: T.upBg, color: T.upBlue, dot: T.upBlue },
    DRAFT: { bg: T.draftBg, color: T.draftGray, dot: T.draftGray },
    CLOSED: { bg: T.closedBg, color: T.closedRed, dot: T.closedRed },
};

const ACTIVITY_ICONS = {
    participant: "👤", event: "📅", submission: "📎", donation: "💝",
};



function Overview() {
    return (
        <div className="flex flex-col gap-12 px-20">
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
            
                <Stats />
                <QuickActions />
                <UpcomingEvents />

        </div>
    );
}

export default Overview;