import { useState, useEffect, useRef } from "react";
import "./Events.css";
import "./EventModal.css";
import { eventService } from "../../../services/eventService";
import { cloudinaryService } from "../../../services/CloudinaryService";

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
  { EventID:"evt-001", title:"Brand Identity Challenge",  category:"Branding",     start_date:"2025-03-12", end_date:"2025-03-10", entry_count:84,  max_entries:92,  description:"A comprehensive brand identity challenge.",  points_reward:500,  status:"open",     image_link:"", submissions:66, location:"Online", time:"09:00", judges:6 },
  { EventID:"evt-002", title:"Motion Design Bootcamp",    category:"Motion",       start_date:"2025-03-20", end_date:"2025-03-18", entry_count:41,  max_entries:60,  description:"An intensive motion design bootcamp.",       points_reward:300,  status:"open",     image_link:"", submissions:28, location:"Online", time:"10:00", judges:3 },
  { EventID:"evt-003", title:"UI/UX Hackathon 2026",      category:"UI/UX",        start_date:"2025-04-05", end_date:"2025-04-03", entry_count:61,  max_entries:75,  description:"A 48-hour hackathon.",                       points_reward:750,  status:"open",     image_link:"", submissions:47, location:"Wits University", time:"08:00", judges:4 },
  { EventID:"evt-004", title:"Illustration Open Brief",   category:"Illustration", start_date:"2025-05-02", end_date:"2025-04-28", entry_count:67,  max_entries:80,  description:"An open illustration brief.",                points_reward:400,  status:"open",     image_link:"", submissions:51, location:"Online", time:"09:00", judges:3 },
  { EventID:"evt-005", title:"Typography Sprint",         category:"Typography",   start_date:"2025-04-18", end_date:"2025-04-15", entry_count:29,  max_entries:60,  description:"A focused sprint on editorial typography.",  points_reward:200,  status:"draft",    image_link:"", submissions:0,  location:"Online", time:"10:00", judges:2 },
  { EventID:"evt-006", title:"Packaging Design Sprint",   category:"Packaging",    start_date:"2025-05-15", end_date:"2025-05-12", entry_count:0,   max_entries:75,  description:"Design sustainable packaging.",              points_reward:350,  status:"upcoming", image_link:"", submissions:0,  location:"Online", time:"10:00", judges:2 },
  { EventID:"evt-007", title:"Annual Design Awards 2025", category:"Other",        start_date:"2025-10-14", end_date:"2025-10-12", entry_count:287, max_entries:300, description:"The flagship annual awards.",                points_reward:1000, status:"closed",   image_link:"", submissions:187,location:"Online", time:"14:00", judges:8 },
  { EventID:"evt-008", title:"Poster Design Challenge",   category:"Illustration", start_date:"2025-06-01", end_date:"2025-05-30", entry_count:76,  max_entries:100, description:"A bold poster challenge.",                   points_reward:250,  status:"closed",   image_link:"", submissions:69, location:"Online", time:"10:00", judges:3 },
];

function genId() { return "evt-" + Date.now().toString(36); }
function fmtDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric" }); } catch { return d; }
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
    warn:   <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[n]}
    </svg>
  );
}

function Badge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.draft;
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
          <span className="progress-label__pct" style={{ color: p >= 80 ? T.pinkHot : T.textSecond }}>{p}% full</span>
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
            background: colors[i % 4] + "30", color: colors[i % 4], marginLeft: i ? -6 : 0,
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

// ── Scoped modal using ev-modal- classes (not modal-overlay from AuthPage) ───
function EventModal({ title, eyebrow = "Admin · Events", onClose, children, wide }) {
  useEffect(() => {
    const h = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="ev-modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={`ev-modal-box ${wide ? "ev-modal-box--wide" : "ev-modal-box--narrow"}`}
        style={{ position: "relative" }}>
        <div className="ev-modal-glow" />
        <div className="ev-modal-header">
          <div className="ev-modal-header__left">
            <span className="ev-modal-eyebrow">
              <span className="ev-modal-eyebrow-dot" />
              {eyebrow}
            </span>
            <h2 className="ev-modal-title">{title}</h2>
          </div>
          <button className="ev-modal-close" onClick={onClose} aria-label="Close">
            <Ic n="close" s={14} c="currentColor" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Form field helper ─────────────────────────────────────────────────────────
function FormField({ label, required, error, children }) {
  return (
    <div className="ev-form-field">
      <label className="ev-form-label">
        {label}{required && <span className="ev-form-label__required"> *</span>}
      </label>
      {children}
      {error && <span className="ev-form-error">{error}</span>}
    </div>
  );
}

const EMPTY_FORM = {
  title:"", start_date:"", end_date:"", description:"",
  max_entries:"", category:"Branding", points_reward:"",
  status:"draft", image_link:"", location:"Online", time:"10:00",
  entry_count:0, submissions:0, judges:0,
};

// ── Event form with Cloudinary image upload + date pickers ───────────────────
function EventForm({ initial, onSave, onClose }) {
  const [form, setForm]           = useState(initial ? { ...initial } : { ...EMPTY_FORM });
  const [errors, setErrors]       = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial?.image_link || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef              = useRef(null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function handleFileSelect(file) {
    if (!file || !file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be under 10 MB.");
      return;
    }
    setUploadError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  const validate = () => {
    const e = {};
    if (!form.title.trim())                                   e.title         = "Title is required";
    if (!form.start_date)                                     e.start_date    = "Start date is required";
    if (!form.end_date)                                       e.end_date      = "End date is required";
    if (!form.description.trim())                             e.description   = "Description is required";
    if (!form.max_entries || +form.max_entries < 1)           e.max_entries   = "Must be at least 1";
    if (form.points_reward === "" || +form.points_reward < 0) e.points_reward = "Points reward is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    if (!validate()) return;
    setUploading(true);
    setUploadError("");
    try {
      let imageUrl = form.image_link;
      // Upload to Cloudinary if a new file was selected
      if (imageFile) {
        const uploaded = await cloudinaryService.uploadImage(imageFile, "events");
        if (!uploaded) throw new Error("Image upload failed. Please try again.");
        imageUrl = uploaded;
      }
      onSave({
        ...form,
        image_link:    imageUrl,
        max_entries:   +form.max_entries,
        points_reward: +form.points_reward,
      });
    } catch (err) {
      setUploadError(err?.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="ev-modal-body">
      <div className="ev-form-grid">

        {/* Title — full width */}
        <div className="ev-form-grid__full">
          <FormField label="Event Title" required error={errors.title}>
            <input
              className={`ev-form-input${errors.title ? " ev-form-input--error" : ""}`}
              type="text"
              placeholder="e.g. Brand Identity Challenge"
              value={form.title}
              onChange={e => set("title", e.target.value)}
            />
          </FormField>
        </div>

        {/* Status + Category */}
        <FormField label="Status">
          <select className="ev-form-select" value={form.status} onChange={e => set("status", e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </FormField>

        <FormField label="Category" required>
          <select className="ev-form-select" value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>

        {/* Date pickers */}
        <FormField label="Start Date" required error={errors.start_date}>
          <input
            className={`ev-form-input${errors.start_date ? " ev-form-input--error" : ""}`}
            type="date"
            value={form.start_date}
            onChange={e => set("start_date", e.target.value)}
          />
        </FormField>

        <FormField label="Submission Deadline" required error={errors.end_date}>
          <input
            className={`ev-form-input${errors.end_date ? " ev-form-input--error" : ""}`}
            type="date"
            value={form.end_date}
            onChange={e => set("end_date", e.target.value)}
          />
        </FormField>

        {/* Max entries + Points */}
        <FormField label="Max Entries" required error={errors.max_entries}>
          <input
            className={`ev-form-input${errors.max_entries ? " ev-form-input--error" : ""}`}
            type="number"
            placeholder="e.g. 100"
            value={form.max_entries}
            onChange={e => set("max_entries", e.target.value)}
          />
        </FormField>

        <FormField label="Points Reward" required error={errors.points_reward}>
          <input
            className={`ev-form-input${errors.points_reward ? " ev-form-input--error" : ""}`}
            type="number"
            placeholder="e.g. 500"
            value={form.points_reward}
            onChange={e => set("points_reward", e.target.value)}
          />
        </FormField>

        {/* Location + Time */}
        <FormField label="Location">
          <input
            className="ev-form-input"
            type="text"
            placeholder="e.g. Online"
            value={form.location}
            onChange={e => set("location", e.target.value)}
          />
        </FormField>

        <FormField label="Time">
          <input
            className="ev-form-input"
            type="time"
            value={form.time}
            onChange={e => set("time", e.target.value)}
          />
        </FormField>

        {/* Description — full width */}
        <div className="ev-form-grid__full">
          <FormField label="Description" required error={errors.description}>
            <textarea
              className={`ev-form-textarea${errors.description ? " ev-form-textarea--error" : ""}`}
              rows={4}
              placeholder="Describe the event, rules, and deliverables..."
              value={form.description}
              onChange={e => set("description", e.target.value)}
            />
          </FormField>
        </div>

        {/* Banner image upload — full width */}
        <div className="ev-form-grid__full">
          <FormField label="Banner Image">
            <div
              className={`ev-img-upload${dragOver ? " ev-img-upload--active" : ""}${imagePreview ? " ev-img-upload--has-image" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Banner preview" className="ev-img-upload__preview" />
                  <div className="ev-img-upload__overlay">
                    <Ic n="img" s={18} c="#fff" />
                    <span>Change image</span>
                  </div>
                </>
              ) : (
                <div className="ev-img-upload__placeholder">
                  <Ic n="img" s={24} c="rgba(196,18,98,0.6)" />
                  <span className="ev-img-upload__label">Drop image here or click to browse</span>
                  <span className="ev-img-upload__sub">JPG, PNG, WEBP · max 10 MB</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display:"none" }}
                onChange={e => handleFileSelect(e.target.files[0])}
              />
            </div>
            {imageFile && (
              <div className="ev-img-upload__file-row">
                <span className="ev-img-upload__file-name">{imageFile.name}</span>
                <button
                  className="ev-img-upload__remove"
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setImageFile(null);
                    setImagePreview(initial?.image_link || null);
                    set("image_link", initial?.image_link || "");
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            {uploadError && <span className="ev-form-error">{uploadError}</span>}
          </FormField>
        </div>
      </div>

      <div className="ev-form-footer">
        <button className="ev-btn-ghost" onClick={onClose} disabled={uploading}>Cancel</button>
        <button className="ev-btn-primary" onClick={submit} disabled={uploading}>
          {uploading ? (
            <><span className="ev-upload-spinner" /> Uploading…</>
          ) : (
            <><Ic n={initial ? "edit" : "plus"} s={13} c="#fff" />
            {initial ? "Save Changes" : "Create Event"}</>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Confirm delete ────────────────────────────────────────────────────────────
function ConfirmDelete({ event, onConfirm, onClose, deleting }) {
  return (
    <EventModal title="Delete Event" eyebrow="Permanent Action" onClose={onClose}>
      <div className="ev-modal-body">
        <div style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:20, padding:"14px 16px", background:"rgba(248,113,113,0.06)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:10 }}>
          <Ic n="warn" s={18} c="#F87171" />
          <p className="ev-confirm-text" style={{ margin:0 }}>
            Are you sure you want to delete <strong>{event.title}</strong>?
            This will permanently remove it from the database and cannot be undone.
          </p>
        </div>
        <div className="ev-form-footer">
          <button className="ev-btn-ghost" onClick={onClose} disabled={deleting}>Cancel</button>
          <button className="ev-btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete Event"}
          </button>
        </div>
      </div>
    </EventModal>
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
            style={{ borderColor:"rgba(96,165,250,0.4)", color:"#60A5FA" }}>
            <Ic n="eye" s={11} c="currentColor" /> Reopen
          </button>
        ) : event.status === "draft" ? (
          <button className="compact-card__close-btn" onClick={onCloseEvent}
            style={{ borderColor:"rgba(196,18,98,0.4)", color:"#FE4081" }}>
            <Ic n="plus" s={11} c="currentColor" /> Publish
          </button>
        ) : (
          <span className="compact-card__status-label">
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
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
        <code className="ev-detail__id">{event.EventID || event.Id || event.id}</code>
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
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const raw = await eventService.getAllEvents();
        const data = (raw || []).map(e => ({
          ...e,
          EventID: e.EventID || e.id,
          max_entries: e.max_entries ?? e.max_entry ?? 0,
        }));
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents(SEED_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    load();
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const persist = next => setEvents(next);

  const handleCreate = async (data) => {
    try {
      const created = await eventService.createEvent(data);
      persist([{ ...data, EventID: created?.id || genId() }, ...events]);
    } catch {
      persist([{ ...data, EventID: genId() }, ...events]);
    }
    setModal(null);
  };

  const handleEdit = async (data) => {
    try {
      await eventService.updateEvent(active.EventID || active.Id || active.id, data);
    } catch (err) {
      console.error("Update error:", err);
    }
    persist(events.map(e =>
      (e.EventID || e.Id || e.id) === (active.EventID || active.Id || active.id)
        ? { ...data, EventID: active.EventID || active.Id || active.id }
        : e
    ));
    setModal(null);
    setActive(null);
  };

  // ── Delete: calls API then removes from local state ──────────────────────
  const handleDelete = async () => {
    const eventId = active.EventID || active.Id || active.id;
    setDeleting(true);
    try {
      await eventService.deleteEvent(eventId);
    } catch (err) {
      console.error("Delete error:", err);
      // Still remove from UI even if API fails in dev/seed mode
    } finally {
      setDeleting(false);
    }
    persist(events.filter(e => (e.EventID || e.Id || e.id) !== eventId));
    if (detailId === eventId) setDetail(null);
    setModal(null);
    setActive(null);
  };

  const handleStatusToggle = async (ev) => {
    const next =
      ev.status === "open"     ? "closed" :
      ev.status === "closed"   ? "open"   :
      ev.status === "draft"    ? "open"   :
      ev.status === "upcoming" ? "open"   : ev.status;
    try {
      await eventService.updateEvent(ev.EventID || ev.Id || ev.id, { ...ev, status: next });
    } catch (err) {
      console.error("Status toggle error:", err);
    }
    persist(events.map(e =>
      (e.EventID || e.Id || e.id) === (ev.EventID || ev.Id || ev.id) ? { ...e, status: next } : e
    ));
  };

  const filtered    = events.filter(e =>
    (tab === "all" || e.status === tab) &&
    e.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged       = tab === "all" ? filtered : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tabCounts   = STATUS_TABS.reduce((a, s) => { a[s] = events.filter(e => e.status === s).length; return a; }, {});
  const liveOpen    = events.filter(e => e.status === "open").slice(0, 6);
  const detailEv    = detailId ? events.find(e => (e.EventID || e.Id || e.id) === detailId) : null;

  if (detailEv) return (
    <div className="events-root">
      <EventDetail event={detailEv} onBack={() => setDetail(null)}
        onEdit={() => { setActive(detailEv); setModal("edit"); }} />
      {modal === "edit" && active && (
        <EventModal title="Edit Event" onClose={() => setModal(null)} wide>
          <EventForm initial={active} onSave={handleEdit} onClose={() => setModal(null)} />
        </EventModal>
      )}
    </div>
  );

  return (
    <div className="events-root">
      <div className="events-inner">

        {/* Page header */}
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
              />
            </div>
            <button className="btn-primary" onClick={() => setModal("create")}>
              <Ic n="plus" s={15} c="#fff" /> Create Event
            </button>
          </div>
        </div>

        {/* Live events strip */}
        {liveOpen.length > 0 && (
          <section className="live-section fu" style={{ animationDelay:"60ms" }}>
            <div className="live-section__header">
              <div className="live-section__left">
                <span className="live-dot" />
                <span className="live-label">LIVE &amp; OPEN</span>
                <span className="live-count">{liveOpen.length}</span>
              </div>
            </div>
            <div className="live-scroll-wrap">
              <div className="live-scroll" ref={scrollRef}
                onMouseDown={onMouseDown} onMouseMove={onMouseMove}
                onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
                {liveOpen.map(ev => (
                  <FeaturedCard key={ev.EventID || ev.id} event={ev}
                    onView={() => setDetail(ev.EventID || ev.Id || ev.id)}
                    onManage={() => { setActive(ev); setModal("edit"); }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All events grid */}
        <section className="fu" style={{ animationDelay:"120ms" }}>
          <div className="all-events-header">
            <div className="all-events-title">
              <span className="all-events-title__text">All Events</span>
              <span className="all-events-title__count">{events.length}</span>
            </div>
            <div className="status-tabs">
              {["all", ...STATUS_TABS].map(s => {
                const isActive = s === tab;
                const sc = STATUS_STYLES[s] || {};
                return (
                  <button key={s} onClick={() => setTab(s)}
                    className={`status-tab${isActive ? " status-tab--active" : ""}`}
                    style={isActive && s !== "all"
                      ? { background: sc.bg, borderColor: `${sc.color}55`, color: sc.color }
                      : isActive ? { background: T.surfaceHi, borderColor: T.surfaceHi, color: T.textPrimary }
                      : {}}>
                    {s === "all" ? "All" : s.toUpperCase()}
                    {s !== "all" && tabCounts[s] > 0 && (
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

          {loading ? (
            <div className="events-empty">Loading events…</div>
          ) : paged.length === 0 ? (
            <div className="events-empty">No {tab !== "all" ? tab : ""} events found.</div>
          ) : (
            <div className="admin-events-grid">
              {paged.map(ev => (
                <CompactCard key={ev.EventID || ev.id} event={ev}
                  onView={() => setDetail(ev.EventID || ev.Id || ev.id)}
                  onEdit={() => { setActive(ev); setModal("edit"); }}
                  onDelete={() => { setActive(ev); setModal("delete"); }}
                  onCloseEvent={() => handleStatusToggle(ev)}
                />
              ))}
            </div>
          )}

          {tab !== "all" && totalPages > 1 && (
            <div className="pagination">
              <span className="pagination__info">
                Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="pagination__controls">
                <button className="pagination__btn" onClick={() => setPage(p => p-1)} disabled={page===1}>Prev</button>
                {Array.from({ length: totalPages }, (_,i) => i+1).map(p => (
                  <button key={p}
                    className={`pagination__page${p===page ? " pagination__page--active" : ""}`}
                    onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="pagination__btn" onClick={() => setPage(p => p+1)} disabled={page===totalPages}>Next</button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      {modal === "create" && (
        <EventModal title="Create New Event" onClose={() => setModal(null)} wide>
          <EventForm onSave={handleCreate} onClose={() => setModal(null)} />
        </EventModal>
      )}
      {modal === "edit" && active && (
        <EventModal title="Edit Event" onClose={() => { setModal(null); setActive(null); }} wide>
          <EventForm initial={active} onSave={handleEdit} onClose={() => { setModal(null); setActive(null); }} />
        </EventModal>
      )}
      {modal === "delete" && active && (
        <ConfirmDelete
          event={active}
          onConfirm={handleDelete}
          onClose={() => { setModal(null); setActive(null); }}
          deleting={deleting}
        />
      )}
    </div>
  );
}