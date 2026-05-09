import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — single source of truth
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  // Backgrounds
  bg:        "#0D0D0D",   // page background
  surface:   "#1A1A1A",   // card / sidebar background
  surfaceHi: "#242424",   // elevated card, hover surface
  border:    "#2E2E2E",   // subtle dividers
  // Brand
  pink:      "#FF2D78",   // primary CTA / active state
  pinkDim:   "#3D0F22",   // pink tint background (accessible)
  // Text — all WCAG AA on #1A1A1A
  textPrimary:  "#F0F0F0",  // 15.3:1 on surface
  textSecond:   "#A0A0A0",  // 5.9:1 on surface — AA large
  textMuted:    "#6B6B6B",  // decorative only
  // Status
  activeGreen:  "#22C55E",
  activeBg:     "#052512",
  upBlue:       "#60A5FA",
  upBg:         "#0A1628",
  draftGray:    "#A0A0A0",
  draftBg:      "#222222",
  closedRed:    "#F87171",
  closedBg:     "#200B0B",
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — all dummy data
// ─────────────────────────────────────────────────────────────────────────────

const APP_NAME_WHITE = "Shels";
const APP_NAME_PINK  = "Design";
const ADMIN_NAME     = "Admin";
const ADMIN_EMAIL    = "admin@sheisdesign.co.za";
const PAGE_TITLE     = "Overview";
const PAGE_SUBTITLE  = "Manage events, participants, and competitions.";
const TODAY_LABEL    = "Thu, 8 August 2025";
const STATUS_BADGE   = "System Online";

const STATS = [
  { id: 1, value: "1,247", label: "Total Participants", sub: "↑ 12% this month",  icon: "👥" },
  { id: 2, value: "5",     label: "Upcoming Events",    sub: "Next: 14 Sep 2025", icon: "📅" },
  { id: 3, value: "3,840", label: "Total Submissions",  sub: "↑ 8% this week",    icon: "📎" },
  { id: 4, value: "R 48k", label: "Total Donations",    sub: "↑ 14% all-time",    icon: "💝" },
];

const QUICK_ACTIONS = [
  { id: 1, title: "Create New Event",      desc: "Set up a design challenge, workshop, or competition.", tag: "Open →" },
  { id: 2, title: "Review Submissions",    desc: "Browse and evaluate participant design submissions.",  tag: "Open →" },
  { id: 3, title: "View Leaderboard",      desc: "See top-ranked participants across active events.",    tag: "Open →" },
  { id: 4, title: "Add Sponsor/Donation",  desc: "Log a new sponsorship or donation entry.",             tag: "Open →" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "participant", title: "New student registered",  detail: "Amara Dlamini — University of Johannesburg", time: "2 min ago" },
  { id: 2, type: "event",       title: "Event created",           detail: "Global Sandbox Design Challenge 2025",        time: "41 min ago" },
  { id: 3, type: "submission",  title: "Submission uploaded",     detail: "Lilli Brown — Spring Campaign",               time: "1h 30m ago" },
  { id: 4, type: "donation",    title: "Donation received",       detail: "Anonymous — R 2,500",                         time: "3h ago" },
  { id: 5, type: "participant", title: "Student account approved",detail: "Tara Khumalo — WITS University",              time: "4h ago" },
  { id: 6, type: "event",       title: "Event updated",           detail: "Motion Design Bootcamp — dates revised",      time: "5h ago" },
];

const EVENTS = [
  { id: 1, name: "Brand Identity Challenge",  date: "12 Mar 2026", participants: 84,  status: "ACTIVE"   },
  { id: 2, name: "Motion Design Bootcamp",     date: "20 Mar 2026", participants: 41,  status: "UPCOMING" },
  { id: 3, name: "UI/UX Hackathon 2026",       date: "5 Apr 2026",  participants: 122, status: "UPCOMING" },
  { id: 4, name: "Typography Sprint",          date: "18 Apr 2026", participants: 28,  status: "DRAFT"    },
  { id: 5, name: "Illustration Open Brief",    date: "2 May 2026",  participants: 87,  status: "UPCOMING" },
  { id: 6, name: "Annual Design Awards 2025",  date: "14 Oct 2025", participants: 203, status: "CLOSED"   },
];

const NAV_MAIN = [
  { label: "Dashboard",    icon: "grid"     },
  { label: "Events",       icon: "calendar" },
  { label: "Participants", icon: "users"    },
  { label: "Leaderboard",  icon: "trophy"   },
  { label: "Gallery",      icon: "image"    },
  { label: "Donations",    icon: "heart"    },
];

const STATUS_MAP = {
  ACTIVE:   { bg: T.activeBg,  color: T.activeGreen, dot: T.activeGreen },
  UPCOMING: { bg: T.upBg,      color: T.upBlue,       dot: T.upBlue      },
  DRAFT:    { bg: T.draftBg,   color: T.draftGray,    dot: T.draftGray   },
  CLOSED:   { bg: T.closedBg,  color: T.closedRed,    dot: T.closedRed   },
};

const ACTIVITY_ICONS = {
  participant: "👤", event: "📅", submission: "📎", donation: "💝",
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICON
// ─────────────────────────────────────────────────────────────────────────────

function Icon({ name, size = 18, color = T.textSecond }) {
  const p = {
    grid:     <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    users:    <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    trophy:   <><path d="M8 21h8M12 17v4M7 4H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4"/><path d="M17 4h3a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4"/><path d="M7 4h10v8a5 5 0 0 1-10 0V4z"/></>,
    image:    <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></>,
    heart:    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    help:     <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></>,
    logout:   <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    edit:     <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    rocket:   <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M15 12v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {p[name]}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

function Sidebar({ active, onSelect }) {
  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      style={{
        width: 230, minHeight: "100vh", background: T.surface,
        display: "flex", flexDirection: "column", padding: "24px 14px",
        boxSizing: "border-box", borderRight: `1px solid ${T.border}`, flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "4px 12px 32px" }}>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: T.textPrimary }}>
          {APP_NAME_WHITE}
          <span style={{ color: T.pink }}>{APP_NAME_PINK}</span>
        </span>
      </div>

      {/* Main nav */}
      <ul role="list" style={{ flex: 1, listStyle: "none", margin: 0, padding: 0 }}>
        {NAV_MAIN.map(({ label, icon }) => {
          const isActive = label === active;
          return (
            <li key={label}>
              <button
                onClick={() => onSelect(label)}
                aria-current={isActive ? "page" : undefined}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", marginBottom: 4, borderRadius: 10,
                  border: "none", cursor: "pointer", textAlign: "left",
                  background: isActive ? T.pink : "transparent",
                  color: isActive ? "#fff" : T.textSecond,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14.5,
                  fontWeight: isActive ? 600 : 400,
                  transition: "background 0.15s, color 0.15s",
                  // WCAG: focus ring
                  outline: "none",
                }}
                onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; }}
                onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textPrimary; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textSecond; }}}
              >
                <Icon name={icon} size={18} color={isActive ? "#fff" : T.textSecond} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      <div role="separator" style={{ height: 1, background: T.border, margin: "12px 4px" }} />

      {/* Bottom */}
      <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <li>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", marginBottom: 4, borderRadius: 10,
            border: "none", cursor: "pointer", textAlign: "left",
            background: "transparent", color: T.textSecond,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 400,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textPrimary; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textSecond; }}
          onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; }}
          onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <Icon name="help" size={18} color={T.textSecond} />
            Help &amp; Docs
          </button>
        </li>
        <li>
          <button style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer",
            textAlign: "left", background: "transparent", color: T.pink,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, fontWeight: 500,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.pinkDim; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; }}
          onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
          aria-label="Log out of ShelsDesign"
          >
            <Icon name="logout" size={18} color={T.pink} />
            Log out
          </button>
        </li>
      </ul>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────

function Topbar() {
  return (
    <header style={{
      height: 60, background: T.surface, borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", flexShrink: 0, position: "sticky", top: 0, zIndex: 20,
    }}>
      <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: T.textPrimary }}>
        {APP_NAME_WHITE}<span style={{ color: T.pink }}>{APP_NAME_PINK}</span>
        <span style={{ color: T.pink }}>.</span>
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button
          aria-label="Notifications"
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 6, borderRadius: 8 }}
          onFocus={e => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; }}
          onBlur={e  => { e.currentTarget.style.boxShadow = "none"; }}
        >
          <Icon name="bell" size={18} color={T.textSecond} />
        </button>
        {/* Admin avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.pink}, #9B0A3C)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Syne, sans-serif" }}>A</span>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: T.textPrimary, lineHeight: 1.2 }}>{ADMIN_NAME}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textSecond }}>{ADMIN_EMAIL}</div>
          </div>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "7px 12px", cursor: "pointer", color: T.textSecond,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.pink; e.currentTarget.style.color = T.pink; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecond; }}
        onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; }}
        onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
        aria-label="Log out"
        >
          <Icon name="logout" size={14} color="currentColor" />
          Logout
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ stat }) {
  return (
    <article style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
      padding: "22px 24px", flex: "1 1 160px",
      transition: "border-color 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = T.pink}
    onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
    >
      <div style={{ fontSize: 22, marginBottom: 10 }} aria-hidden="true">{stat.icon}</div>
      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 30, color: T.textPrimary, marginBottom: 4 }}>
        {stat.value}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: T.textSecond, marginBottom: 6 }}>
        {stat.label}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.pink, fontWeight: 500 }}>
        {stat.sub}
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ACTION CARD
// ─────────────────────────────────────────────────────────────────────────────

function QuickActionCard({ action }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onFocus={e => { setHov(true); e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; }}
      onBlur={e  => { setHov(false); e.currentTarget.style.boxShadow = "none"; }}
      style={{
        flex: "1 1 180px", textAlign: "left", cursor: "pointer",
        background: hov ? T.pink : T.surface,
        border: `1px solid ${hov ? T.pink : T.border}`,
        borderRadius: 12, padding: "18px 18px 14px",
        transition: "all 0.18s", outline: "none",
      }}
    >
      <div style={{
        fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14,
        color: hov ? "#fff" : T.textPrimary, marginBottom: 8,
      }}>
        {action.title}
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12.5,
        color: hov ? "rgba(255,255,255,0.8)" : T.textSecond,
        lineHeight: 1.55, marginBottom: 14,
      }}>
        {action.desc}
      </div>
      <span style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
        color: hov ? "#fff" : T.pink, letterSpacing: "0.03em",
      }}>
        {action.tag}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY ROW
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS TABLE
// ─────────────────────────────────────────────────────────────────────────────

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
                    onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; }}
                    onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <Icon name="edit" size={14} color="currentColor" />
                  </button>
                  <button
                    aria-label={`Delete ${ev.name}`}
                    style={{ background: T.surfaceHi, border: "none", cursor: "pointer", color: T.textSecond, padding: "6px 8px", borderRadius: 6, display: "flex", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = T.closedBg; e.currentTarget.style.color = T.closedRed; }}
                    onMouseLeave={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textSecond; }}
                    onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.closedRed}`; }}
                    onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <Icon name="trash" size={14} color="currentColor" />
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

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

function Section({ icon, title, onNewEvent, children }) {
  return (
    <section
      aria-label={title}
      style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16,
        overflow: "hidden", marginBottom: 20,
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", borderBottom: `1px solid ${T.border}`,
      }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: T.textPrimary }}>
          <span aria-hidden="true">{icon}</span>
          {title}
        </h2>
        {onNewEvent ? (
          <button onClick={onNewEvent}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: T.pink, border: "none", borderRadius: 8,
              padding: "8px 16px", cursor: "pointer", color: "#fff",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px #fff, 0 0 0 4px ${T.pink}`; }}
            onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <Icon name="plus" size={13} color="#fff" />
            New Event
          </button>
        ) : (
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.pink, fontWeight: 600,
          }}
          onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; e.currentTarget.style.borderRadius = "4px"; }}
          onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
          >
            Show all
          </button>
        )}
      </div>
      <div style={{ padding: "6px 24px 20px" }}>
        {children}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <div style={{ padding: "30px 32px", maxWidth: 1120 }}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textMuted, marginBottom: 8, letterSpacing: "0.08em" }}>
        PAGES / DASHBOARD
      </nav>

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 36, color: T.textPrimary, margin: "0 0 6px" }}>
            {PAGE_TITLE}
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSecond, margin: 0 }}>
            {PAGE_SUBTITLE}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <time style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: T.textSecond }}>
            {TODAY_LABEL}
          </time>
          <span style={{
            background: T.activeBg, color: T.activeGreen, borderRadius: 20,
            padding: "4px 12px", fontSize: 12, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6,
          }} role="status">
            <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: T.activeGreen, display: "inline-block" }} />
            {STATUS_BADGE}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }} role="region" aria-label="Key statistics">
        {STATS.map(s => <StatCard key={s.id} stat={s} />)}
      </div>

      {/* Quick Actions */}
      <Section icon="⚡" title="Quick Actions">
        <div style={{ display: "flex", gap: 14, paddingTop: 16, flexWrap: "wrap" }}>
          {QUICK_ACTIONS.map(a => <QuickActionCard key={a.id} action={a} />)}
        </div>
      </Section>

      {/* Recent Activity */}
      <Section icon="🕐" title="Recent Activity">
        {RECENT_ACTIVITY.map((item, i) => (
          <ActivityRow key={item.id} item={item} isLast={i === RECENT_ACTIVITY.length - 1} />
        ))}
      </Section>

      {/* Upcoming Events */}
      <Section icon="📅" title="Upcoming Events" onNewEvent={() => {}}>
        <EventsTable />
      </Section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar active={activePage} onSelect={setActivePage} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Topbar />
          <main id="main-content" style={{ flex: 1, overflowY: "auto" }}>
            {activePage === "Dashboard" ? (
              <DashboardPage />
            ) : (
              <div style={{ padding: 40, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800, color: T.textPrimary, marginBottom: 8 }}>{activePage}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", color: T.textSecond, fontSize: 14 }}>This section is coming soon.</div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}