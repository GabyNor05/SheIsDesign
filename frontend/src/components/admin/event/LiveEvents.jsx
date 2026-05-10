import { useState } from "react";
import { T, STATUS_STYLES } from "../theme";
import {Eye, Gear, Image} from "@phosphor-icons/react"
import EventForm from "./EventForm"
import Modal from "../Modal"

const STORAGE_KEY = "sheisdesign_events";

const SEED_EVENTS = [
  {
    EventID: "evt-001",
    title: "Brand Identity Challenge",
    category: "Branding",
    categoryLabel: "Brand Identity",
    start_date: "2025-03-12",
    end_date: "2025-03-10",
    entry_count: 84,
    max_entries: 92,
    description:
      "A comprehensive brand identity challenge where participants design a full visual identity system for a fictional female-led startup. Includes logo, colour palette, typography, and brand guidelines.",
    points_reward: 500,
    status: "OPEN",
    image_link: "",
    submissions: 66,
    location: "Online",
    time: "09:00",
    judges: 6,
  },
  {
    EventID: "evt-002",
    title: "Motion Design Bootcamp",
    category: "Motion",
    categoryLabel: "Motion Design",
    start_date: "2025-03-20",
    end_date: "2025-03-18",
    entry_count: 41,
    max_entries: 60,
    description:
      "An intensive motion design bootcamp focused on animated brand assets, type animation, and logo reveals.",
    points_reward: 300,
    status: "OPEN",
    image_link: "",
    submissions: 28,
    location: "Online",
    time: "10:00",
    judges: 3,
  },
  {
    EventID: "evt-003",
    title: "UI/UX Hackathon 2026",
    category: "UI/UX",
    categoryLabel: "UX Design",
    start_date: "2025-04-05",
    end_date: "2025-04-03",
    entry_count: 61,
    max_entries: 75,
    description:
      "A 48-hour hackathon challenging participants to redesign a real app for accessibility and inclusivity.",
    points_reward: 750,
    status: "OPEN",
    image_link: "",
    submissions: 47,
    location: "Wits University, Johannesburg",
    time: "08:00",
    judges: 4,
  },
  {
    EventID: "evt-004",
    title: "Illustration Open Brief",
    category: "Illustration",
    categoryLabel: "Illustration",
    start_date: "2025-05-02",
    end_date: "2025-04-28",
    entry_count: 67,
    max_entries: 80,
    description:
      "An open illustration brief celebrating African femininity. Submit a single editorial illustration inspired by 'She Leads'.",
    points_reward: 400,
    status: "OPEN",
    image_link: "",
    submissions: 51,
    location: "Online",
    time: "09:00",
    judges: 3,
  },
  {
    EventID: "evt-005",
    title: "Typography Sprint",
    category: "Typography",
    categoryLabel: "Typography",
    start_date: "2025-04-18",
    end_date: "2025-04-15",
    entry_count: 29,
    max_entries: 60,
    description:
      "A focused sprint on editorial typography — design a double-page spread for a fictional design magazine.",
    points_reward: 200,
    status: "DRAFT",
    image_link: "",
    submissions: 0,
    location: "Online",
    time: "10:00",
    judges: 2,
  },
  {
    EventID: "evt-006",
    title: "Packaging Design Sprint",
    category: "Packaging",
    categoryLabel: "Packaging",
    start_date: "2025-05-15",
    end_date: "2025-05-12",
    entry_count: 0,
    max_entries: 75,
    description:
      "Design sustainable packaging for a female-founded skincare brand. Includes front, back, and side panels plus a 3D mockup.",
    points_reward: 350,
    status: "UPCOMING",
    image_link: "",
    submissions: 0,
    location: "Online",
    time: "10:00",
    judges: 2,
  },
  {
    EventID: "evt-007",
    title: "Annual Design Awards 2025",
    category: "Other",
    categoryLabel: "Awards",
    start_date: "2025-10-14",
    end_date: "2025-10-10",
    entry_count: 203,
    max_entries: 300,
    description:
      "The flagship annual awards celebrating the best work across all ShelsDesign events throughout 2025.",
    points_reward: 1000,
    status: "CLOSED",
    image_link: "",
    submissions: 187,
    location: "Online",
    time: "10:00",
    judges: 8,
  },
  {
    EventID: "evt-008",
    title: "Poster Design Challenge",
    category: "Illustration",
    categoryLabel: "Illustration",
    start_date: "2025-09-05",
    end_date: "2025-09-03",
    entry_count: 76,
    max_entries: 100,
    description:
      "A bold poster challenge themed 'Future Female'. Submit an A2 print-ready poster of empowerment.",
    points_reward: 250,
    status: "CLOSED",
    image_link: "",
    submissions: 69,
    location: "Online",
    time: "10:00",
    judges: 3,
  },
];


function loadEvents() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return SEED_EVENTS;
}
function saveEvents(evs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(evs)); } catch {}
}
function genId() { return "evt-" + Date.now().toString(36); }
function fmtDate(d) {
  if (!d) return "—";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("en-ZA", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return d; }
}
function calcPct(count, max) {
  return max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0;
}

function EventImage({ url, height = 180 }) {
  if (url) {
    return (
      <img src={url} alt=""
        style={{ width: "100%", height, objectFit: "cover", display: "block" }} />
    );
  }
  return (
    <div style={{
      width: "100%", height,
      background: T.surfaceHi,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <Image size={28} color={T.textMuted} />
    </div>
  );
}

function Badge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}40`,
      borderRadius: 4, padding: "3px 8px",
      fontSize: 10, fontWeight: 800,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.1em", textTransform: "uppercase",
    }}>
      {status}
    </span>
  );
}

function ProgressBar({ count, max, showLabel = true }) {
  const p = calcPct(count, max);
  return (
    <div>
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textSecond }}>
            {count} / {max} entries
          </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 700, color: p >= 80 ? T.pink : T.textSecond }}>
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
            fontFamily: "Syne, sans-serif",
          }}>J</div>
        ))}
      </div>
      {count > 4 && (
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted }}>
          +{count - 4}
        </span>
      )}
    </div>
  );
}

function MetaRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {icon && (
          <div style={{ width: 30, height: 30, borderRadius: 8, background: T.surfaceHi, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span aria-hidden="true">{icon}</span>
          </div>
        )}
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textSecond }}>
        {text}
      </span>
    </div>
  );
}

function FeaturedCard({ event, onManage, onView }) {
  const [hov, setHov] = useState(false);
  const [events, setEvents] = useState(null);
  

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
          fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 11,
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
          <p style={{ margin: "0 0 2px", fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {event.categoryLabel || event.category}
          </p>
          <h3 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15.5, color: T.textPrimary, lineHeight: 1.25 }}>
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
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
            transition: "all .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textPrimary; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = T.textSecond; }}
        >
          <Eye size={13} color="currentColor" /> View Details
        </button>
        <button
          onClick={onManage}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            background: T.pink, border: "none",
            padding: "12px 0", cursor: "pointer", color: "#fff",
            fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700,
            transition: "opacity .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          <Gear size={13} color="#fff" /> Manage
        </button>
      </div>
    </div>
  );
}

function LiveEvents(){
    const liveOpen  = events.filter(e => e.status === "OPEN").slice(0, 3);
    const [modal, setModal] = useState(null);
    const [events, setEvents] = useState(null);
    const persist = next => { setEvents(next); saveEvents(next); };
    const [active, setActive] = useState(null);
    const [detail, setDetail] = useState(null);

    const handleEdit   = data  => { persist(events.map(e => e.EventID === active.EventID ? { ...data, EventID: active.EventID } : e)); setModal(null); setActive(null); };

    return(
        <div>
            {liveOpen.length > 0 && (
            <section className="fu" style={{ marginBottom: 36, animationDelay: "60ms" }} aria-label="Live and open events">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: T.activeGreen, display: "inline-block",
                    animation: "ping 1.8s ease-in-out infinite",
                  }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 600, color: T.textSecond, letterSpacing: "0.06em" }}>
                    LIVE &amp; OPEN
                  </span>
                  <span style={{ background: T.activeBg, color: T.activeGreen, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>
                    {liveOpen.length}
                  </span>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.pink, fontWeight: 600 }}>
                  View all open
                </button>
              </div>

              <div style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
                {liveOpen.map(ev => (
                  <FeaturedCard
                    key={ev.EventID}
                    event={ev}
                    onView={() => setDetail(ev.EventID)}
                    onManage={() => { setActive(ev); setModal("edit"); }}
                  />
                ))}
              </div>
            </section>
          )}

          {modal === "edit" && active && (
        <Modal title="Edit Event" onClose={() => { setModal(null); setActive(null); }} wide>
          <EventForm initial={active} onSave={handleEdit} onClose={() => { setModal(null); setActive(null); }} />
        </Modal>
      )}
        </div>
    );
}

export default LiveEvents;