import { useState, useEffect } from "react";
import { T, STATUS_STYLES } from "../../components/admin/theme";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "sheisdesign_events";

const CATEGORIES = [
  "Branding", "Motion", "UI/UX", "Typography",
  "Illustration", "Packaging", "Photography", "Web Design", "Other",
];
const STATUSES = ["OPEN", "DRAFT", "UPCOMING", "CLOSED"];
const STATUS_TABS = ["DRAFT", "UPCOMING", "OPEN", "CLOSED"];

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

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// ICON
// ─────────────────────────────────────────────────────────────────────────────
function Ic({ n, s = 16, c = "currentColor" }) {
  const paths = {
    plus:   <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    cal:    <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    users:  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    file:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    img:    <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></>,
    eye:    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    gear:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    edit:   <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:  <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    close:  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    lock:   <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    pin:    <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    clock:  <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    award:  <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      {paths[n]}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS BAR
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// JUDGE AVATARS
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE PLACEHOLDER / REAL IMAGE
// ─────────────────────────────────────────────────────────────────────────────
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
      <Ic n="img" s={28} c={T.textMuted} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL SHELL
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label={title}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.80)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        width: "100%",
        maxWidth: wide ? 780 : 520,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 40px 100px rgba(0,0,0,.75)",
        animation: "mIn .2s cubic-bezier(.34,1.56,.64,1)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", borderBottom: `1px solid ${T.border}`,
          position: "sticky", top: 0, background: T.surface, zIndex: 2,
          borderRadius: "16px 16px 0 0",
        }}>
          <h2 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 17, color: T.textPrimary }}>
            {title}
          </h2>
          <button onClick={onClose}
            aria-label="Close"
            style={{
              background: T.surfaceHi, border: "none", borderRadius: 8, cursor: "pointer",
              width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
              color: T.textSecond, transition: "all .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.closedBg; e.currentTarget.style.color = T.closedRed; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textSecond; }}
          >
            <Ic n="close" s={14} c="currentColor" />
          </button>
        </div>
        {children}
      </div>
      <style>{`@keyframes mIn{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT FORM
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "", start_date: "", end_date: "", description: "",
  max_entries: "", category: "Branding", points_reward: "",
  status: "DRAFT", image_link: "", location: "Online", time: "10:00",
  entry_count: 0, submissions: 0, judges: 0, categoryLabel: "",
};

const inpBase = {
  background: T.surfaceHi,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "10px 13px",
  color: T.textPrimary,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13.5,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color .15s",
};

function FormField({ label, required, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
        color: T.textSecond, letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        {label}
        {required && <span style={{ color: T.pink }}> *</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: T.closedRed }}>{error}</span>}
    </div>
  );
}

function EventForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())                                    e.title        = "Required";
    if (!form.start_date)                                      e.start_date   = "Required";
    if (!form.end_date)                                        e.end_date     = "Required";
    if (!form.description.trim())                              e.description  = "Required";
    if (!form.max_entries || +form.max_entries < 1)            e.max_entries  = "Must be ≥ 1";
    if (form.points_reward === "" || +form.points_reward < 0)  e.points_reward = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = () => {
    if (!validate()) return;
    onSave({
      ...form,
      max_entries: +form.max_entries,
      points_reward: +form.points_reward,
      categoryLabel: form.categoryLabel || form.category,
    });
  };

  const bindInput = (key, type = "text", placeholder = "") => ({
    type,
    placeholder,
    value: form[key] ?? "",
    onChange: e => set(key, e.target.value),
    style: { ...inpBase, borderColor: errors[key] ? T.closedRed : T.border },
    onFocus: e => { e.target.style.borderColor = T.pink; },
    onBlur:  e => { e.target.style.borderColor = errors[key] ? T.closedRed : T.border; },
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        <div style={{ gridColumn: "1/-1" }}>
          <FormField label="Event Title" required error={errors.title}>
            <input {...bindInput("title", "text", "e.g. Brand Identity Challenge")} />
          </FormField>
        </div>

        <FormField label="Start Date" required error={errors.start_date}>
          <input {...bindInput("start_date", "date")} />
        </FormField>

        <FormField label="Submission Deadline" required error={errors.end_date}>
          <input {...bindInput("end_date", "date")} />
        </FormField>

        <FormField label="Category" required>
          <select
            value={form.category}
            onChange={e => set("category", e.target.value)}
            style={{ ...inpBase, appearance: "none" }}
            onFocus={e => { e.target.style.borderColor = T.pink; }}
            onBlur={e  => { e.target.style.borderColor = T.border; }}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c} style={{ background: T.surfaceHi }}>{c}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Status" required>
          <select
            value={form.status}
            onChange={e => set("status", e.target.value)}
            style={{ ...inpBase, appearance: "none" }}
            onFocus={e => { e.target.style.borderColor = T.pink; }}
            onBlur={e  => { e.target.style.borderColor = T.border; }}
          >
            {STATUSES.map(s => (
              <option key={s} value={s} style={{ background: T.surfaceHi }}>{s}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Max Entries" required error={errors.max_entries}>
          <input {...bindInput("max_entries", "number", "e.g. 100")} />
        </FormField>

        <FormField label="Points Reward" required error={errors.points_reward}>
          <input {...bindInput("points_reward", "number", "e.g. 500")} />
        </FormField>

        <FormField label="Location">
          <input {...bindInput("location", "text", "e.g. Online")} />
        </FormField>

        <FormField label="Time">
          <input {...bindInput("time", "time")} />
        </FormField>

        <div style={{ gridColumn: "1/-1" }}>
          <FormField label="Description" required error={errors.description}>
            <textarea
              rows={4}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Describe the event, rules, and deliverables..."
              style={{
                ...inpBase,
                resize: "vertical",
                lineHeight: 1.6,
                borderColor: errors.description ? T.closedRed : T.border,
              }}
              onFocus={e => { e.target.style.borderColor = T.pink; }}
              onBlur={e  => { e.target.style.borderColor = errors.description ? T.closedRed : T.border; }}
            />
          </FormField>
        </div>

        <div style={{ gridColumn: "1/-1" }}>
          <FormField label="Banner Image URL">
            <input {...bindInput("image_link", "url", "https://...")} />
          </FormField>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
        <button onClick={onClose}
          style={{
            background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
            padding: "10px 20px", color: T.textSecond, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, transition: "all .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#3A3A3A"; e.currentTarget.style.color = T.textPrimary; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;  e.currentTarget.style.color = T.textSecond; }}
        >
          Cancel
        </button>
        <button onClick={submit}
          style={{
            background: T.pink, border: "none", borderRadius: 8,
            padding: "10px 24px", color: "#fff", cursor: "pointer",
            fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, transition: "opacity .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          {initial ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM DELETE
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmDelete({ event, onConfirm, onClose }) {
  return (
    <Modal title="Delete Event" onClose={onClose}>
      <div style={{ padding: 24 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSecond, lineHeight: 1.7, marginBottom: 24 }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: T.textPrimary }}>{event.title}</strong>?
          This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose}
            style={{
              background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
              padding: "10px 20px", color: T.textSecond, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
            }}
          >Cancel</button>
          <button onClick={onConfirm}
            style={{
              background: T.closedBg, border: `1px solid ${T.closedRed}44`,
              borderRadius: 8, padding: "10px 20px", color: T.closedRed,
              cursor: "pointer", fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700,
            }}
          >Delete Event</button>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED CARD  (Live & Open row — tall card matching wireframe)
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedCard({ event, onManage, onView }) {
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
          <Ic n="eye" s={13} c="currentColor" /> View Details
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
          <Ic n="gear" s={13} c="#fff" /> Manage
        </button>
      </div>
    </div>
  );
}

// small meta row helper
function MetaRow({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <Ic n={icon} s={12} c={T.textMuted} />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textSecond }}>
        {text}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPACT CARD  (All Events grid — matches wireframe exactly)
// ─────────────────────────────────────────────────────────────────────────────
function CompactCard({ event, onEdit, onDelete, onView, onCloseEvent }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.surface,
        border: `1px solid ${hov ? T.borderHi || "#3A3A3A" : T.border}`,
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform .2s, box-shadow .2s, border-color .2s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,.35)" : "none",
      }}
    >
      {/* Image with status badge overlay */}
      <div style={{ position: "relative" }}>
        <EventImage url={event.image_link} height={100} />
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <Badge status={event.status} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <h3 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13.5, color: T.textPrimary, lineHeight: 1.3, flex: 1 }}>
            {event.title}
          </h3>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0, paddingTop: 2 }}>
            {event.categoryLabel || event.category}
          </span>
        </div>

        {/* Meta */}
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: 12, rowGap: 3 }}>
          {[
            { icon: "cal",   val: fmtDate(event.start_date) },
            { icon: "clock", val: event.time },
            { icon: "pin",   val: event.location },
          ].map(r => r.val && (
            <span key={r.icon} style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textSecond }}>
              <Ic n={r.icon} s={11} c={T.textMuted} /> {r.val}
            </span>
          ))}
        </div>

        {/* Entries */}
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textSecond, display: "flex", alignItems: "center", gap: 4 }}>
          <Ic n="users" s={11} c={T.textMuted} />
          {event.entry_count} / {event.max_entries} entries
        </span>

        {/* Thin progress */}
        <ProgressBar count={event.entry_count} max={event.max_entries} showLabel={false} />

        {/* Points + judges */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 12.5, color: T.pink }}>
            {event.points_reward} pts
          </span>
          {event.judges > 0 && (
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textMuted }}>
              · {event.judges} judge{event.judges !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{
        borderTop: `1px solid ${T.border}`,
        padding: "9px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Close / status label */}
        {event.status === "OPEN" ? (
          <button
            onClick={onCloseEvent}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "none", border: `1px solid ${T.border}`, borderRadius: 7,
              padding: "5px 11px", cursor: "pointer", color: T.textSecond,
              fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, fontWeight: 500,
              transition: "all .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.closedRed + "77"; e.currentTarget.style.color = T.closedRed; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecond; }}
          >
            <Ic n="lock" s={11} c="currentColor" /> Close Event
          </button>
        ) : (
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11.5, color: T.textMuted, fontStyle: "italic" }}>
            {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
          </span>
        )}

        {/* Icon buttons */}
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { n: "eye",   fn: onView,   hBg: T.upBg,      hC: T.upBlue       },
            { n: "edit",  fn: onEdit,   hBg: T.surfaceHi, hC: T.textPrimary  },
            { n: "trash", fn: onDelete, hBg: T.closedBg,  hC: T.closedRed    },
          ].map(btn => (
            <button
              key={btn.n}
              onClick={btn.fn}
              aria-label={btn.n}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: T.textMuted, padding: 6, borderRadius: 6,
                display: "flex", transition: "all .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = btn.hBg; e.currentTarget.style.color = btn.hC; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none";  e.currentTarget.style.color = T.textMuted; }}
            >
              <Ic n={btn.n} s={14} c="currentColor" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT DETAIL (single view)
// ─────────────────────────────────────────────────────────────────────────────
function EventDetail({ event, onBack, onEdit }) {
  const p = calcPct(event.entry_count, event.max_entries);
  return (
    <div style={{ padding: "32px 36px", maxWidth: 860, margin: "0 auto" }}>
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
          cursor: "pointer", color: T.textSecond, fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, padding: 0, marginBottom: 28, transition: "color .15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = T.textPrimary; }}
        onMouseLeave={e => { e.currentTarget.style.color = T.textSecond; }}
      >
        ← Back to Events
      </button>

      {/* Banner */}
      <div style={{
        borderRadius: 14, overflow: "hidden", marginBottom: 24, height: 200,
        background: event.image_link
          ? `url(${event.image_link}) center/cover`
          : `linear-gradient(135deg, ${T.pinkDim}, #1a1a1a)`,
        border: `1px solid ${T.border}`,
        display: "flex", alignItems: "flex-end",
      }}>
        <div style={{ width: "100%", padding: 24, background: "linear-gradient(to top, rgba(0,0,0,.85), transparent)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <Badge status={event.status} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, color: T.textSecond,
              background: T.surfaceHi, borderRadius: 4, padding: "3px 8px",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {event.categoryLabel || event.category}
            </span>
          </div>
          <h1 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 28, color: "#fff" }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* ID + Edit */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <code style={{ fontFamily: "monospace", fontSize: 12, color: T.pink, background: T.pinkDim, borderRadius: 4, padding: "3px 10px" }}>
          {event.EventID}
        </code>
        <button
          onClick={onEdit}
          style={{
            display: "flex", alignItems: "center", gap: 7, background: T.pink, border: "none",
            borderRadius: 8, padding: "9px 18px", color: "#fff", cursor: "pointer",
            fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, transition: "opacity .15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          <Ic n="edit" s={13} c="#fff" /> Edit Event
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Participants", value: event.entry_count,    icon: "users" },
          { label: "Submissions",  value: event.submissions||0, icon: "file"  },
          { label: "Points",       value: event.points_reward,  icon: "award" },
          { label: "Max Entries",  value: event.max_entries,    icon: "users" },
        ].map(st => (
          <div key={st.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px" }}>
            <Ic n={st.icon} s={15} c={T.pink} />
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: T.textPrimary, margin: "6px 0 2px" }}>
              {st.value}
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textSecond }}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.textPrimary }}>Registration Progress</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.pink, fontWeight: 700 }}>{p}%</span>
        </div>
        <div style={{ height: 7, background: T.surfaceHi, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${p}%`, height: "100%", background: `linear-gradient(90deg,${T.pink}88,${T.pink})`, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted }}>{event.entry_count} registered</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted }}>{event.max_entries} max</span>
        </div>
      </div>

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        {[
          { label: "Start Date",  val: fmtDate(event.start_date) },
          { label: "Deadline",    val: fmtDate(event.end_date)   },
          { label: "Location",    val: event.location || "Online"},
          { label: "Time",        val: event.time || "—"         },
        ].map(it => (
          <div key={it.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              {it.label}
            </div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: T.textPrimary }}>
              {it.val}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 18px" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: T.textPrimary, marginBottom: 10 }}>Description</div>
        <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSecond, lineHeight: 1.75 }}>
          {event.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ManageEvents() {
  const [events,  setEvents]  = useState(() => loadEvents());
  const [search,  setSearch]  = useState("");
  const [tab,     setTab]     = useState("OPEN");
  const [modal,   setModal]   = useState(null); // "create"|"edit"|"delete"
  const [active,  setActive]  = useState(null);
  const [detailId,setDetail]  = useState(null);

  useEffect(() => { saveEvents(events); }, [events]);

  const persist = next => { setEvents(next); saveEvents(next); };

  const handleCreate = data  => { persist([{ ...data, EventID: genId() }, ...events]); setModal(null); };
  const handleEdit   = data  => { persist(events.map(e => e.EventID === active.EventID ? { ...data, EventID: active.EventID } : e)); setModal(null); setActive(null); };
  const handleDelete = ()    => { persist(events.filter(e => e.EventID !== active.EventID)); if (detailId === active.EventID) setDetail(null); setModal(null); setActive(null); };
  const handleClose  = ev   => persist(events.map(e => e.EventID === ev.EventID ? { ...e, status: "CLOSED" } : e));

  const liveOpen  = events.filter(e => e.status === "OPEN").slice(0, 3);
  const filtered  = events.filter(e => e.status === tab && e.title.toLowerCase().includes(search.toLowerCase()));
  const tabCounts = STATUS_TABS.reduce((a, s) => { a[s] = events.filter(e => e.status === s).length; return a; }, {});
  const detailEv  = detailId ? events.find(e => e.EventID === detailId) : null;

  // ── Detail view
  if (detailEv) return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: T.bg, color: T.textPrimary }}>
        <EventDetail
          event={detailEv}
          onBack={() => setDetail(null)}
          onEdit={() => { setActive(detailEv); setModal("edit"); }}
        />
      </div>
      {modal === "edit" && active && (
        <Modal title="Edit Event" onClose={() => setModal(null)} wide>
          <EventForm initial={active} onSave={handleEdit} onClose={() => setModal(null)} />
        </Modal>
      )}
    </>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${T.surface}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
        @keyframes fu { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes ping { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(1.5); } }
        .fu { animation: fu .35s ease both; }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.bg, color: T.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ padding: "30px 32px", maxWidth: 1160, margin: "0 auto" }}>

          {/* ── Page header */}
          <div className="fu" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 11, color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 18, height: 1, background: T.textMuted, display: "inline-block" }} />
                Admin · Events
              </p>
              <h1 style={{ margin: "0 0 4px", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 32, color: T.textPrimary, letterSpacing: "-0.02em" }}>
                Manage Events
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: T.textSecond }}>
                Create, manage and monitor all SheIsDesign events.
              </p>
            </div>

            {/* Search + CTA */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Ic n="search" s={14} c={T.textMuted} />
                </span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search events..."
                  aria-label="Search events"
                  style={{
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 9, padding: "10px 14px 10px 36px",
                    color: T.textPrimary, fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13.5, outline: "none", width: 220, transition: "border-color .15s",
                  }}
                  onFocus={e => { e.target.style.borderColor = T.pink; }}
                  onBlur={e  => { e.target.style.borderColor = T.border; }}
                />
              </div>
              <button
                onClick={() => setModal("create")}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: T.pink, border: "none", borderRadius: 9,
                  padding: "10px 20px", color: "#fff", cursor: "pointer",
                  fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13.5,
                  transition: "opacity .15s", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                <Ic n="plus" s={15} c="#fff" /> Create Event
              </button>
            </div>
          </div>

          {/* ── Live & Open */}
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

          {/* ── All Events */}
          <section className="fu" style={{ animationDelay: "120ms" }} aria-label="All events">
            {/* Section header + tabs */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: T.textPrimary }}>
                  All Events
                </span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, background: T.surfaceHi, borderRadius: 20, padding: "2px 9px" }}>
                  {events.length}
                </span>
              </div>

              {/* Status tabs */}
              <div style={{ display: "flex", gap: 6 }}>
                {STATUS_TABS.map(s => {
                  const isActive = s === tab;
                  const sc = STATUS_STYLES[s] || {};
                  return (
                    <button
                      key={s}
                      onClick={() => setTab(s)}
                      style={{
                        background: isActive ? sc.bg : "none",
                        border: `1px solid ${isActive ? sc.color + "55" : T.border}`,
                        borderRadius: 8, padding: "6px 14px", cursor: "pointer",
                        color: isActive ? sc.color : T.textSecond,
                        fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                        fontWeight: isActive ? 700 : 400,
                        transition: "all .15s",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textPrimary; } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = T.textSecond; } }}
                    >
                      {s}
                      {tabCounts[s] > 0 && (
                        <span style={{
                          fontSize: 10, fontWeight: 700,
                          background: isActive ? sc.color + "33" : T.surfaceHi,
                          color: isActive ? sc.color : T.textMuted,
                          borderRadius: 20, padding: "1px 6px",
                        }}>
                          {tabCounts[s]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <div style={{ padding: "60px 0", textAlign: "center", color: T.textMuted, fontSize: 14 }}>
                No {tab.toLowerCase()} events{search ? ` matching "${search}"` : ""}.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {filtered.map(ev => (
                  <CompactCard
                    key={ev.EventID}
                    event={ev}
                    onView={() => setDetail(ev.EventID)}
                    onEdit={() => { setActive(ev); setModal("edit"); }}
                    onDelete={() => { setActive(ev); setModal("delete"); }}
                    onCloseEvent={() => handleClose(ev)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Modals */}
      {modal === "create" && (
        <Modal title="Create New Event" onClose={() => setModal(null)} wide>
          <EventForm onSave={handleCreate} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "edit" && active && (
        <Modal title="Edit Event" onClose={() => { setModal(null); setActive(null); }} wide>
          <EventForm initial={active} onSave={handleEdit} onClose={() => { setModal(null); setActive(null); }} />
        </Modal>
      )}
      {modal === "delete" && active && (
        <ConfirmDelete event={active} onConfirm={handleDelete} onClose={() => { setModal(null); setActive(null); }} />
      )}
    </>
  );
}