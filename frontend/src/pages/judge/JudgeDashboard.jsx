import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Judge.css";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — 🔌 replace with real API calls
// GET /api/judge/me
// GET /api/judge/events
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_JUDGE = {
  name:      "Lerato Nkosi",
  email:     "lerato@ogilvy.co.za",
  specialty: "Brand Identity & Visual Communication",
  initials:  "LN",
  color:     "#C41262",
};

const MOCK_EVENTS = [
  { id: 1, title: "Brand Identity Challenge",  category: "Branding",     startDate: "2026-03-12", deadline: "2026-03-20", submissions: 6, scored: 4, color: "#C41262", description: "Design a full visual identity for a fictional female-led startup." },
  { id: 2, title: "UI/UX Hackathon 2026",      category: "UI/UX",        startDate: "2026-04-05", deadline: "2026-04-12", submissions: 5, scored: 0, color: "#60A5FA", description: "48-hour hackathon redesigning a real app for accessibility." },
  { id: 3, title: "Annual Design Awards 2025", category: "Awards",       startDate: "2025-10-14", deadline: "2025-10-21", submissions: 7, scored: 7, color: "#22C55E", description: "Flagship annual awards celebrating the best SheIsDesign work." },
  { id: 4, title: "Illustration Open Brief",   category: "Illustration", startDate: "2026-05-02", deadline: "2026-05-10", submissions: 5, scored: 0, color: "#a78bfa", description: "Open illustration brief celebrating African femininity." },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function daysUntil(iso) {
  if (!iso) return null;
  const diff = new Date(iso + "T23:59:59") - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Build a Google Calendar "add event" URL — no API key needed
function buildCalendarUrl(event) {
  const toGCal = iso => iso.replace(/-/g, "") + "T090000Z";
  const params = new URLSearchParams({
    action:  "TEMPLATE",
    text:    `${event.title} — SheIsDesign Judge`,
    dates:   `${toGCal(event.startDate)}/${toGCal(event.deadline)}`,
    details: `Score ${event.submissions} submissions by ${fmtDate(event.deadline)}.\n\nCategory: ${event.category}\n${event.description}\n\nSheIsDesign Judge Portal`,
    sf:      "true",
    output:  "xml",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function urgencyConfig(days) {
  if (days === null)  return null;
  if (days < 0)       return { label: "Overdue",    bg: "#200B0B", color: "#F87171", border: "rgba(248,113,113,0.35)" };
  if (days <= 2)      return { label: `${days}d left`, bg: "#1C1200", color: "#FBBF24", border: "rgba(251,191,36,0.35)"  };
  if (days <= 5)      return { label: `${days}d left`, bg: "#1C1200", color: "#f97316", border: "rgba(249,115,22,0.3)"   };
  return null;
}

function initials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// ICON
// ─────────────────────────────────────────────────────────────────────────────
function Ic({ n, s = 16, c = "currentColor" }) {
  const paths = {
    trophy:   <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    cal:      <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    check:    <polyline points="20 6 9 17 4 12"/>,
    clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    arrow:    <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    star:     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    file:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    logout:   <><path d="M9 21H5a2 2 0 0 0-2-2V5a2 2 0 0 0 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    gcal:     <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h4v4"/></>,
    bell:     <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    zap:      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[n] || null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
function Topbar({ judge, navigate }) {
  return (
    <header style={{
      height: 58,
      background: "#1A1A1A",
      borderBottom: "1px solid #2E2E2E",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      position: "sticky",
      top: 0,
      zIndex: 30,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 17, color: "#F0F0F0" }}>
        Shels<span style={{ color: "#FE4081" }}>Design</span>
        <span style={{
          marginLeft: 10, fontSize: 10, fontWeight: 600,
          color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
          textTransform: "uppercase", verticalAlign: "middle",
        }}>Judge Portal</span>
      </span>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Judge avatar + name */}
        {judge && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `linear-gradient(135deg, #C41262, #FE4081)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 11, color: "#fff",
            }}>
              {initials(judge.name)}
            </div>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#F0F0F0", lineHeight: 1.2 }}>
                {judge.name}
              </div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                {judge.email}
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "1px solid #2E2E2E",
            borderRadius: 8, padding: "6px 12px",
            cursor: "pointer", color: "rgba(255,255,255,0.55)",
            fontFamily: "'Poppins', sans-serif", fontSize: 12,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#F87171"; e.currentTarget.style.color = "#F87171"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#2E2E2E"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
        >
          <Ic n="logout" s={13} c="currentColor" /> Log out
        </button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE CLOCK
// ─────────────────────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
      {time.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long" })}
      {"  ·  "}
      {time.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT CARD
// ─────────────────────────────────────────────────────────────────────────────
function EventCard({ event, onScore }) {
  const [hov, setHov] = useState(false);
  const pct      = event.submissions > 0 ? Math.round((event.scored / event.submissions) * 100) : 0;
  const isDone   = event.scored === event.submissions && event.submissions > 0;
  const days     = daysUntil(event.deadline);
  const urgency  = urgencyConfig(days);
  const calUrl   = buildCalendarUrl(event);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#1A1A1A",
        border: `1px solid ${hov ? `${event.color}55` : "#2E2E2E"}`,
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? `0 16px 48px ${event.color}18` : "none",
      }}
    >
      {/* Colour strip */}
      <div style={{
        height: 5,
        background: `linear-gradient(90deg, ${event.color}, ${event.color}88)`,
        flexShrink: 0,
      }} />

      {/* Top */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #242424" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
              {event.category}
            </div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15.5, color: "#F0F0F0", lineHeight: 1.3, fontFamily: "'Poppins', sans-serif" }}>
              {event.title}
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
            {isDone ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#052512", color: "#22C55E", border: "1px solid rgba(34,197,94,0.35)", borderRadius: 999, padding: "3px 10px", fontSize: 10.5, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} /> Complete
              </span>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#2D0A1A", color: "#FE4081", border: "1px solid rgba(196,18,98,0.3)", borderRadius: 999, padding: "3px 10px", fontSize: 10.5, fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FE4081", display: "inline-block" }} /> Needs Scoring
              </span>
            )}
            {urgency && !isDone && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: urgency.bg, color: urgency.color, border: `1px solid ${urgency.border}`, borderRadius: 999, padding: "2px 9px", fontSize: 10, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                <Ic n="clock" s={9} c="currentColor" /> {urgency.label}
              </span>
            )}
          </div>
        </div>

        <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, fontFamily: "'Poppins', sans-serif" }}>
          {event.description}
        </p>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'Poppins', sans-serif" }}>
            <Ic n="cal" s={12} c="rgba(255,255,255,0.3)" /> Event: {fmtDate(event.startDate)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'Poppins', sans-serif" }}>
            <Ic n="clock" s={12} c="rgba(255,255,255,0.3)" /> Score by: {fmtDate(event.deadline)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'Poppins', sans-serif" }}>
            <Ic n="file" s={12} c="rgba(255,255,255,0.3)" />
            {event.scored} of {event.submissions} scored
            {!isDone && <span style={{ color: "#FE4081", fontWeight: 600 }}>· {event.submissions - event.scored} remaining</span>}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5, fontFamily: "'Poppins', sans-serif" }}>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>Scoring progress</span>
            <span style={{ color: "#FE4081", fontWeight: 700 }}>{pct}%</span>
          </div>
          <div style={{ height: 5, background: "#2A2A2A", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              width: `${pct}%`, height: "100%",
              background: isDone ? "#22C55E" : `linear-gradient(90deg, #C41262, #FE4081)`,
              borderRadius: 3, transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{ borderTop: "1px solid #242424", display: "flex" }}>
        {/* Google Calendar button */}
        <a
          href={calUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          title="Add to Google Calendar"
          style={{
            flex: "0 0 auto",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "12px 16px",
            background: "none",
            borderRight: "1px solid #242424",
            color: "rgba(255,255,255,0.4)",
            fontSize: 12, fontFamily: "'Poppins', sans-serif", fontWeight: 500,
            textDecoration: "none",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1E2A1A"; e.currentTarget.style.color = "#22C55E"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
        >
          <Ic n="gcal" s={13} c="currentColor" /> Add to Calendar
        </a>

        {/* Score button */}
        <button
          onClick={() => onScore(event.id)}
          style={{
            flex: 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            background: isDone ? "none" : "linear-gradient(135deg, #C41262, #FE4081)",
            border: "none",
            padding: "12px 0",
            cursor: "pointer",
            color: isDone ? "rgba(255,255,255,0.55)" : "#fff",
            fontFamily: "'Poppins', sans-serif",
            fontSize: 13, fontWeight: 700,
            transition: "opacity 0.15s, background 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          {isDone ? (
            <><Ic n="check" s={13} c="currentColor" /> View Scores</>
          ) : (
            <><Ic n="arrow" s={13} c="#fff" /> {event.scored > 0 ? "Continue" : "Start Scoring"}</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function JudgeDashboard() {
  const navigate = useNavigate();
  const [judge,  setJudge]  = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // 🔌 API CONNECTION: replace with real fetch
    setJudge(MOCK_JUDGE);
    setEvents(MOCK_EVENTS);
  }, []);

  const totalScored  = events.reduce((s, e) => s + e.scored, 0);
  const totalPending = events.reduce((s, e) => s + (e.submissions - e.scored), 0);
  const totalComplete= events.filter(e => e.scored === e.submissions && e.submissions > 0).length;
  const needsAction  = events.filter(e => e.scored < e.submissions);

  const STATS = [
    { icon: "cal",    label: "Assigned",   value: events.length   },
    { icon: "star",   label: "Scored",     value: totalScored     },
    { icon: "clock",  label: "Pending",    value: totalPending    },
    { icon: "check",  label: "Complete",   value: totalComplete   },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", fontFamily: "'Poppins', sans-serif" }}>
      <Topbar judge={judge} navigate={navigate} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>

        {/* ── Hero banner */}
        <div className="j-anim" style={{
          animationDelay: "0ms",
          background: "linear-gradient(135deg, #2D0A1A 0%, #1A0A14 40%, #0D0D0D 100%)",
          border: "1px solid rgba(196,18,98,0.2)",
          borderRadius: 20,
          padding: "36px 40px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Glow orb */}
          <div style={{
            position: "absolute", top: -60, right: 80,
            width: 260, height: 260, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,18,98,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 18, height: 1, background: "rgba(255,255,255,0.35)", display: "inline-block" }} />
              Welcome back
            </div>
            <h1 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 36, color: "#F0F0F0", letterSpacing: "-0.02em" }}>
              {judge?.name ?? "Judge"}
            </h1>
            <p style={{ margin: "0 0 16px", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
              {judge?.specialty}
            </p>
            <LiveClock />

            {/* Status badge */}
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(196,18,98,0.12)", border: "1px solid rgba(196,18,98,0.3)", borderRadius: 999, padding: "5px 14px", fontSize: 11.5, fontWeight: 600, color: "#FE4081" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
                Active Judge — SheIsDesign
              </span>
              {totalPending > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1C1200", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 999, padding: "5px 14px", fontSize: 11.5, fontWeight: 600, color: "#FBBF24" }}>
                  <Ic n="zap" s={11} c="currentColor" />
                  {totalPending} submission{totalPending !== 1 ? "s" : ""} need your score
                </span>
              )}
            </div>
          </div>

          {/* Quick action */}
          {needsAction.length > 0 && (
            <button
              className="j-btn-primary"
              style={{ fontSize: 14, padding: "13px 26px", borderRadius: 12, position: "relative" }}
              onClick={() => navigate(`/judge/score/${needsAction[0].id}`)}
            >
              <Ic n="arrow" s={15} c="#fff" />
              Score Now
            </button>
          )}
        </div>

        {/* ── Stats */}
        <div className="j-anim" style={{
          animationDelay: "60ms",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
          marginBottom: 32,
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: "#1A1A1A",
              border: "1px solid #2E2E2E",
              borderRadius: 14,
              padding: "22px 18px",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 10, textAlign: "center",
              transition: "border-color 0.2s, transform 0.2s",
              cursor: "default",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(196,18,98,0.35)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2E2E2E"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2D0A1A", border: "1px solid rgba(196,18,98,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ic n={s.icon} s={18} c="#FE4081" />
              </div>
              <div style={{ fontWeight: 800, fontSize: 28, color: "#F0F0F0", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Needs attention strip */}
        {needsAction.length > 0 && (
          <div className="j-anim" style={{ animationDelay: "100ms", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Ic n="zap" s={15} c="#FE4081" />
              <span style={{ fontWeight: 700, fontSize: 15, color: "#F0F0F0" }}>Needs Your Attention</span>
              <span style={{ background: "#2D0A1A", color: "#FE4081", border: "1px solid rgba(196,18,98,0.3)", borderRadius: 999, padding: "1px 9px", fontSize: 11, fontWeight: 700 }}>
                {needsAction.length}
              </span>
            </div>
            <div style={{ background: "#1A1A1A", border: "1px solid rgba(196,18,98,0.2)", borderRadius: 14, overflow: "hidden" }}>
              {needsAction
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .map((ev, i) => {
                  const days = daysUntil(ev.deadline);
                  const urgency = urgencyConfig(days);
                  const remaining = ev.submissions - ev.scored;
                  return (
                    <div
                      key={ev.id}
                      onClick={() => navigate(`/judge/score/${ev.id}`)}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 18px",
                        borderBottom: i < needsAction.length - 1 ? "1px solid #242424" : "none",
                        cursor: "pointer", transition: "background 0.15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#202020"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <div style={{ width: 4, height: 36, borderRadius: 3, background: ev.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5, color: "#F0F0F0", marginBottom: 2 }}>{ev.title}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                          {remaining} submission{remaining !== 1 ? "s" : ""} to score · Due {fmtDate(ev.deadline)}
                        </div>
                      </div>
                      {urgency && (
                        <span style={{ background: urgency.bg, color: urgency.color, border: `1px solid ${urgency.border}`, borderRadius: 999, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, flexShrink: 0, fontFamily: "'Poppins', sans-serif" }}>
                          {urgency.label}
                        </span>
                      )}
                      <Ic n="arrow" s={14} c="rgba(255,255,255,0.3)" />
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ── All events grid */}
        <div className="j-anim" style={{ animationDelay: "140ms" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Ic n="cal" s={15} c="rgba(255,255,255,0.4)" />
              <span style={{ fontWeight: 700, fontSize: 15, color: "#F0F0F0" }}>All Assigned Events</span>
              <span style={{ background: "#242424", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
                {events.length}
              </span>
            </div>
            <button
              className="j-btn-ghost"
              onClick={() => navigate("/judge/events")}
              style={{ fontSize: 12.5 }}
            >
              Full view <Ic n="arrow" s={12} c="currentColor" />
            </button>
          </div>

          {events.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              No events assigned yet.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
              {events.map(ev => (
                <EventCard key={ev.id} event={ev} onScore={id => navigate(`/judge/score/${id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}