import { CalendarDots, Calendar, Plus, Pencil, Trash } from "@phosphor-icons/react";

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

const EVENTS = [
    { id: 1, name: "Brand Identity Challenge", date: "12 Mar 2026", participants: 84, status: "ACTIVE" },
    { id: 2, name: "Motion Design Bootcamp", date: "20 Mar 2026", participants: 41, status: "UPCOMING" },
    { id: 3, name: "UI/UX Hackathon 2026", date: "5 Apr 2026", participants: 122, status: "UPCOMING" },
    { id: 4, name: "Typography Sprint", date: "18 Apr 2026", participants: 28, status: "DRAFT" },
    { id: 5, name: "Illustration Open Brief", date: "2 May 2026", participants: 87, status: "UPCOMING" },
    { id: 6, name: "Annual Design Awards 2025", date: "14 Oct 2025", participants: 203, status: "CLOSED" },
];

const STATUS_MAP = {
    ACTIVE: { bg: "#10e26633", color: T.activeGreen, dot: T.activeGreen },
    UPCOMING: { bg: T.upBg, color: T.upBlue, dot: T.upBlue },
    DRAFT: { bg: T.draftBg, color: T.draftGray, dot: T.draftGray },
    CLOSED: { bg: T.closedBg, color: T.closedRed, dot: T.closedRed },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.DRAFT;
  return (
    <span
      role="status"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: s.bg, color: s.color, borderRadius: 20,
        padding: "4px 10px", fontSize: 11.5, fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em",
      }}
    >
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function EventsTable() {
    const cols = ["EVENT NAME", "DATE", "PARTICIPANTS", "STATUS", "ACTIONS"];
    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Upcoming events">
                <thead>
                    <tr>
                        {cols.map(c => (
                            <th key={c} scope="col" style={{
                                textAlign: c === "PARTICIPANTS" ? "center" : "left",
                                padding: "10px 14px",
                                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                                fontWeight: 700, color: T.textSecond, letterSpacing: "0.1em",
                                borderBottom: `1px solid ${T.border}`, whiteSpace: "nowrap",
                            }}>
                                {c}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {EVENTS.map((ev, i) => (
                        <tr key={ev.id} style={{ borderBottom: i < EVENTS.length - 1 ? `1px solid ${T.border}` : "none", transition: "background 0.12s" }}
                            onMouseEnter={e => e.currentTarget.style.background = T.surfaceHi}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                            <td style={{ padding: "14px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textPrimary, fontWeight: 500 }}>
                                {ev.name}
                            </td>
                            <td style={{ padding: "14px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textSecond, whiteSpace: "nowrap" }}>
                                {ev.date}
                            </td>
                            <td style={{ padding: "14px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textSecond, textAlign: "center" }}>
                                {ev.participants}
                            </td>
                            <td style={{ padding: "14px 14px" }}>
                                <StatusBadge status={ev.status} />
                            </td>
                            <td style={{ padding: "14px 14px" }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <button
                                        aria-label={`Edit ${ev.name}`}
                                        style={{ background: T.surfaceHi, border: "none", cursor: "pointer", color: T.textSecond, padding: "6px 8px", borderRadius: 6, display: "flex", transition: "all 0.15s" }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "#333"; e.currentTarget.style.color = T.textPrimary; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textSecond; }}
                                        onFocus={e => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; }}
                                        onBlur={e => { e.currentTarget.style.boxShadow = "none"; }}
                                    >
                                        <Pencil size={14} color="currentColor" />
                                    </button>
                                    <button
                                        aria-label={`Delete ${ev.name}`}
                                        style={{ background: T.surfaceHi, border: "none", cursor: "pointer", color: T.textSecond, padding: "6px 8px", borderRadius: 6, display: "flex", transition: "all 0.15s" }}
                                        onMouseEnter={e => { e.currentTarget.style.background = T.closedBg; e.currentTarget.style.color = T.closedRed; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textSecond; }}
                                        onFocus={e => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.closedRed}`; }}
                                        onBlur={e => { e.currentTarget.style.boxShadow = "none"; }}
                                    >
                                        <Trash size={14} color="currentColor" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function UpcomingEvents() {
    return (
        <div className="w-full p-5 rounded-[14px]" style={{ background: T.surface }}>
            <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-row gap-4 items-center">
                    <CalendarDots size={24} />
                    <h2 className="text-[24px] font-bold ">Upcoming Events</h2>
                </div>
                <button 
                    style={{
                        display: "flex", alignItems: "center", gap: 7,
                        background: T.pink, border: "none", borderRadius: 8,
                        padding: "8px 16px", cursor: "pointer", color: "#fff",
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                        transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    onFocus={e => { e.currentTarget.style.boxShadow = `0 0 0 2px #fff, 0 0 0 4px ${T.pink}`; }}
                    onBlur={e => { e.currentTarget.style.boxShadow = "none"; }}
                >
                    <Plus size={13} color="#fff" />
                    New Event
                </button>
            </div>
            <EventsTable />
        </div>
    );
}

export default UpcomingEvents;