import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg:           "#0D0D0D",
  surface:      "#1A1A1A",
  surfaceHi:    "#242424",
  surfaceBord:  "#2A2A2A",
  border:       "#2E2E2E",
  borderHi:     "#3A3A3A",
  pink:         "#FF2D78",
  pinkDim:      "#3D0F22",
  pinkGlow:     "rgba(255,45,120,0.15)",
  textPrimary:  "#F0F0F0",
  textSecond:   "#A0A0A0",
  textMuted:    "#6B6B6B",
  activeGreen:  "#22C55E",
  activeBg:     "#052512",
  upBlue:       "#60A5FA",
  upBg:         "#0A1628",
  draftGray:    "#A0A0A0",
  draftBg:      "#222222",
  closedRed:    "#F87171",
  closedBg:     "#200B0B",
  amber:        "#FBBF24",
  amberBg:      "#1C1200",
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — all data lives here
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_NAME  = "Admin";
const ADMIN_EMAIL = "admin@sheisdesign.co.za";
const TODAY       = "Monday, 4 May 2025";
const PAGE_TITLE  = "Overview";
const PAGE_SUB    = "Manage events, participants, and competitions.";

const QUICK_ACTIONS = [
  { id: 1, icon: "plus",   label: "Create Event"        },
  { id: 2, icon: "file",   label: "Review Applications" },
  { id: 3, icon: "award",  label: "Invite Judge"        },
  { id: 4, icon: "chart",  label: "View Leaderboard"    },
];

const UPCOMING_EVENTS = [
  { id: "evt-001", title: "Brand Identity Challenge", category: "BRAND IDENTITY", status: "OPEN",   dateRange: "1–12 Mar 2026",  entries: 84,  maxEntries: 100 },
  { id: "evt-002", title: "Motion Design Bootcamp",   category: "MOTION DESIGN",  status: "OPEN",   dateRange: "10–20 Mar 2026", entries: 41,  maxEntries: 60  },
  { id: "evt-003", title: "UI/UX Hackathon 2026",     category: "UX DESIGN",      status: "OPEN",   dateRange: "1–5 Apr 2026",   entries: 112, maxEntries: 150 },
  { id: "evt-004", title: "Typography Sprint",        category: "GRAPHIC DESIGN", status: "UPCOMING",dateRange: "12–18 Apr 2026", entries: 29,  maxEntries: 60  },
];

const PENDING_STUDENTS = [
  { id: 1, initials: "AD", name: "Amara Diailo",   uni: "Wits University",         field: "Graphic Design",       date: "2 May 2026",   color: "#FF2D78" },
  { id: 2, initials: "SM", name: "Siya Mokoena",   uni: "CPUT",                    field: "UX Design",            date: "1 May 2026",   color: "#60A5FA" },
  { id: 3, initials: "ND", name: "Naledi Dlamini", uni: "University of Pretoria",  field: "Illustration",         date: "30 Apr 2026",  color: "#22C55E" },
  { id: 4, initials: "TK", name: "Thandi Khumalo", uni: "University of Cape Town", field: "Visual Communication", date: "28 Apr 2026",  color: "#FBBF24" },
];

const PENDING_PROFESSIONALS = [
  { id: 5, initials: "LN", name: "Lerato Nkosi",    uni: "Ogilvy SA",         field: "Creative Director", date: "30 Apr 2026",  color: "#a78bfa" },
  { id: 6, initials: "ZP", name: "Zoe Petersen",    uni: "FCB Africa",        field: "Art Direction",     date: "29 Apr 2026",  color: "#34d399" },
  { id: 7, initials: "MB", name: "Mpho Baloyi",     uni: "Freelance",         field: "Brand Strategy",    date: "27 Apr 2026",  color: "#f97316" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "participant", icon: "user",       title: "New student registered",   detail: "Amara Diailo · Wits University",         time: "2 min ago"  },
  { id: 2, type: "event",      icon: "calendar",   title: "Event created",            detail: "Brand Identity Challenge 2025",           time: "18 min ago" },
  { id: 3, type: "submission", icon: "file",       title: "Submission uploaded",      detail: "Laila Nkosi · Spring Campaign",           time: "34 min ago" },
  { id: 4, type: "donation",   icon: "heart",      title: "Donation received",        detail: "R 2,500 · Anonymous Donor",               time: "1h ago"     },
  { id: 5, type: "participant",icon: "check",      title: "Student account approved", detail: "Zoë Petersen · UCT",                      time: "2h ago"     },
  { id: 6, type: "event",      icon: "edit",       title: "Event updated",            detail: "Motion Design Bootcamp — date moved",     time: "3h ago"     },
];

const PLATFORM_SUMMARY = [
  { icon: "graduation", label: "Total Students",     value: "1,024" },
  { icon: "briefcase",  label: "Total Professionals",value: "223"   },
  { icon: "calendar",   label: "Active Events",      value: "5"     },
  { icon: "file",       label: "Total Submissions",  value: "3,840" },
];

const STATUS_STYLE = {
  OPEN:     { bg: T.activeBg, color: T.activeGreen, dot: T.activeGreen },
  UPCOMING: { bg: T.upBg,     color: T.upBlue,      dot: T.upBlue      },
  DRAFT:    { bg: T.draftBg,  color: T.draftGray,   dot: T.draftGray   },
  CLOSED:   { bg: T.closedBg, color: T.closedRed,   dot: T.closedRed   },
};

const ACTIVITY_TYPE_STYLE = {
  participant: { bg: T.pinkDim,   color: T.pink        },
  event:       { bg: T.upBg,      color: T.upBlue      },
  submission:  { bg: "#161A0E",   color: T.amber       },
  donation:    { bg: "#200B14",   color: "#f472b6"     },
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function Icon({ name, size = 16, color = "currentColor" }) {
  const icons = {
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    file:       <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    award:      <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    chart:      <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    calendar:   <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    users:      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    bell:       <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    logout:     <><path d="M9 21H5a2 2 0 0 0-2-2V5a2 2 0 0 0 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    check:      <polyline points="20 6 9 17 4 12"/>,
    x:          <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    user:       <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    heart:      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    edit:       <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    graduation: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    briefcase:  <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12"/></>,
    grid:       <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    arrow:      <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.DRAFT;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}30`,
      borderRadius: 20, padding: "3px 9px",
      fontSize: 10.5, fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.08em",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function SectionHeader({ icon, title, badge, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && (
          <div style={{ width: 30, height: 30, borderRadius: 8, background: T.surfaceHi, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={icon} size={15} color={T.textSecond} />
          </div>
        )}
        <h2 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: T.textPrimary }}>
          {title}
        </h2>
        {badge !== undefined && (
          <span style={{
            background: T.pink, color: "#fff", borderRadius: 20,
            padding: "2px 9px", fontSize: 11, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {badge}
          </span>
        )}
      </div>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
          color: T.pink, display: "flex", alignItems: "center", gap: 5,
          padding: "4px 8px", borderRadius: 6, transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.pinkDim}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          {action} <Icon name="arrow" size={12} color={T.pink} />
        </button>
      )}
    </div>
  );
}

function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: "20px 22px",
      transition: "border-color 0.2s",
      ...(glow ? { boxShadow: `0 0 0 1px ${T.pink}22` } : {}),
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
function Topbar() {
  return (
    <header style={{
      height: 58, background: T.surface, borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", flexShrink: 0, position: "sticky", top: 0, zIndex: 30,
    }}>
      <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 17, color: T.textPrimary }}>
        Shels<span style={{ color: T.pink }}>Design</span>
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button aria-label="Notifications" style={{ background: "none", border: "none", cursor: "pointer", color: T.textSecond, display: "flex", padding: 6, borderRadius: 8, position: "relative" }}>
          <Icon name="bell" size={18} color={T.textSecond} />
          <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: "50%", background: T.pink, border: `2px solid ${T.surface}` }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.pink}, #9B0A3C)`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "Syne, sans-serif" }}>A</span>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.textPrimary, lineHeight: 1.2 }}>{ADMIN_NAME}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textSecond }}>{ADMIN_EMAIL}</div>
          </div>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "6px 12px", cursor: "pointer", color: T.textSecond,
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.pink; e.currentTarget.style.color = T.pink; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecond; }}
        >
          <Icon name="logout" size={13} color="currentColor" /> Logout
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: PAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
      <div>
        <p style={{ margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 20, height: 1, background: T.textMuted, display: "inline-block" }} />
          Admin Dashboard
        </p>
        <h1 style={{ margin: "0 0 4px", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 34, color: T.textPrimary, letterSpacing: "-0.02em" }}>
          {PAGE_TITLE}
        </h1>
        <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSecond }}>{PAGE_SUB}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <time style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: T.textMuted }}>{TODAY}</time>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: T.activeBg, color: T.activeGreen,
          border: `1px solid ${T.activeGreen}30`,
          borderRadius: 20, padding: "4px 12px",
          fontSize: 11.5, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.activeGreen, animation: "pulse 2s ease-in-out infinite" }} />
          System Online
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: QUICK ACTIONS
// ─────────────────────────────────────────────────────────────────────────────
function QuickActions() {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
      {QUICK_ACTIONS.map((action, i) => (
        <button key={action.id} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: i === 0 ? T.pink : T.surface,
          border: `1px solid ${i === 0 ? T.pink : T.border}`,
          borderRadius: 10, padding: "10px 18px", cursor: "pointer",
          color: i === 0 ? "#fff" : T.textSecond,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 500,
          transition: "all 0.18s",
        }}
        onMouseEnter={e => {
          if (i !== 0) { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textPrimary; }
          else { e.currentTarget.style.opacity = "0.85"; }
        }}
        onMouseLeave={e => {
          if (i !== 0) { e.currentTarget.style.background = T.surface; e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecond; }
          else { e.currentTarget.style.opacity = "1"; }
        }}
        >
          <Icon name={action.icon} size={15} color={i === 0 ? "#fff" : T.textSecond} />
          {action.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: EVENT CARD (horizontal scroll)
// ─────────────────────────────────────────────────────────────────────────────
function EventCard({ event }) {
  const pct = Math.min(100, Math.round((event.entries / event.maxEntries) * 100));
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
      padding: "18px 20px", minWidth: 230, maxWidth: 260, flex: "0 0 240px",
      display: "flex", flexDirection: "column", gap: 12,
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "pointer",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = T.pink + "66"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14.5, color: T.textPrimary, marginBottom: 4, lineHeight: 1.3 }}>
            {event.title}
          </div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {event.category}
          </div>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.textMuted }}>
        <Icon name="calendar" size={12} color={T.textMuted} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textSecond }}>{event.dateRange}</span>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textMuted }}>Entries</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.textSecond }}>
            {event.entries} / {event.maxEntries}
          </span>
        </div>
        <div style={{ height: 5, background: T.surfaceBord, borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            width: `${pct}%`, height: "100%",
            background: pct > 80 ? T.pink : `linear-gradient(90deg, ${T.pink}88, ${T.pink})`,
            borderRadius: 3, transition: "width 0.5s ease",
          }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: UPCOMING EVENTS SECTION
// ─────────────────────────────────────────────────────────────────────────────
function UpcomingEventsSection() {
  const openCount = UPCOMING_EVENTS.filter(e => e.status === "OPEN").length;
  return (
    <Card style={{ padding: "20px 22px", marginBottom: 20 }}>
      <SectionHeader
        icon="calendar"
        title="Upcoming Events"
        badge={`${openCount} open`}
        action="View all"
      />
      <div style={{
        display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4,
        scrollbarWidth: "none",
      }}>
        {UPCOMING_EVENTS.map(ev => <EventCard key={ev.id} event={ev} />)}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: APPLICANT ROW
// ─────────────────────────────────────────────────────────────────────────────
function ApplicantRow({ person, isLast }) {
  const [status, setStatus] = useState(null); // null | "approved" | "denied"

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0",
      borderBottom: isLast ? "none" : `1px solid ${T.border}`,
      opacity: status ? 0.55 : 1, transition: "opacity 0.3s",
    }}>
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: person.color + "22",
        border: `1.5px solid ${person.color}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 12, color: person.color,
      }}>
        {person.initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: T.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {person.name}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textMuted }}>
          {person.uni} · {person.field}
        </div>
      </div>

      {/* Date */}
      <time style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textMuted, flexShrink: 0, marginRight: 6 }}>
        {person.date}
      </time>

      {/* Actions */}
      {status === null ? (
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => setStatus("approved")}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: T.activeBg, border: `1px solid ${T.activeGreen}44`,
              borderRadius: 7, padding: "6px 12px", cursor: "pointer",
              color: T.activeGreen, fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: 600, transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.activeGreen + "22"}
            onMouseLeave={e => e.currentTarget.style.background = T.activeBg}
          >
            <Icon name="check" size={12} color={T.activeGreen} /> Approve
          </button>
          <button
            onClick={() => setStatus("denied")}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: `1px solid ${T.border}`,
              borderRadius: 7, padding: "6px 12px", cursor: "pointer",
              color: T.textSecond, fontFamily: "'DM Sans', sans-serif",
              fontSize: 12, fontWeight: 500, transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.closedRed + "66"; e.currentTarget.style.color = T.closedRed; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecond; }}
          >
            <Icon name="x" size={12} color="currentColor" /> Deny
          </button>
        </div>
      ) : (
        <span style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
          color: status === "approved" ? T.activeGreen : T.closedRed,
          background: status === "approved" ? T.activeBg : T.closedBg,
          borderRadius: 7, padding: "6px 12px",
        }}>
          {status === "approved" ? "✓ Approved" : "✗ Denied"}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: PENDING APPLICATIONS
// ─────────────────────────────────────────────────────────────────────────────
function PendingApplications() {
  const [tab, setTab] = useState("students");
  const total = PENDING_STUDENTS.length + PENDING_PROFESSIONALS.length;
  const list  = tab === "students" ? PENDING_STUDENTS : PENDING_PROFESSIONALS;

  return (
    <Card>
      <SectionHeader
        icon="users"
        title="Pending Applications"
        badge={total}
        action="View all"
      />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `1px solid ${T.border}` }}>
        {[
          { key: "students",      label: "Students",             count: PENDING_STUDENTS.length },
          { key: "professionals", label: "Industry Professionals",count: PENDING_PROFESSIONALS.length },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "10px 16px 10px 0", marginRight: 20,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: tab === t.key ? 600 : 400,
            color: tab === t.key ? T.textPrimary : T.textSecond,
            borderBottom: `2px solid ${tab === t.key ? T.pink : "transparent"}`,
            transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7,
          }}>
            {t.label}
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: tab === t.key ? T.pink : T.surfaceHi,
              color: tab === t.key ? "#fff" : T.textMuted,
              borderRadius: 20, padding: "1px 7px",
              transition: "all 0.15s",
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {list.map((person, i) => (
        <ApplicantRow key={person.id} person={person} isLast={i === list.length - 1} />
      ))}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: ACTIVITY ITEM
// ─────────────────────────────────────────────────────────────────────────────
function ActivityItem({ item, isLast }) {
  const style = ACTIVITY_TYPE_STYLE[item.type] || ACTIVITY_TYPE_STYLE.event;
  return (
    <div style={{
      display: "flex", gap: 12, padding: "12px 0",
      borderBottom: isLast ? "none" : `1px solid ${T.border}`,
      alignItems: "flex-start",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: style.bg, border: `1px solid ${style.color}33`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={item.icon} size={13} color={style.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 2 }}>
          {item.title}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.detail}
        </div>
      </div>
      <time style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, flexShrink: 0, paddingTop: 2, whiteSpace: "nowrap" }}>
        {item.time}
      </time>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: RECENT ACTIVITY
// ─────────────────────────────────────────────────────────────────────────────
function RecentActivity() {
  return (
    <Card>
      <SectionHeader icon="bell" title="Recent Activity" action="View all" />
      {RECENT_ACTIVITY.map((item, i) => (
        <ActivityItem key={item.id} item={item} isLast={i === RECENT_ACTIVITY.length - 1} />
      ))}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: PLATFORM SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
function PlatformSummary() {
  return (
    <div>
      <p style={{
        margin: "0 0 14px", fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase",
        color: T.textMuted,
      }}>
        Platform Summary
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {PLATFORM_SUMMARY.map(stat => (
          <div key={stat.label} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 14, padding: "18px 20px",
            display: "flex", alignItems: "flex-start", gap: 14,
            transition: "border-color 0.2s, transform 0.2s",
            cursor: "default",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.pink + "55"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: T.pinkDim, border: `1px solid ${T.pink}33`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={stat.icon} size={17} color={T.pink} />
            </div>
            <div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 26, color: T.textPrimary, lineHeight: 1, marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: T.textSecond }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.surface}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.borderHi}; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-section {
          animation: fadeUp 0.4s ease both;
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.bg, color: T.textPrimary }}>
        <Topbar />

        <main style={{ padding: "30px 32px", maxWidth: 1160, margin: "0 auto" }}>

          {/* Page Header */}
          <div className="dash-section" style={{ animationDelay: "0ms" }}>
            <PageHeader />
          </div>

          {/* Quick Actions */}
          <div className="dash-section" style={{ animationDelay: "60ms" }}>
            <QuickActions />
          </div>

          {/* Upcoming Events */}
          <div className="dash-section" style={{ animationDelay: "120ms" }}>
            <UpcomingEventsSection />
          </div>

          {/* Two-column: Pending Applications + Recent Activity */}
          <div className="dash-section" style={{ animationDelay: "180ms", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
            <PendingApplications />
            <RecentActivity />
          </div>

          {/* Platform Summary */}
          <div className="dash-section" style={{ animationDelay: "240ms" }}>
            <PlatformSummary />
          </div>
        </main>
      </div>
    </>
  );
}
