import { User, CalendarDots, Paperclip, HandHeart, ClockClockwise } from "@phosphor-icons/react";
import Section from "./Section";

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

const ACTIVITY_ICONS = {
  participant: <User size = {14} />, event: <CalendarDots size = {14} />, submission: <Paperclip size = {14} />, donation: <HandHeart size = {14} />,
};

const RECENT_ACTIVITY = [
  { id: 1, type: "participant", title: "New student registered",  detail: "Amara Dlamini — University of Johannesburg", time: "2 min ago" },
  { id: 2, type: "event",       title: "Event created",           detail: "Global Sandbox Design Challenge 2025",        time: "41 min ago" },
  { id: 3, type: "submission",  title: "Submission uploaded",     detail: "Lilli Brown — Spring Campaign",               time: "1h 30m ago" },
  { id: 4, type: "donation",    title: "Donation received",       detail: "Anonymous — R 2,500",                         time: "3h ago" },
  { id: 5, type: "participant", title: "Student account approved",detail: "Tara Khumalo — WITS University",              time: "4h ago" },
  { id: 6, type: "event",       title: "Event updated",           detail: "Motion Design Bootcamp — dates revised",      time: "5h ago" },
];


function ActivityRow({ item, isLast }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "13px 0",
      borderBottom: isLast ? "none" : `1px solid ${T.border}`,
    }}>
      <div
        aria-hidden="true"
        style={{
          width: 36, height: 36, borderRadius: "50%", background: T.surfaceHi,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, flexShrink: 0,
        }}
      >
        {ACTIVITY_ICONS[item.type]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: T.textPrimary }}>
          {item.title}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: T.textSecond, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.detail}
        </div>
      </div>
      <time style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, flexShrink: 0 }}>
        {item.time}
      </time>
    </div>
  );
}

function RecentActivity(){
  return (
    <Section icon= <ClockClockwise size = {24} /> title="Recent Activity">
        {RECENT_ACTIVITY.map((item, i) => (
          <ActivityRow key={item.id} item={item} isLast={i === RECENT_ACTIVITY.length - 1} />
        ))}
      </Section>
  );
}

export default RecentActivity;