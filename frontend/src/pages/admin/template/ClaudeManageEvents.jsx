import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg:          "#0D0D0D",
  surface:     "#161616",
  surfaceHi:   "#1F1F1F",
  surfaceBord: "#252525",
  border:      "#2A2A2A",
  borderHi:    "#383838",
  pink:        "#FF2D78",
  pinkDim:     "rgba(255,45,120,0.12)",
  pinkBorder:  "rgba(255,45,120,0.3)",
  text:        "#F0F0F0",
  textSec:     "#909090",
  textMuted:   "#555555",
  green:       "#22C55E",
  greenBg:     "#052512",
  blue:        "#60A5FA",
  blueBg:      "#0A1628",
  amber:       "#FBBF24",
  amberBg:     "#1C1000",
  red:         "#F87171",
  redBg:       "#200B0B",
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS / SEED DATA
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "sheisdesign_events";

const CATEGORIES = ["Branding", "Motion", "UI/UX", "Typography", "Illustration", "Packaging", "Photography", "Web Design", "Other"];
const STATUSES   = ["OPEN", "DRAFT", "CLOSED", "UPCOMING"];

const SEED_EVENTS = [
  {
    EventID: "evt-001",
    title: "Brand Identity Challenge",
    start_date: "2026-03-12",
    end_date: "2026-03-10",
    entry_count: 84,
    description: "A comprehensive brand identity challenge where participants design a full visual identity system for a fictional female-led startup. Includes logo, colour palette, typography, and brand guidelines.",
    max_entries: 120,
    category: "Branding",
    points_reward: 500,
    status: "OPEN",
    image_link: "",
    submissions: 72,
  },
  {
    EventID: "evt-002",
    title: "Motion Design Bootcamp",
    start_date: "2026-03-20",
    end_date: "2026-03-18",
    entry_count: 41,
    description: "An intensive motion design bootcamp focused on creating animated brand assets. Participants will produce a minimum of three animated pieces showcasing typography, transitions, and logo animation.",
    max_entries: 80,
    category: "Motion",
    points_reward: 300,
    status: "OPEN",
    image_link: "",
    submissions: 28,
  },
  {
    EventID: "evt-003",
    title: "UI/UX Hackathon 2026",
    start_date: "2026-04-05",
    end_date: "2026-04-03",
    entry_count: 112,
    description: "A 48-hour hackathon challenging participants to redesign a real app experience for accessibility and inclusivity. Teams of up to three, judged on research depth, wireframes, and prototype fidelity.",
    max_entries: 150,
    category: "UI/UX",
    points_reward: 750,
    status: "OPEN",
    image_link: "",
    submissions: 95,
  },
  {
    EventID: "evt-004",
    title: "Typography Sprint",
    start_date: "2026-04-18",
    end_date: "2026-04-15",
    entry_count: 29,
    description: "A focused sprint on editorial typography — participants design a double-page spread for a fictional design magazine. Emphasis on hierarchy, grid systems, and expressive type pairing.",
    max_entries: 60,
    category: "Typography",
    points_reward: 200,
    status: "DRAFT",
    image_link: "",
    submissions: 0,
  },
  {
    EventID: "evt-005",
    title: "Illustration Open Brief",
    start_date: "2026-05-02",
    end_date: "2026-04-28",
    entry_count: 67,
    description: "An open illustration brief celebrating African femininity and identity. Participants submit a single-page editorial illustration inspired by the theme 'She Leads'. Any medium or style accepted.",
    max_entries: 100,
    category: "Illustration",
    points_reward: 400,
    status: "OPEN",
    image_link: "",
    submissions: 51,
  },
  {
    EventID: "evt-006",
    title: "Packaging Design Sprint",
    start_date: "2026-05-15",
    end_date: "2026-05-12",
    entry_count: 53,
    description: "Participants design sustainable packaging for a female-founded skincare brand. Deliverables include front, back, and side panel designs plus a 3D mockup. Judged on sustainability, aesthetics, and hierarchy.",
    max_entries: 75,
    category: "Packaging",
    points_reward: 350,
    status: "OPEN",
    image_link: "",
    submissions: 39,
  },
  {
    EventID: "evt-007",
    title: "Annual Design Awards 2025",
    start_date: "2025-10-14",
    end_date: "2025-10-10",
    entry_count: 203,
    description: "The flagship annual awards celebrating the best work submitted across all ShelsDesign events throughout 2025. All eligible participants are automatically entered based on their highest-scoring submission of the year.",
    max_entries: 300,
    category: "Other",
    points_reward: 1000,
    status: "CLOSED",
    image_link: "",
    submissions: 187,
  },
  {
    EventID: "evt-008",
    title: "Poster Design Challenge",
    start_date: "2025-09-05",
    end_date: "2025-09-03",
    entry_count: 76,
    description: "A bold poster design challenge with the theme 'Future Female'. Participants submit an A2 print-ready poster that communicates a message of empowerment through strong visual language and typography.",
    max_entries: 100,
    category: "Illustration",
    points_reward: 250,
    status: "CLOSED",
    image_link: "",
    submissions: 69,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_EVENTS;
}

function saveEvents(events) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); } catch {}
}

function genId() {
  return "evt-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function fmtDate(d) {
  if (!d) return "—";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
  } catch { return d; }
}

const STATUS_STYLE = {
  OPEN:     { bg: T.greenBg,  color: T.green,  dot: T.green  },
  DRAFT:    { bg: "#1A1A1A",  color: T.textSec,dot: T.textMuted },
  CLOSED:   { bg: T.redBg,   color: T.red,    dot: T.red    },
  UPCOMING: { bg: T.blueBg,  color: T.blue,   dot: T.blue   },
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICONS
// ─────────────────────────────────────────────────────────────────────────────
function Ic({ n, s = 16, c = "currentColor" }) {
  const paths = {
    cal:    <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    users:  <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    file:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    plus:   <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:   <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:  <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    eye:    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    sort:   <><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="10" y2="18"/></>,
    close:  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    back:   <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4H4a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4"/><path d="M17 4h3a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4"/><path d="M7 4h10v8a5 5 0 0 1-10 0V4z"/></>,
    img:    <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></>,
    tag:    <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    star:   <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c}
      strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[n]}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────
function Badge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.DRAFT;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color, borderRadius: 20,
      padding: "3px 10px", fontSize: 11, fontWeight: 700,
      fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.07em",
      border: `1px solid ${s.color}22`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL SHELL
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ onClose, title, children, wide }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 16, width: "100%", maxWidth: wide ? 780 : 580,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: "modalIn 0.2s ease",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: `1px solid ${T.border}`,
          position: "sticky", top: 0, background: T.surface, zIndex: 1,
        }}>
          <h2 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: T.text }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            background: T.surfaceHi, border: "none", borderRadius: 8, cursor: "pointer",
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            color: T.textSec, transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.redBg; e.currentTarget.style.color = T.red; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textSec; }}
          >
            <Ic n="close" s={15} c="currentColor" />
          </button>
        </div>
        {children}
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(16px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT FORM (create + edit)
// ─────────────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  title: "", start_date: "", end_date: "", description: "",
  max_entries: "", category: "Branding", points_reward: "",
  status: "DRAFT", image_link: "", entry_count: 0, submissions: 0,
};

function Field({ label, required, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.textSec, letterSpacing: "0.07em", textTransform: "uppercase" }}>
        {label}{required && <span style={{ color: T.pink }}> *</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 11, color: T.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{hint}</span>}
    </div>
  );
}

const inputStyle = {
  background: T.surfaceHi, border: `1px solid ${T.border}`, borderRadius: 8,
  padding: "10px 14px", color: T.text,
  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
  outline: "none", width: "100%", boxSizing: "border-box",
  transition: "border-color 0.15s",
};

function EventForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Title is required";
    if (!form.start_date)         e.start_date  = "Start date is required";
    if (!form.end_date)           e.end_date    = "Deadline is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.max_entries || isNaN(form.max_entries) || +form.max_entries < 1) e.max_entries = "Enter a valid number";
    if (!form.points_reward || isNaN(form.points_reward) || +form.points_reward < 0) e.points_reward = "Enter a valid number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      ...form,
      max_entries: +form.max_entries,
      points_reward: +form.points_reward,
      entry_count: form.entry_count || 0,
      submissions: form.submissions || 0,
    });
  };

  const inp = (k, extra = {}) => ({
    ...inputStyle, ...extra,
    value: form[k] || "",
    onChange: e => set(k, e.target.value),
    onFocus: e => { e.target.style.borderColor = T.pink; },
    onBlur:  e => { e.target.style.borderColor = errors[k] ? T.red : T.border; },
    style: { ...inputStyle, ...extra, borderColor: errors[k] ? T.red : T.border },
  });

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <Field label="Event Title" required>
            <input type="text" placeholder="e.g. Brand Identity Challenge" {...inp("title")} />
            {errors.title && <span style={{ fontSize: 11, color: T.red }}>{errors.title}</span>}
          </Field>
        </div>

        <Field label="Start Date" required>
          <input type="date" {...inp("start_date")} />
          {errors.start_date && <span style={{ fontSize: 11, color: T.red }}>{errors.start_date}</span>}
        </Field>

        <Field label="Submission Deadline" required>
          <input type="date" {...inp("end_date")} />
          {errors.end_date && <span style={{ fontSize: 11, color: T.red }}>{errors.end_date}</span>}
        </Field>

        <Field label="Category" required>
          <select {...inp("category")} style={{ ...inputStyle, borderColor: T.border, appearance: "none" }}>
            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: T.surfaceHi }}>{c}</option>)}
          </select>
        </Field>

        <Field label="Status" required>
          <select {...inp("status")} style={{ ...inputStyle, borderColor: T.border, appearance: "none" }}>
            {STATUSES.map(s => <option key={s} value={s} style={{ background: T.surfaceHi }}>{s}</option>)}
          </select>
        </Field>

        <Field label="Max Entries" required>
          <input type="number" min="1" placeholder="e.g. 100" {...inp("max_entries")} />
          {errors.max_entries && <span style={{ fontSize: 11, color: T.red }}>{errors.max_entries}</span>}
        </Field>

        <Field label="Points Reward" required>
          <input type="number" min="0" placeholder="e.g. 500" {...inp("points_reward")} />
          {errors.points_reward && <span style={{ fontSize: 11, color: T.red }}>{errors.points_reward}</span>}
        </Field>

        <div style={{ gridColumn: "1/-1" }}>
          <Field label="Description" required>
            <textarea
              rows={4}
              placeholder="Describe the event, rules, deliverables..."
              {...inp("description")}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            />
            {errors.description && <span style={{ fontSize: 11, color: T.red }}>{errors.description}</span>}
          </Field>
        </div>

        <div style={{ gridColumn: "1/-1" }}>
          <Field label="Image / Banner URL" hint="Optional — paste a URL to a cover image">
            <input type="url" placeholder="https://..." {...inp("image_link")} />
          </Field>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
        <button onClick={onClose} style={{
          background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
          padding: "10px 20px", color: T.textSec, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.text; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;   e.currentTarget.style.color = T.textSec; }}
        >
          Cancel
        </button>
        <button onClick={handleSubmit} style={{
          background: T.pink, border: "none", borderRadius: 8,
          padding: "10px 24px", color: "#fff", cursor: "pointer",
          fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700,
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          {initial ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM DELETE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmDelete({ event, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose} title="Delete Event">
      <div style={{ padding: 24 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSec, lineHeight: 1.6, marginBottom: 24 }}>
          Are you sure you want to delete <strong style={{ color: T.text }}>{event.title}</strong>? This action cannot be undone and will permanently remove the event.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
            padding: "10px 20px", color: T.textSec, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            background: T.redBg, border: `1px solid ${T.red}33`, borderRadius: 8,
            padding: "10px 20px", color: T.red, cursor: "pointer",
            fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700,
          }}>Delete Event</button>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT DETAIL VIEW
// ─────────────────────────────────────────────────────────────────────────────
function EventDetail({ event, onBack, onEdit }) {
  const s = STATUS_STYLE[event.status] || STATUS_STYLE.DRAFT;
  const progress = event.max_entries > 0 ? Math.min(100, Math.round((event.entry_count / event.max_entries) * 100)) : 0;

  return (
    <div style={{ padding: "32px", maxWidth: 860, margin: "0 auto" }}>
      {/* Back */}
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
        cursor: "pointer", color: T.textSec, fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        padding: 0, marginBottom: 28, transition: "color 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.color = T.text}
      onMouseLeave={e => e.currentTarget.style.color = T.textSec}
      >
        <Ic n="back" s={16} c="currentColor" /> Back to Events
      </button>

      {/* Hero banner */}
      <div style={{
        borderRadius: 16, overflow: "hidden", marginBottom: 28, position: "relative",
        height: 200, background: event.image_link
          ? `url(${event.image_link}) center/cover`
          : `linear-gradient(135deg, ${T.pinkDim}, ${T.surfaceBord})`,
        border: `1px solid ${T.border}`,
        display: "flex", alignItems: "flex-end",
      }}>
        <div style={{
          width: "100%", padding: "24px",
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <Badge status={event.status} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textSec, background: T.surfaceHi, borderRadius: 20, padding: "3px 10px" }}>
              {event.category}
            </span>
          </div>
          <h1 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 28, color: "#fff" }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* ID & actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Event ID: </span>
          <code style={{ fontFamily: "monospace", fontSize: 12, color: T.pink, background: T.pinkDim, borderRadius: 4, padding: "2px 8px" }}>
            {event.EventID}
          </code>
        </div>
        <button onClick={onEdit} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: T.pink, border: "none", borderRadius: 8,
          padding: "9px 18px", color: "#fff", cursor: "pointer",
          fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13,
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <Ic n="edit" s={14} c="#fff" /> Edit Event
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { icon: "users", label: "Participants", value: event.entry_count },
          { icon: "file",  label: "Submissions",  value: event.submissions || 0 },
          { icon: "star",  label: "Points",        value: event.points_reward },
          { icon: "users", label: "Max Entries",   value: event.max_entries },
        ].map(stat => (
          <div key={stat.label} style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
            padding: "16px 18px",
          }}>
            <div style={{ marginBottom: 8, color: T.pink }}><Ic n={stat.icon} s={16} c={T.pink} /></div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24, color: T.text, marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textSec }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: T.text }}>Registration Progress</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.pink, fontWeight: 700 }}>{progress}%</span>
        </div>
        <div style={{ height: 8, background: T.surfaceBord, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${T.pink}, #FF6BA8)`, borderRadius: 4, transition: "width 0.6s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted }}>{event.entry_count} registered</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted }}>{event.max_entries} max</span>
        </div>
      </div>

      {/* Dates + Description */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Ic n="cal" s={15} c={T.pink} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.06em" }}>Start Date</span>
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: T.text }}>{fmtDate(event.start_date)}</span>
        </div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Ic n="cal" s={15} c={T.amber} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.06em" }}>Submission Deadline</span>
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: T.text }}>{fmtDate(event.end_date)}</span>
        </div>
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 22px" }}>
        <h3 style={{ margin: "0 0 12px", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: T.text }}>Description</h3>
        <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSec, lineHeight: 1.75 }}>
          {event.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EVENTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ManageEvents() {
  const [events, setEvents]         = useState(() => loadEvents());
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilter]   = useState("ALL");
  const [sortBy, setSortBy]         = useState("date");
  const [modal, setModal]           = useState(null); // null | "create" | "edit" | "delete"
  const [activeEvent, setActive]    = useState(null);
  const [detailId, setDetailId]     = useState(null); // viewing single event

  // Persist on change
  useEffect(() => { saveEvents(events); }, [events]);

  const persist = useCallback((next) => {
    setEvents(next);
    saveEvents(next);
  }, []);

  // CRUD
  const handleCreate = (data) => {
    const newEvent = { ...data, EventID: genId() };
    persist([newEvent, ...events]);
    setModal(null);
  };

  const handleEdit = (data) => {
    persist(events.map(e => e.EventID === activeEvent.EventID ? { ...data, EventID: activeEvent.EventID } : e));
    setModal(null);
    if (detailId === activeEvent.EventID) {
      setEvents(prev => prev); // trigger re-render for detail view
    }
    setActive(null);
  };

  const handleDelete = () => {
    persist(events.filter(e => e.EventID !== activeEvent.EventID));
    if (detailId === activeEvent.EventID) setDetailId(null);
    setModal(null);
    setActive(null);
  };

  // Derived
  const open   = events.filter(e => e.status === "OPEN").length;
  const drafts = events.filter(e => e.status === "DRAFT").length;
  const closed = events.filter(e => e.status === "CLOSED").length;
  const totalP = events.reduce((s, e) => s + (e.entry_count || 0), 0);

  const filtered = events
    .filter(e => {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
    })
    .filter(e => filterStatus === "ALL" || e.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "date")         return new Date(b.start_date) - new Date(a.start_date);
      if (sortBy === "title")        return a.title.localeCompare(b.title);
      if (sortBy === "participants") return (b.entry_count || 0) - (a.entry_count || 0);
      return 0;
    });

  // Detail view
  const detailEvent = detailId ? events.find(e => e.EventID === detailId) : null;
  if (detailEvent) {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
        <div style={{ minHeight: "100vh", background: T.bg, color: T.text }}>
          <EventDetail
            event={detailEvent}
            onBack={() => setDetailId(null)}
            onEdit={() => { setActive(detailEvent); setModal("edit"); }}
          />
        </div>
        {modal === "edit" && activeEvent && (
          <Modal onClose={() => setModal(null)} title="Edit Event" wide>
            <EventForm initial={activeEvent} onSave={handleEdit} onClose={() => setModal(null)} />
          </Modal>
        )}
      </>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ padding: "32px 36px", maxWidth: 1080, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            Admin · Events
          </div>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
            <div>
              <h1 style={{ margin: "0 0 4px", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 34, color: T.text }}>
                Manage Events
              </h1>
              <p style={{ margin: 0, fontSize: 14, color: T.textSec }}>
                Create, edit, and manage ShelsDesign events.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, color: T.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                <Ic n="cal" s={14} c={T.textMuted} /> {events.length} events
              </span>
              <button
                onClick={() => setModal("create")}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: T.pink, border: "none", borderRadius: 10,
                  padding: "11px 22px", color: "#fff", cursor: "pointer",
                  fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <Ic n="plus" s={15} c="#fff" /> Create Event
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
            {[
              { icon: "cal",    label: "Open Events",        value: open,   accent: T.green },
              { icon: "file",   label: "Drafts",             value: drafts, accent: T.textSec },
              { icon: "cal",    label: "Closed Events",      value: closed, accent: T.red },
              { icon: "users",  label: "Total Participants", value: totalP, accent: T.pink },
            ].map(c => (
              <div key={c.label} style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 12, padding: "18px 20px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = c.accent + "55"}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
              >
                <div style={{ marginBottom: 10, color: c.accent }}><Ic n={c.icon} s={18} c={c.accent} /></div>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 28, color: T.text, marginBottom: 4 }}>{c.value}</div>
                <div style={{ fontSize: 12.5, color: T.textSec }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 220px" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textMuted }}>
                <Ic n="search" s={14} c={T.textMuted} />
              </span>
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: 36, borderColor: T.border }}
                onFocus={e => e.target.style.borderColor = T.pink}
                onBlur={e  => e.target.style.borderColor = T.border}
              />
            </div>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={e => setFilter(e.target.value)}
              style={{ ...inputStyle, width: 140, appearance: "none", borderColor: T.border, flex: "0 0 140px" }}
              onFocus={e => e.target.style.borderColor = T.pink}
              onBlur={e  => e.target.style.borderColor = T.border}
            >
              <option value="ALL">All Statuses</option>
              {STATUSES.map(s => <option key={s} value={s} style={{ background: T.surfaceHi }}>{s}</option>)}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ ...inputStyle, width: 160, appearance: "none", borderColor: T.border, flex: "0 0 160px" }}
              onFocus={e => e.target.style.borderColor = T.pink}
              onBlur={e  => e.target.style.borderColor = T.border}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="participants">Sort by Participants</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 120px 90px 90px 110px 200px",
              gap: 0, padding: "11px 20px",
              borderBottom: `1px solid ${T.border}`,
            }}>
              {["EVENT NAME", "DATE", "PARTICIPANTS", "SUBMISSIONS", "STATUS", "ACTIONS"].map(h => (
                <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: T.textMuted, letterSpacing: "0.1em", textAlign: h === "PARTICIPANTS" || h === "SUBMISSIONS" ? "center" : "left" }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: T.textMuted, fontSize: 14 }}>
                No events found. Try adjusting your search or filters.
              </div>
            ) : (
              filtered.map((ev, i) => (
                <div
                  key={ev.EventID}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 120px 90px 90px 110px 200px",
                    alignItems: "center",
                    padding: "14px 20px",
                    borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : "none",
                    transition: "background 0.12s",
                    cursor: "default",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surfaceHi}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  {/* Name + meta */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: T.text, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ev.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: T.textMuted }}>
                      {ev.points_reward} pts · Deadline {fmtDate(ev.end_date)} · {ev.category}
                    </div>
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: 13, color: T.textSec }}>{fmtDate(ev.start_date)}</div>

                  {/* Participants */}
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: T.textSec }}>
                      <Ic n="users" s={13} c={T.textMuted} /> {ev.entry_count || 0}
                    </span>
                  </div>

                  {/* Submissions */}
                  <div style={{ textAlign: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: T.textSec }}>
                      <Ic n="file" s={13} c={T.textMuted} /> {ev.submissions || 0}
                    </span>
                  </div>

                  {/* Status */}
                  <div><Badge status={ev.status} /></div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {/* View */}
                    <button
                      onClick={() => setDetailId(ev.EventID)}
                      aria-label={`View ${ev.title}`}
                      title="View"
                      style={{ display: "flex", alignItems: "center", gap: 5, background: T.surfaceBord, border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: T.textSec, fontSize: 12, fontWeight: 500, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.blueBg; e.currentTarget.style.color = T.blue; }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.surfaceBord; e.currentTarget.style.color = T.textSec; }}
                    >
                      <Ic n="eye" s={13} c="currentColor" /> View
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => { setActive(ev); setModal("edit"); }}
                      aria-label={`Edit ${ev.title}`}
                      title="Edit"
                      style={{ display: "flex", alignItems: "center", gap: 5, background: T.surfaceBord, border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: T.textSec, fontSize: 12, fontWeight: 500, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.text; }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.surfaceBord; e.currentTarget.style.color = T.textSec; }}
                    >
                      <Ic n="edit" s={13} c="currentColor" /> Edit
                    </button>

                    {/* Participants */}
                    <button
                      aria-label={`Participants for ${ev.title}`}
                      title="Participants"
                      style={{ display: "flex", alignItems: "center", gap: 5, background: T.surfaceBord, border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: T.textSec, fontSize: 12, fontWeight: 500, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.pinkDim; e.currentTarget.style.color = T.pink; }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.surfaceBord; e.currentTarget.style.color = T.textSec; }}
                    >
                      <Ic n="users" s={13} c="currentColor" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => { setActive(ev); setModal("delete"); }}
                      aria-label={`Delete ${ev.title}`}
                      title="Delete"
                      style={{ display: "flex", alignItems: "center", gap: 5, background: T.surfaceBord, border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: T.textSec, fontSize: 12, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.redBg; e.currentTarget.style.color = T.red; }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.surfaceBord; e.currentTarget.style.color = T.textSec; }}
                    >
                      <Ic n="trash" s={13} c="currentColor" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: 14, fontSize: 12, color: T.textMuted }}>
            Showing {filtered.length} of {events.length} events
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal === "create" && (
        <Modal onClose={() => setModal(null)} title="Create New Event" wide>
          <EventForm onSave={handleCreate} onClose={() => setModal(null)} />
        </Modal>
      )}

      {modal === "edit" && activeEvent && (
        <Modal onClose={() => { setModal(null); setActive(null); }} title="Edit Event" wide>
          <EventForm initial={activeEvent} onSave={handleEdit} onClose={() => { setModal(null); setActive(null); }} />
        </Modal>
      )}

      {modal === "delete" && activeEvent && (
        <ConfirmDelete
          event={activeEvent}
          onConfirm={handleDelete}
          onClose={() => { setModal(null); setActive(null); }}
        />
      )}
    </>
  );
}