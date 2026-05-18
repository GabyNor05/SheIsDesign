import { useState, useEffect } from "react";
import { T } from "../../components/admin/theme";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PAGE_LABEL    = "Manage Participants · Coming Soon";
const HEADLINE_1    = "Under";
const HEADLINE_2    = "Construction";
const SUBTEXT       = "We're building something beautiful. This section of the admin panel is being crafted with care and will be ready soon.";
const PROGRESS_PCT  = 80;
const PROGRESS_LABEL = "Build progress";
const ETA_LABEL     = "Estimated completion";
const ETA_DATE      = "June 2026";

const TASKS = [
  { label: "UI Design",          done: true  },
  { label: "Component Library",  done: true  },
  { label: "API Integration",    done: true  },
  { label: "Data Layer",         done: true },
  { label: "Testing & QA",       done: true },
  { label: "Deployment",         done: false },
];

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED BACKGROUND GRID
// ─────────────────────────────────────────────────────────────────────────────
function GridBackground() {
  return (
    <div aria-hidden="true" style={{
      position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none",
    }}>
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle, ${T.border} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        opacity: 0.5,
      }} />

      {/* Pink glow blob — top left */}
      <div style={{
        position: "absolute", top: "-200px", left: "-100px",
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,45,120,0.18) 0%, transparent 65%)`,
        animation: "blob1 9s ease-in-out infinite",
      }} />

      {/* Smaller glow — bottom right */}
      <div style={{
        position: "absolute", bottom: "-120px", right: "-60px",
        width: 420, height: 420, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(255,45,120,0.10) 0%, transparent 65%)`,
        animation: "blob2 12s ease-in-out infinite",
      }} />

      {/* Diagonal lines — decorative */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} preserveAspectRatio="none">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i}
            x1={`${i * 9}%`} y1="0%"
            x2={`${i * 9 - 10}%`} y2="100%"
            stroke={T.pink} strokeWidth="1"
          />
        ))}
      </svg>

      <style>{`
        @keyframes blob1 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.15) translate(30px,20px)} }
        @keyframes blob2 { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.08) translate(-20px,-30px)} }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedProgress({ target }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const step = target / 60;
    let val = 0;
    const timer = setInterval(() => {
      val += step;
      if (val >= target) { setCurrent(target); clearInterval(timer); }
      else setCurrent(Math.floor(val));
    }, 18);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span style={{
      fontFamily: "Syne, sans-serif", fontWeight: 800,
      fontSize: "clamp(52px, 8vw, 80px)",
      color: T.pink, lineHeight: 1,
      textShadow: `0 0 60px rgba(255,45,120,0.3)`,
    }}>
      {current}<span style={{ fontSize: "0.45em", color: T.textSecond, marginLeft: 4 }}>%</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TASK CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────
function TaskList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {TASKS.map((task, i) => (
        <div
          key={task.label}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            opacity: 0, animation: `fadeUp .4s ease ${0.6 + i * 0.08}s both`,
          }}
        >
          {/* Check circle */}
          <div style={{
            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: task.done ? T.activeBg : T.surfaceHi,
            border: `1.5px solid ${task.done ? T.activeGreen : T.border}`,
            transition: "all .3s",
          }}>
            {task.done && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke={T.activeGreen} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13.5,
            color: task.done ? T.textPrimary : T.textMuted,
            textDecoration: task.done ? "none" : "none",
            fontWeight: task.done ? 500 : 400,
          }}>
            {task.label}
          </span>
          {!task.done && (
            <span style={{
              marginLeft: "auto", fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
              color: T.amber, background: T.amberBg,
              borderRadius: 4, padding: "2px 7px", fontWeight: 600,
            }}>
              Pending
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────
function ProgressBar({ pct }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(pct), 300); return () => clearTimeout(t); }, [pct]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {PROGRESS_LABEL}
        </span>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 12, color: T.pink }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 6, background: T.surfaceHi, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: `linear-gradient(90deg, ${T.pink}88, ${T.pink}, #FF6BA8)`,
          width: `${width}%`,
          transition: "width 1.4s cubic-bezier(.34,1.2,.64,1)",
          boxShadow: `0 0 12px rgba(255,45,120,0.5)`,
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DECORATIVE TOOL ICONS
// ─────────────────────────────────────────────────────────────────────────────
function FloatingIcon({ icon, style }) {
  return (
    <div style={{
      position: "absolute", width: 44, height: 44, borderRadius: 12,
      background: T.surfaceHi, border: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: 0.6, ...style,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={T.textMuted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {icon}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function UnderConstruction({ pageName = "This Page" }) {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes spin    { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.15)} }
        @keyframes drift   { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
      `}</style>

      <GridBackground />

      <div style={{
        minHeight: "100vh", background: T.bg, color: T.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
        display: "flex", flexDirection: "column",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
          <div style={{ width: "100%", maxWidth: 940 }}>

            {/* ── Breadcrumb */}
            <p style={{
              opacity: 0, animation: "fadeUp .4s ease .1s both",
              fontFamily: "'DM Sans', sans-serif", fontSize: 11,
              color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 8, marginBottom: 48,
            }}>
              <span style={{ width: 18, height: 1, background: T.textMuted, display: "inline-block" }} />
              {PAGE_LABEL}
            </p>

            {/* ── Main layout: left content + right card */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>

              {/* LEFT */}
              <div>
                {/* Headline */}
                <div style={{ marginBottom: 28 }}>
                  <h1 style={{
                    opacity: 0, animation: "fadeUp .5s ease .2s both",
                    fontFamily: "Syne, sans-serif", fontWeight: 800,
                    fontSize: "clamp(36px, 8vw, 52px)",
                    lineHeight: 0.92, letterSpacing: "-0.03em",
                    color: T.textPrimary, marginBottom: 0,
                  }}>
                    <span style={{ display: "block" }}>{HEADLINE_1}</span>
                    <span style={{ display: "block", color: T.pink, textShadow: "0 0 80px rgba(255,45,120,0.25)" }}>
                      {HEADLINE_2}
                      <span style={{ color: T.pink }}>.</span>
                    </span>
                  </h1>
                </div>

                {/* Subtext */}
                <p style={{
                  opacity: 0, animation: "fadeUp .5s ease .35s both",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                  fontSize: 16, lineHeight: 1.75, color: T.textSecond,
                  maxWidth: 480, marginBottom: 36,
                }}>
                  {SUBTEXT}
                </p>

                {/* Progress bar */}
                <div style={{
                  opacity: 0, animation: "fadeUp .5s ease .45s both",
                  marginBottom: 36,
                }}>
                  <ProgressBar pct={PROGRESS_PCT} />
                </div>

                {/* ETA chip */}
                <div style={{
                  opacity: 0, animation: "fadeUp .5s ease .5s both",
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 10, padding: "10px 16px", marginBottom: 40,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke={T.pink} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {ETA_LABEL}
                  </span>
                  <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: T.textPrimary }}>
                    {ETA_DATE}
                  </span>
                </div>

                {/* Checklist */}
                <div style={{
                  opacity: 0, animation: "fadeUp .5s ease .55s both",
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 14, padding: "22px 24px",
                }}>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                    color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase",
                    marginBottom: 16,
                  }}>
                    Build Checklist
                  </p>
                  <TaskList />
                </div>
              </div>

              {/* RIGHT — animated percentage card */}
              <div style={{ opacity: 0, animation: "fadeUp .6s ease .3s both" }}>
                <div style={{
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 20, padding: "36px 32px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", gap: 24, position: "relative", overflow: "hidden",
                }}>

                  {/* Pink glow inside card */}
                  <div aria-hidden="true" style={{
                    position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
                    width: 280, height: 280, borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,45,120,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }} />

                  {/* Spinning ring */}
                  <div style={{ position: "relative", width: 140, height: 140 }}>
                    <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: "absolute", inset: 0 }}>
                      {/* Track */}
                      <circle cx="70" cy="70" r="62" fill="none" stroke={T.surfaceHi} strokeWidth="6" />
                      {/* Progress arc */}
                      <circle
                        cx="70" cy="70" r="62" fill="none"
                        stroke={T.pink} strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 62}`}
                        strokeDashoffset={`${2 * Math.PI * 62 * (1 - PROGRESS_PCT / 100)}`}
                        transform="rotate(-90 70 70)"
                        style={{ filter: "drop-shadow(0 0 8px rgba(255,45,120,0.5))", transition: "stroke-dashoffset 1.4s cubic-bezier(.34,1.2,.64,1)" }}
                      />
                    </svg>
                    {/* Center icon */}
                    <div style={{
                      position: "absolute", inset: 0, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                        stroke={T.pink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ animation: "drift 3s ease-in-out infinite" }}>
                        <rect x="2" y="3" width="20" height="14" rx="2"/>
                        <polyline points="8 21 12 17 16 21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                  </div>

                  {/* Big % number */}
                  <AnimatedProgress target={PROGRESS_PCT} />

                  {/* Label */}
                  <div>
                    <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: T.textPrimary, marginBottom: 6 }}>
                      {pageName}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: T.textMuted, lineHeight: 1.5 }}>
                      Being carefully designed<br />and developed
                    </p>
                  </div>

                  {/* Status dot */}
                  <div style={{ display: "flex", alignItems: "center", gap: 7, background: T.amberBg, border: `1px solid ${T.amber}33`, borderRadius: 20, padding: "6px 14px" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.amber, display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 600, color: T.amber, letterSpacing: "0.05em" }}>
                      In Development
                    </span>
                  </div>

                  {/* Decorative floating tool icons */}
                  <FloatingIcon
                    icon={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>}
                    style={{ top: 16, right: 16, animation: "drift 4s ease-in-out infinite" }}
                  />
                  <FloatingIcon
                    icon={<><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>}
                    style={{ bottom: 80, left: 16, animation: "drift 5s ease-in-out 1s infinite" }}
                  />
                </div>

                {/* Back button */}
                <button
                  onClick={() => window.history.back()}
                  style={{
                    width: "100%", marginTop: 14, display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8, background: "none",
                    border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 0",
                    cursor: "pointer", color: T.textSecond,
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                    transition: "all .15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.pink; e.currentTarget.style.color = T.pink; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecond; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}