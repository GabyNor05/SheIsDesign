import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const APP_NAME_WHITE = "Shels";
const APP_NAME_PINK  = "Design";

const HEADLINE_LINE1  = "Something";
const HEADLINE_LINE2  = "Beautiful";
const HEADLINE_ACCENT = "Is Coming.";

const SUBTITLE = "ShelsDesign is a platform built to celebrate, challenge, and elevate female students in design. We're putting the finishing touches on something special.";

const LAUNCH_DATE = new Date("2025-10-01T00:00:00");

const STATS = [
  { value: "1,200+", label: "Designers waiting" },
  { value: "48",     label: "Events planned" },
  { value: "320+",   label: "Mentors joining" },
];

const NOTIFY_PLACEHOLDER = "Enter your email address";
const NOTIFY_CTA         = "Notify Me";
const NOTIFY_SUCCESS     = "You're on the list! We'll be in touch.";

const NAV_LINKS = ["Events", "Gallery", "Leaderboard", "Donate", "Volunteer"];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Behance",   href: "#" },
  { label: "LinkedIn",  href: "#" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COUNTDOWN HOOK
// ─────────────────────────────────────────────────────────────────────────────

function useCountdown(target) {
  const calc = () => {
    const diff = target - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED BACKGROUND BLOBS
// ─────────────────────────────────────────────────────────────────────────────

function BackgroundBlobs() {
  return (
    <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Large magenta blob top-left */}
      <div style={{
        position: "absolute", top: "-180px", left: "-120px",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,45,120,0.28) 0%, transparent 70%)",
        animation: "blobPulse 8s ease-in-out infinite",
      }} />
      {/* Smaller blob bottom-right */}
      <div style={{
        position: "absolute", bottom: "-100px", right: "-80px",
        width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,45,120,0.18) 0%, transparent 70%)",
        animation: "blobPulse 10s ease-in-out infinite reverse",
      }} />
      {/* Midpoint faint blob */}
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        width: 300, height: 300, borderRadius: "50%", transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(155,10,60,0.12) 0%, transparent 70%)",
        animation: "blobPulse 12s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes blobPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COUNTDOWN UNIT
// ─────────────────────────────────────────────────────────────────────────────

function CountUnit({ value, label }) {
  const display = String(value).padStart(2, "0");
  return (
    <div style={{ textAlign: "center", minWidth: 72 }}>
      <div style={{
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,45,120,0.25)",
        borderRadius: 12, padding: "16px 20px", marginBottom: 8,
        backdropFilter: "blur(8px)",
      }}>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 38, color: "#FF2D78", lineHeight: 1, display: "block" }}>
          {display}
        </span>
      </div>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6B6B6B" }}>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL FORM
// ─────────────────────────────────────────────────────────────────────────────

function NotifyForm() {
  const [email, setEmail]     = useState("");
  const [done, setDone]       = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes("@")) setDone(true);
  };

  if (done) return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
      borderRadius: 50, padding: "14px 24px",
    }}>
      <span style={{ fontSize: 16 }}>✅</span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#22C55E" }}>{NOTIFY_SUCCESS}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0, maxWidth: 460, width: "100%" }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={NOTIFY_PLACEHOLDER}
        aria-label="Email address for launch notification"
        required
        style={{
          flex: 1, background: "rgba(255,255,255,0.07)",
          border: `1px solid ${focused ? "#FF2D78" : "rgba(255,255,255,0.15)"}`,
          borderRight: "none", borderRadius: "10px 0 0 10px",
          padding: "14px 20px", color: "#F0F0F0",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          outline: "none", transition: "border-color 0.2s",
        }}
      />
      <button
        type="submit"
        style={{
          background: "#FF2D78", border: "none", borderRadius: "0 10px 10px 0",
          padding: "14px 24px", color: "#fff", cursor: "pointer",
          fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14,
          letterSpacing: "0.04em", whiteSpace: "nowrap", transition: "opacity 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        {NOTIFY_CTA}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function ComingSoon() {
  const countdown = useCountdown(LAUNCH_DATE);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />

      <div style={{ minHeight: "100vh", background: "#0D0D0D", color: "#F0F0F0", position: "relative", overflow: "hidden" }}>
        <BackgroundBlobs />


        {/* ── HERO ── */}
        <main style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", padding: "80px 32px 60px",
          maxWidth: 820, margin: "0 auto",
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,45,120,0.12)", border: "1px solid rgba(255,45,120,0.3)",
            borderRadius: 50, padding: "7px 18px", marginBottom: 36,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: "#FF2D78",
              display: "inline-block", animation: "ping 1.5s ease-in-out infinite",
            }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#FF2D78", fontWeight: 600 }}>
              A Community For Designers
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Syne, sans-serif", fontWeight: 800,
            fontSize: "clamp(52px, 9vw, 88px)", lineHeight: 0.95,
            margin: "0 0 28px", letterSpacing: "-0.03em",
          }}>
            <span style={{ display: "block", color: "#F0F0F0" }}>{HEADLINE_LINE1}</span>
            <span style={{ display: "block", color: "#F0F0F0" }}>{HEADLINE_LINE2}</span>
            <span style={{ display: "block", color: "#FF2D78" }}>{HEADLINE_ACCENT}</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 17, lineHeight: 1.7, color: "#A0A0A0",
            maxWidth: 580, margin: "0 0 52px",
          }}>
            {SUBTITLE}
          </p>

          {/* Countdown */}
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 52, flexWrap: "wrap", justifyContent: "center" }} aria-label="Countdown to launch">
            <CountUnit value={countdown.days}    label="Days" />
            <span style={{ color: "#FF2D78", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 24 }}>:</span>
            <CountUnit value={countdown.hours}   label="Hours" />
            <span style={{ color: "#FF2D78", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 24 }}>:</span>
            <CountUnit value={countdown.minutes} label="Minutes" />
            <span style={{ color: "#FF2D78", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 28, marginBottom: 24 }}>:</span>
            <CountUnit value={countdown.seconds} label="Seconds" />
          </div>

          {/* Email form */}
          <NotifyForm />

          {/* Divider */}
          <div style={{ width: "100%", maxWidth: 480, height: 1, background: "rgba(255,255,255,0.08)", margin: "52px 0" }} />

          {/* Stats */}
          <div style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 30, color: "#FF2D78", marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#6B6B6B", letterSpacing: "0.04em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer style={{
          position: "relative", zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 48px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#4A4A4A" }}>
            © 2025 ShelsDesign. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 24 }}>
            {SOCIAL_LINKS.map(s => (
              <a key={s.label} href={s.href} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#4A4A4A",
                textDecoration: "none", transition: "color 0.15s",
              }}
              onMouseEnter={e => e.target.style.color = "#FF2D78"}
              onMouseLeave={e => e.target.style.color = "#4A4A4A"}
              >
                {s.label}
              </a>
            ))}
          </div>
        </footer>

        <style>{`
          @keyframes ping {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.3); }
          }
          input::placeholder { color: #4A4A4A; }
          * { box-sizing: border-box; }
        `}</style>
      </div>
    </>
  );
}