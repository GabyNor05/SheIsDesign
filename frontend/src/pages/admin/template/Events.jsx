import { useState, useEffect, useRef } from "react";
import "./Events.css";
import { eventService } from "../../../services/eventService";
import EventForm from "../../../components/admin/event/EventForm";
import AllEvents from "../../../components/admin/event/AllEvents";

const T = {
  bg:          "#0D0D0D",
  surface:     "#1A1A1A",
  surfaceHi:   "#242424",
  surfaceBord: "#2A2A2A",
  border:      "#2E2E2E",
  borderHi:    "#3A3A3A",
  pink:        "#C41262",
  pinkHot:     "#FE4081",
  pinkGrad:    "linear-gradient(135deg, #C41262, #FE4081)",
  pinkDim:     "#2D0A1A",
  textPrimary: "#F0F0F0",
  textSecond:  "rgba(255,255,255,0.65)",
  textMuted:   "rgba(255,255,255,0.45)",
  activeGreen: "#22C55E",
  activeBg:    "#052512",
  upBlue:      "#60A5FA",
  upBg:        "#0A1628",
  draftGray:   "#A0A0A0",
  draftBg:     "#222222",
  closedRed:   "#F87171",
  closedBg:    "#200B0B",
  amber:       "#FBBF24",
};

const STORAGE_KEY = "sheisdesign_events";

const CATEGORIES = [
  "Branding","Motion","UI/UX","Typography",
  "Illustration","Packaging","Photography","Web Design","Other",
];
const STATUSES    = ["open","draft","upcoming","closed"];
const STATUS_TABS = ["draft","upcoming","open","closed"];

const STATUS_STYLES = {
  open:     { bg: "#052512", color: "#22C55E" },
  upcoming: { bg: "#0A1628", color: "#60A5FA" },
  draft:    { bg: "#222222", color: "#A0A0A0" },
  closed:   { bg: "#200B0B", color: "#F87171" },
};

const SEED_EVENTS = [
  { EventID:"evt-001", title:"Brand Identity Challenge",  category:"Branding",     categoryLabel:"Brand Identity",  start_date:"2025-03-12", end_date:"2025-03-10", entry_count:84,  max_entries:92,  description:"A comprehensive brand identity challenge.",  points_reward:500,  status:"open",     image_link:"", submissions:66, location:"Online", time:"09:00", judges:6 },
  { EventID:"evt-002", title:"Motion Design Bootcamp",    category:"Motion",       categoryLabel:"Motion Design",   start_date:"2025-03-20", end_date:"2025-03-18", entry_count:41,  max_entries:60,  description:"An intensive motion design bootcamp.",       points_reward:300,  status:"open",     image_link:"", submissions:28, location:"Online", time:"10:00", judges:3 },
  { EventID:"evt-003", title:"UI/UX Hackathon 2026",      category:"UI/UX",        categoryLabel:"UX Design",       start_date:"2025-04-05", end_date:"2025-04-03", entry_count:61,  max_entries:75,  description:"A 48-hour hackathon.",                       points_reward:750,  status:"open",     image_link:"", submissions:47, location:"Wits University", time:"08:00", judges:4 },
  { EventID:"evt-004", title:"Illustration Open Brief",   category:"Illustration", categoryLabel:"Illustration",    start_date:"2025-05-02", end_date:"2025-04-28", entry_count:67,  max_entries:80,  description:"An open illustration brief.",                points_reward:400,  status:"open",     image_link:"", submissions:51, location:"Online", time:"09:00", judges:3 },
  { EventID:"evt-005", title:"Typography Sprint",         category:"Typography",   categoryLabel:"Typography",      start_date:"2025-04-18", end_date:"2025-04-15", entry_count:29,  max_entries:60,  description:"A focused sprint on editorial typography.",  points_reward:200,  status:"draft",    image_link:"", submissions:0,  location:"Online", time:"10:00", judges:2 },
  { EventID:"evt-006", title:"Packaging Design Sprint",   category:"Packaging",    categoryLabel:"Packaging",       start_date:"2025-05-15", end_date:"2025-05-12", entry_count:0,   max_entries:75,  description:"Design sustainable packaging.",              points_reward:350,  status:"upcoming", image_link:"", submissions:0,  location:"Online", time:"10:00", judges:2 },
  { EventID:"evt-007", title:"Annual Design Awards 2025", category:"Other",        categoryLabel:"Awards",          start_date:"2025-10-14", end_date:"2025-10-12", entry_count:287, max_entries:300, description:"The flagship annual awards.",                points_reward:1000, status:"closed",   image_link:"", submissions:187,location:"Online", time:"14:00", judges:8 },
  { EventID:"evt-008", title:"Poster Design Challenge",   category:"Illustration", categoryLabel:"Illustration",    start_date:"2025-06-01", end_date:"2025-05-30", entry_count:76,  max_entries:100, description:"A bold poster challenge.",                   points_reward:250,  status:"closed",   image_link:"", submissions:69, location:"Online", time:"10:00", judges:3 },
];


function genId() { return "evt-" + Date.now().toString(36); }
function fmtDate(d) {
  if (!d) return "—";
  try { return new Date(d + "T00:00:00").toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric" }); } catch { return d; }
}
function calcPct(count, max) { return max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0; }

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
      stroke={c} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[n]}
    </svg>
  );
}

function Badge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  return (
    <span className="ev-badge" style={{ background: s.bg, color: s.color, borderColor: `${s.color}40` }}>
      {status}
    </span>
  );
}

function ProgressBar({ count, max, showLabel = true }) {
  const p = calcPct(count, max);
  return (
    <div>
      {showLabel && (
        <div className="progress-label">
          <span className="progress-label__count">{count} / {max} entries</span>
          <span className="progress-label__pct" style={{ color: p >= 80 ? T.pinkHot : T.textSecond }}>
            {p}% full
          </span>
        </div>
      )}
      <div className="progress-track" style={{ height: showLabel ? 5 : 4 }}>
        <div className="progress-fill" style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

function JudgeAvatars({ count }) {
  if (!count) return null;
  const colors = [T.pink, T.upBlue, T.activeGreen, T.amber];
  const show = Math.min(count, 4);
  return (
    <div className="judge-avatars">
      <div className="judge-avatar-stack">
        {Array.from({ length: show }).map((_, i) => (
          <div key={i} className="judge-avatar" style={{
            background: colors[i % 4] + "30",
            color: colors[i % 4],
            marginLeft: i ? -6 : 0,
          }}>J</div>
        ))}
      </div>
      {count > 4 && <span className="judge-overflow">+{count - 4}</span>}
    </div>
  );
}

function EventImage({ url, height = 180 }) {
  if (url) return <img src={url} alt="" style={{ width:"100%", height, objectFit:"cover", display:"block" }} />;
  return (
    <div className="ev-img-placeholder" style={{ height }}>
      <Ic n="img" s={28} c={T.textMuted} />
    </div>
  );
}

function MetaRow({ icon, text }) {
  return (
    <div className="meta-row">
      <Ic n={icon} s={12} c={T.textMuted} />
      <span>{text}</span>
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label={title}>
      <div className={`modal-box ${wide ? "modal-box--wide" : "modal-box--narrow"}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <Ic n="close" s={14} c="currentColor" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* function FormField({ label, required, error, children }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}{required && <span className="form-label__required"> *</span>}
      </label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

const EMPTY_FORM = {
  title:"", start_date:"", end_date:"", description:"",
  max_entries:"", category:"Branding", points_reward:"",
  status:"DRAFT", image_link:"", location:"Online", time:"10:00",
  entry_count:0, submissions:0, judges:0, categoryLabel:"",
};

function EventForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? { ...initial } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())                                   e.title         = "Required";
    if (!form.start_date)                                     e.start_date    = "Required";
    if (!form.end_date)                                       e.end_date      = "Required";
    if (!form.description.trim())                             e.description   = "Required";
    if (!form.max_entries || +form.max_entries < 1)           e.max_entries   = "Must be >= 1";
    if (form.points_reward === "" || +form.points_reward < 0) e.points_reward = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = () => {
    if (!validate()) return;
    onSave({ ...form, max_entries: +form.max_entries, points_reward: +form.points_reward, categoryLabel: form.categoryLabel || form.category });
  };

  const inp = (key, type = "text", placeholder = "") => ({
    type, placeholder,
    value: form[key] ?? "",
    onChange: e => set(key, e.target.value),
    className: `form-input${errors[key] ? " form-input--error" : ""}`,
    onFocus: e => { e.target.style.borderColor = T.pink; },
    onBlur:  e => { e.target.style.borderColor = errors[key] ? T.closedRed : T.border; },
  });

  return (
    <div className="modal-body">
      <div className="form-grid">
        <div className="form-grid__full">
          <FormField label="Event Title" required error={errors.title}>
            <input {...inp("title","text","e.g. Brand Identity Challenge")} />
          </FormField>
        </div>
        <FormField label="Start Date" required error={errors.start_date}>
          <input {...inp("start_date","date")} />
        </FormField>
        <FormField label="Submission Deadline" required error={errors.end_date}>
          <input {...inp("end_date","date")} />
        </FormField>
        <FormField label="Category" required>
          <select className="form-select" value={form.category} onChange={e => set("category", e.target.value)}
            onFocus={e => { e.target.style.borderColor = T.pink; }}
            onBlur={e  => { e.target.style.borderColor = T.border; }}>
            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: T.surfaceHi }}>{c}</option>)}
          </select>
        </FormField>
        <FormField label="Status" required>
          <select className="form-select" value={form.status} onChange={e => set("status", e.target.value)}
            onFocus={e => { e.target.style.borderColor = T.pink; }}
            onBlur={e  => { e.target.style.borderColor = T.border; }}>
            {STATUSES.map(s => <option key={s} value={s} style={{ background: T.surfaceHi }}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Max Entries" required error={errors.max_entries}>
          <input {...inp("max_entries","number","e.g. 100")} />
        </FormField>
        <FormField label="Points Reward" required error={errors.points_reward}>
          <input {...inp("points_reward","number","e.g. 500")} />
        </FormField>
        <FormField label="Location">
          <input {...inp("location","text","e.g. Online")} />
        </FormField>
        <FormField label="Time">
          <input {...inp("time","time")} />
        </FormField>
        <div className="form-grid__full">
          <FormField label="Description" required error={errors.description}>
            <textarea
              rows={4}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Describe the event, rules, and deliverables..."
              className={`form-textarea${errors.description ? " form-input--error" : ""}`}
              onFocus={e => { e.target.style.borderColor = T.pink; }}
              onBlur={e  => { e.target.style.borderColor = errors.description ? T.closedRed : T.border; }}
            />
          </FormField>
        </div>
        <div className="form-grid__full">
          <FormField label="Banner Image URL">
            <input {...inp("image_link","url","https://...")} />
          </FormField>
        </div>
      </div>
      <div className="form-footer">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={submit}>
          {initial ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </div>
  );
} */

function ConfirmDelete({ event, onConfirm, onClose }) {
  return (
    <Modal title="Delete Event" onClose={onClose}>
      <div className="modal-body">
        <p className="confirm-text">
          Are you sure you want to delete <strong>{event.title}</strong>? This action cannot be undone.
        </p>
        <div className="form-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete Event</button>
        </div>
      </div>
    </Modal>
  );
}

function FeaturedCard({ event, onManage, onView }) {
  return (
    <div className="feat-card">
      <div className="feat-card__topbar">
        <Badge status={event.status} />
        <span className="feat-card__pts">{event.points_reward} PTS</span>
      </div>
      <EventImage url={event.image_link} height={160} />
      <div className="feat-card__body">
        <div>
          <p className="feat-card__category">{event.categoryLabel || event.category}</p>
          <h3 className="feat-card__title">{event.title}</h3>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <MetaRow icon="cal"   text={`${fmtDate(event.start_date)} — ${fmtDate(event.end_date)}`} />
          <MetaRow icon="pin"   text={event.location || "Online"} />
          {event.time && <MetaRow icon="clock" text={event.time} />}
        </div>
        <ProgressBar count={event.entry_count} max={event.max_entries} />
        <JudgeAvatars count={event.judges} />
      </div>
      <div className="feat-card__actions">
        <button className="feat-card__view-btn" onClick={onView}>
          <Ic n="eye" s={13} c="currentColor" /> View Details
        </button>
        <button className="feat-card__manage-btn" onClick={onManage}>
          <Ic n="gear" s={13} c="#fff" /> Manage
        </button>
      </div>
    </div>
  );
}

function CompactCard({ event, onEdit, onDelete, onView, onCloseEvent }) {
  const iconBtns = [
    { n:"eye",   fn:onView,   hBg:T.upBg,      hC:T.upBlue      },
    { n:"edit",  fn:onEdit,   hBg:T.surfaceHi, hC:T.textPrimary },
    { n:"trash", fn:onDelete, hBg:T.closedBg,  hC:T.closedRed   },
  ];

  return (
    <div className="compact-card">
      <div className="compact-card__img-wrap">
        <div className="compact-card__img-inner">
          <EventImage url={event.image_link} height={100} />
        </div>
        <div className="compact-card__badge-overlay"><Badge status={event.status} /></div>
      </div>
      <div className="compact-card__body">
        <div className="compact-card__title-row">
          <h3 className="compact-card__title">{event.title}</h3>
          <span className="compact-card__cat">{event.categoryLabel || event.category}</span>
        </div>
        <div className="compact-card__meta">
          {[
            { icon:"cal",   val:fmtDate(event.start_date) },
            { icon:"clock", val:event.time },
            { icon:"pin",   val:event.location },
          ].map(r => r.val && (
            <span key={r.icon} className="compact-card__meta-item">
              <Ic n={r.icon} s={11} c={T.textMuted} /> {r.val}
            </span>
          ))}
        </div>
        <span className="compact-card__entries">
          <Ic n="users" s={11} c={T.textMuted} />
          {event.entry_count} / {event.max_entries} entries
        </span>
        <ProgressBar count={event.entry_count} max={event.max_entries} showLabel={false} />
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span className="compact-card__pts">{event.points_reward} pts</span>
          {event.judges > 0 && (
            <span className="compact-card__judges">· {event.judges} judge{event.judges !== 1 ? "s" : ""}</span>
          )}
        </div>
      </div>
      <div className="compact-card__footer">
        {event.status === "open" ? (
          <button className="compact-card__close-btn" onClick={onCloseEvent}>
            <Ic n="lock" s={11} c="currentColor" /> Close Event
          </button>
        ) : event.status === "closed" ? (
          <button className="compact-card__close-btn" onClick={onCloseEvent}
            style={{ borderColor:"rgba(96,165,250,0.4)", color:"#60A5FA" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(96,165,250,0.6)"; e.currentTarget.style.color="#93C5FD"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(96,165,250,0.4)"; e.currentTarget.style.color="#60A5FA"; }}
          >
            <Ic n="eye" s={11} c="currentColor" /> Reopen
          </button>
        ) : event.status === "draft" ? (
          <button className="compact-card__close-btn" onClick={onCloseEvent}
            style={{ borderColor:"rgba(196,18,98,0.4)", color:"#FE4081" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(196,18,98,0.6)"; e.currentTarget.style.color="#C41262"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(196,18,98,0.4)"; e.currentTarget.style.color="#FE4081"; }}
          >
            <Ic n="plus" s={11} c="currentColor" /> Publish
          </button>
        ) : (
          <span className="compact-card__status-label">
            {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
          </span>
        )}
        <div className="compact-card__icon-btns">
          {iconBtns.map(btn => (
            <button key={btn.n} className="compact-card__icon-btn" onClick={btn.fn} aria-label={btn.n}
              onMouseEnter={e => { e.currentTarget.style.background = btn.hBg; e.currentTarget.style.color = btn.hC; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none";  e.currentTarget.style.color = T.textMuted; }}>
              <Ic n={btn.n} s={14} c="currentColor" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventDetail({ event, onBack, onEdit }) {
  const p = calcPct(event.entry_count, event.max_entries);
  const stats = [
    { label:"Participants", value:event.entry_count,      icon:"users" },
    { label:"Submissions",  value:event.submissions || 0, icon:"file"  },
    { label:"Points",       value:event.points_reward,    icon:"award" },
    { label:"Max Entries",  value:event.max_entries,      icon:"users" },
  ];
  const infoRows = [
    { label:"Start Date", val:fmtDate(event.start_date)  },
    { label:"Deadline",   val:fmtDate(event.end_date)    },
    { label:"Location",   val:event.location || "Online" },
    { label:"Time",       val:event.time || "—"          },
  ];

  return (
    <div className="ev-detail">
      <button className="ev-detail__back-btn" onClick={onBack}>Back to Events</button>
      <div className="ev-detail__banner" style={{
        height: 200,
        background: event.image_link
          ? `url(${event.image_link}) center/cover`
          : `linear-gradient(135deg, ${T.pinkDim}, #1a1a1a)`,
      }}>
        <div className="ev-detail__banner-overlay">
          <div className="ev-detail__banner-tags">
            <Badge status={event.status} />
            <span className="ev-detail__banner-cat">{event.categoryLabel || event.category}</span>
          </div>
          <h1 className="ev-detail__banner-title">{event.title}</h1>
        </div>
      </div>
      <div className="ev-detail__id-row">
        <code className="ev-detail__id">{event.EventID}</code>
        <button className="btn-primary" onClick={onEdit}>
          <Ic n="edit" s={13} c="#fff" /> Edit Event
        </button>
      </div>
      <div className="ev-detail__stats">
        {stats.map(st => (
          <div key={st.label} className="ev-detail__stat-card">
            <Ic n={st.icon} s={15} c={T.pinkHot} />
            <div className="ev-detail__stat-value">{st.value}</div>
            <div className="ev-detail__stat-label">{st.label}</div>
          </div>
        ))}
      </div>
      <div className="ev-detail__progress-card">
        <div className="ev-detail__progress-header">
          <span className="ev-detail__progress-title">Registration Progress</span>
          <span className="ev-detail__progress-pct">{p}%</span>
        </div>
        <div className="progress-track" style={{ height:7 }}>
          <div className="progress-fill" style={{ width:`${p}%` }} />
        </div>
        <div className="ev-detail__progress-foot">
          <span>{event.entry_count} registered</span>
          <span>{event.max_entries} max</span>
        </div>
      </div>
      <div className="ev-detail__info-grid">
        {infoRows.map(it => (
          <div key={it.label} className="ev-detail__info-card">
            <div className="ev-detail__info-label">{it.label}</div>
            <div className="ev-detail__info-value">{it.val}</div>
          </div>
        ))}
      </div>
      <div className="ev-detail__desc-card">
        <div className="ev-detail__desc-title">Description</div>
        <p className="ev-detail__desc-text">{event.description || "No description provided."}</p>
      </div>
    </div>
  );
}

const PAGE_SIZE = 8;



export default function ManageEvents() {
  const [events,   setEvents]  = useState([]);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState(null);
  
  useEffect(() => {
    const loadUpcomingEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await eventService.getUpcomingEvents();
        setEvents(data || []);

      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setError(err.message || "Failed to load events");
        setEvents(SEED_EVENTS);
        
      } finally {
        setLoading(false);
      }
    };

     const loadAllEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await eventService.getAllEvents();
        setEvents(data || []);

      } catch (err) {
        console.error("Error fetching all events:", err);
        setError(err.message || "Failed to load events");
        setEvents(SEED_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    
    loadUpcomingEvents();
      
      loadAllEvents();
  }, []);


  const [search,   setSearch]  = useState("");
  const [tab,      setTab]     = useState("all");
  const [modal,    setModal]   = useState(null);
  const [active,   setActive]  = useState(null);
  const [detailId, setDetail]  = useState(null);
  const [page,     setPage]    = useState(1);
  

  const scrollRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const onMouseDown = e => { drag.current = { active: true, startX: e.pageX - scrollRef.current.offsetLeft, scrollLeft: scrollRef.current.scrollLeft }; };
  const onMouseMove = e => { if (!drag.current.active) return; e.preventDefault(); const x = e.pageX - scrollRef.current.offsetLeft; scrollRef.current.scrollLeft = drag.current.scrollLeft - (x - drag.current.startX) * 1.5; };
  const onMouseUp   = () => { drag.current.active = false; };


  useEffect(() => { setPage(1); }, [tab, search]);

  const persist      = next => { setEvents(next); };
  const handleCreate = data => { persist([{ ...data, EventID: genId() }, ...events]); setModal(null); };
  const handleEdit   = data => { persist(events.map(e => e.EventID === active.EventID ? { ...data, EventID: active.EventID } : e)); setModal(null); setActive(null); };
  const handleDelete = ()   => { persist(events.filter(e => e.EventID !== active.EventID)); if (detailId === active.EventID) setDetail(null); setModal(null); setActive(null); };

  const handleStatusToggle = ev => {
    const next =
      ev.status === "open"     ? "closed" :
      ev.status === "closed"   ? "open"   :
      ev.status === "draft"    ? "open"   :
      ev.status === "upcoming" ? "open"   : ev.status;
    persist(events.map(e => e.EventID === ev.EventID ? { ...e, status: next } : e));
  };

  const liveOpen    = events.filter(e => e.status === "open").slice(0, 3);
  const allFiltered = events.filter(e => e.status === tab && e.title.toLowerCase().includes(search.toLowerCase()));
  const totalPages  = Math.max(1, Math.ceil(allFiltered.length / PAGE_SIZE));
  const filtered    = allFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tabCounts   = STATUS_TABS.reduce((a, s) => { a[s] = events.filter(e => e.status === s).length; return a; }, {});
  
  const detailEv    = detailId ? events.find(e => e.EventID === detailId) : null;

  if (detailEv) return (
    <div className="events-root">
      <EventDetail event={detailEv} onBack={() => setDetail(null)} onEdit={() => { setActive(detailEv); setModal("edit"); }} />
      {modal === "edit" && active && (
        <Modal title="Edit Event" onClose={() => setModal(null)} wide>
          <EventForm initial={active} onSave={handleEdit} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );

 const displayEvents = events;


  return (
    <div className="events-root">
      <div className="events-inner">

        <div className="ev-page-header fu">
          <div>
            <p className="ev-page-header__eyebrow">
              <span className="ev-page-header__eyebrow-line" />
              Admin · Events
            </p>
            <h1 className="ev-page-header__title">Manage Events</h1>
            <p className="ev-page-header__sub">Create, manage and monitor all SheIsDesign events.</p>
          </div>
          <div className="ev-page-header__actions">
            <div className="ev-search-wrap">
              <span className="ev-search-icon"><Ic n="search" s={14} c={T.textMuted} /></span>
              <input
                className="ev-search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events..."
                aria-label="Search events"
              />
            </div>
            <button className="btn-primary" onClick={() => setModal("create")}>
              <Ic n="plus" s={15} c="#fff" /> Create Event
            </button>
          </div>
        </div>

          <section className="live-section fu" style={{ animationDelay:"60ms" }} aria-label="Live and open events">
            <div className="live-section__header">
              <div className="live-section__left">
                <span className="live-dot" />
                <span className="live-label">LIVE &amp; OPEN</span>
                <span className="live-count">{liveOpen.length}</span>
              </div>
            </div>
        {liveOpen.length > 0 && (
            <div className="live-scroll-wrap">
              <div className="live-scroll" ref={scrollRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
                {displayEvents.filter(e => e.status === "open" /* && e.Start_date > new Date() */).map(ev => (
                  <FeaturedCard key={ev.EventID} event={ev}
                    onView={() => setDetail(ev.EventID)}
                    onManage={() => { setActive(ev); setModal("edit"); }}
                  />
                ))}
              </div>
            </div>
        )}
        </section>

        <section className="fu" style={{ animationDelay:"120ms" }} aria-label="All events">
          <div className="all-events-header">
            <div className="all-events-title">
              <span className="all-events-title__text">All Events</span>
              <span className="all-events-title__count">{events.length}</span>
            </div>
            <div className="status-tabs">
              <button className="status-tab" onClick={() => setTab("all")}
                style={tab === "all" ? { background: T.surfaceHi, borderColor: T.surfaceHi, color: T.textPrimary } : {}}>
                All
              </button>
              {STATUS_TABS.map(s => {
                const isActive = s === tab;
                const sc = STATUS_STYLES[s] || {};
                return (
                  <button key={s} onClick={() => setTab(s)}
                    className={`status-tab${isActive ? " status-tab--active" : ""}`}
                    style={isActive ? { background: sc.bg, borderColor: `${sc.color}55`, color: sc.color } : {}}>
                    {s.toUpperCase()}
                    {tabCounts[s] > 0 && (
                      <span className="status-tab__count" style={{
                        background: isActive ? `${sc.color}33` : T.surfaceHi,
                        color:      isActive ? sc.color : T.textMuted,
                      }}>
                        {tabCounts[s]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>


          {tab === "all" ? (
            
              <div className="admin-events-grid">
                {events.map(ev => (
                  <CompactCard key={ev.EventID} event={ev}
                    onView={() => setDetail(ev.EventID)}
                    onEdit={() => { setActive(ev); setModal("edit"); }}
                    onDelete={() => { setActive(ev); setModal("delete"); }}
                    onCloseEvent={() => handleStatusToggle(ev)}
                  />
                ))}
              </div>
            
          )  : (
            <>
              <div className="admin-events-grid">
                {filtered.map(ev => (
                  <CompactCard key={ev.EventID} event={ev}
                    onView={() => setDetail(ev.EventID)}
                    onEdit={() => { setActive(ev); setModal("edit"); }}
                    onDelete={() => { setActive(ev); setModal("delete"); }}
                    onCloseEvent={() => handleStatusToggle(ev)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <span className="pagination__info">
                    Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, allFiltered.length)} of {allFiltered.length} events
                  </span>
                  <div className="pagination__controls">
                    <button className="pagination__btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p}
                        className={`pagination__page${p === page ? " pagination__page--active" : ""}`}
                        onClick={() => setPage(p)}>
                        {p}
                      </button>
                    ))}
                    <button className="pagination__btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )} 
           {tab === "all" &&(<div className="admin-events-grid">
                {events.filter(ev => ev.Status === "all").map(ev => (
                  <CompactCard key={ev.EventID} event={ev}
                    onView={() => setDetail(ev.EventID)}
                    onEdit={() => { setActive(ev); setModal("edit"); }}
                    onDelete={() => { setActive(ev); setModal("delete"); }}
                    onCloseEvent={() => handleStatusToggle(ev)}
                  />
                ))}
              </div>)} 
              {tab === "open" &&(<div className="admin-events-grid">
                {events.filter(ev => ev.Status === "open").map(ev => (
                  <CompactCard key={ev.EventID} event={ev}
                    onView={() => setDetail(ev.EventID)}
                    onEdit={() => { setActive(ev); setModal("edit"); }}
                    onDelete={() => { setActive(ev); setModal("delete"); }}
                    onCloseEvent={() => handleStatusToggle(ev)}
                  />
                ))}
              </div>)} 
              {tab === "closed" &&(<div className="admin-events-grid">
                {events.filter(ev => ev.Status === "closed").map(ev => (
                  <CompactCard key={ev.EventID} event={ev}
                    onView={() => setDetail(ev.EventID)}
                    onEdit={() => { setActive(ev); setModal("edit"); }}
                    onDelete={() => { setActive(ev); setModal("delete"); }}
                    onCloseEvent={() => handleStatusToggle(ev)}
                  />
                ))}
              </div>)} 
              {tab === "DRAFT" &&(<div className="admin-events-grid">
                {events.filter(ev => ev.Status === "draft").map(ev => (
                  <CompactCard key={ev.EventID} event={ev}
                    onView={() => setDetail(ev.EventID)}
                    onEdit={() => { setActive(ev); setModal("edit"); }}
                    onDelete={() => { setActive(ev); setModal("delete"); }}
                    onCloseEvent={() => handleStatusToggle(ev)}
                  />
                ))}
              </div>)} 

        </section>
      </div>

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
    </div>
  );
}