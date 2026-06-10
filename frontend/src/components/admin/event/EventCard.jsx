import { useState } from "react";
import { fmtDate } from "./utils";
import EventImage from "./EventImage";
import { Icon } from "../overview/Icon";
import { T, STATUS_STYLES } from "../theme";
import EventForm from "./EventForm"

function Badge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}40`,
      borderRadius: 4, padding: "3px 8px",
      fontSize: 10, fontWeight: 800,
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: "0.1em", textTransform: "uppercase",
    }}>
      {status}
    </span>
  );
}

function ProgressBar({ count, max, showLabel = true }) {
  function calcPct(count, max) { return max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0; }
  const p = calcPct(count, max);
  return (
    <div>
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11.5, color: T.textSecond }}>
            {count} / {max} entries
          </span>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11.5, fontWeight: 700, color: p >= 80 ? T.pink : T.textSecond }}>
            {p}% full
          </span>
        </div>
      )}
      <div style={{ height: showLabel ? 5 : 4, background: T.surfaceHi, borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${p}%`, height: "100%",
          background: `linear-gradient(90deg, ${T.pink}88, ${T.pink})`,
          borderRadius: 3, transition: "width .5s",
        }} />
      </div>
    </div>
  );
} 

function JudgeAvatars({ count }) {
  if (!count) return null;
  const colors = [T.pink, T.upBlue, T.activeGreen, "#FBBF24"];
  const show = Math.min(count, 4);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "flex" }}>
        {Array.from({ length: show }).map((_, i) => (
          <div key={i} style={{
            width: 20, height: 20, borderRadius: "50%",
            background: colors[i % 4] + "30",
            border: `1.5px solid ${T.surface}`,
            marginLeft: i ? -6 : 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 7, fontWeight: 800, color: colors[i % 4],
            fontFamily: "Poppins, sans-serif",
          }}>J</div>
        ))}
      </div>
      {count > 4 && (
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 11, color: T.textMuted }}>
          +{count - 4}
        </span>
      )}
    </div>
  );
}

function MetaRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Icon n={icon} s={12} c={T.textMuted} />
      <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: T.textSecond }}>
        {text}
      </span>
    </div>
  );
}

function EventCard({ event, onManage, onView }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hov ? T.pink + "66" : T.border}`,
        borderRadius: 14,
        overflow: "hidden",
        flex: "1 1 280px",
        minWidth: 280,
        maxWidth: 360,
        display: "flex",
        flexDirection: "column",
        transition: "border-color .2s, transform .2s, box-shadow .2s",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? `0 16px 48px rgba(255,45,120,0.12)` : "none",
      }}
    >
      {/* ── Top badge row */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 12px 8px",
      }}>
        <Badge status={event.status} />
        <span style={{
          fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 11,
          color: T.pink, letterSpacing: "0.06em",
        }}>
          {event.points_reward} PTS
        </span>
      </div>

      {/* ── Image */}
      <EventImage url={event.image_link} height={160} />

      {/* ── Body */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* Title + category */}
        <div>
          <p style={{ margin: "0 0 2px", fontFamily: "'Poppins', sans-serif", fontSize: 10.5, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {event.categoryLabel || event.category}
          </p>
          <h3 style={{ margin: 0, fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15.5, color: T.textPrimary, lineHeight: 1.25 }}>
            {event.title}
          </h3>
        </div>

        {/* Meta rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <MetaRow icon="cal" text={`${fmtDate(event.start_date)} — ${fmtDate(event.end_date)}`} />
          <MetaRow icon="pin" text={event.location || "Online"} />
          {event.time && <MetaRow icon="clock" text={event.time} />}
        </div>

        {/* Entries + progress */}
        <ProgressBar count={event.entry_count} max={event.max_entries} />

        {/* Judge avatars */}
        <JudgeAvatars count={event.judges} />
      </div>

      {/* ── Action row */}
      <div style={{ display: "flex", borderTop: `1px solid ${T.border}` }}>
        <button
          onClick={onView}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            background: "none", border: "none", borderRight: `1px solid ${T.border}`,
            padding: "12px 0", cursor: "pointer", color: T.textSecond,
            fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 500,
            transition: "all .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textPrimary; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = T.textSecond; }}
        >
          <Icon n="eye" s={13} c="currentColor" /> View Details
        </button>
        <button
          onClick={onManage}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            background: T.pink, border: "none",
            padding: "12px 0", cursor: "pointer", color: "#fff",
            fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 700,
            transition: "opacity .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          <Icon n="gear" s={13} c="#fff" /> Manage
        </button>
      </div>
    </div>
  );
}

export default EventCard;