import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import {T, inputStyle} from "../theme";
import emailjs from "@emailjs/browser";
import { eventService } from "../../../services/eventService";
import { cloudinaryService } from "../../../services/CloudinaryService";
import "../../../pages/admin/template/AdminDashboardV2.css";

// ── Import the scoped modal + form styles from the Events page ────────────────
import "../../../pages/admin/template/EventModal.css";

// ── Reuse the same EventModal + EventForm from Events.jsx inline ─────────────
// (copied here so QuickActions is self-contained without a circular import)

import { useEffect, useRef } from "react";

const CATEGORIES = [
  "Branding",
  "Motion",
  "UI/UX",
  "Typography",
  "Illustration",
  "Packaging",
  "Photography",
  "Web Design",
  "Other",
];
const STATUSES = ["open", "draft", "upcoming", "closed"];

const EMPTY_FORM = {
  title: "",
  start_date: "",
  end_date: "",
  description: "",
  max_entries: "",
  category: "Branding",
  points_reward: "",
  status: "draft",
  image_link: "",
  location: "Online",
  time: "10:00",
  entry_count: 0,
  submissions: 0,
  judges: 0,
};

function Ic({ n, s = 16, c = "currentColor" }) {
  const paths = {
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    img: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </>
    ),
  };
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[n]}
    </svg>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div className="ev-form-field">
      <label className="ev-form-label">
        {label}
        {required && <span className="ev-form-label__required"> *</span>}
      </label>
      {children}
      {error && <span className="ev-form-error">{error}</span>}
    </div>
  );
}

function EventModal({ title, onClose, children, wide }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`ev-modal-box ${wide ? "ev-modal-box--wide" : "ev-modal-box--narrow"}`}
        style={{ position: "relative" }}
      >
        <div className="ev-modal-glow" />
        <div className="ev-modal-header">
          <div className="ev-modal-header__left">
            <span className="ev-modal-eyebrow">
              <span className="ev-modal-eyebrow-dot" />
              Admin · Events
            </span>
            <h2 className="ev-modal-title">{title}</h2>
          </div>
          <button
            className="ev-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <Ic n="close" s={14} c="currentColor" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EventForm({ onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

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
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.start_date) e.start_date = "Start date is required";
    if (!form.end_date) e.end_date = "End date is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.max_entries || +form.max_entries < 1)
      e.max_entries = "Must be at least 1";
    if (form.points_reward === "" || +form.points_reward < 0)
      e.points_reward = "Points reward is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    if (!validate()) return;
    setUploading(true);
    setUploadError("");
    try {
      let imageUrl = "";
      if (imageFile) {
        const uploaded = await cloudinaryService.uploadImage(
          imageFile,
          "events",
        );
        if (!uploaded)
          throw new Error("Image upload failed. Please try again.");
        imageUrl = uploaded;
      }
      await onSave({
        ...form,
        image_link: imageUrl,
        max_entry: +form.max_entries, // backend field name
        max_entries: +form.max_entries,
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
        <div className="ev-form-grid__full">
          <FormField label="Event Title" required error={errors.title}>
            <input
              className={`ev-form-input${errors.title ? " ev-form-input--error" : ""}`}
              type="text"
              placeholder="e.g. Brand Identity Challenge"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Status">
          <select
            className="ev-form-select"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Category" required>
          <select
            className="ev-form-select"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Start Date" required error={errors.start_date}>
          <input
            className={`ev-form-input${errors.start_date ? " ev-form-input--error" : ""}`}
            type="date"
            value={form.start_date}
            onChange={(e) => set("start_date", e.target.value)}
          />
        </FormField>

        <FormField label="Submission Deadline" required error={errors.end_date}>
          <input
            className={`ev-form-input${errors.end_date ? " ev-form-input--error" : ""}`}
            type="date"
            value={form.end_date}
            onChange={(e) => set("end_date", e.target.value)}
          />
        </FormField>

        <FormField label="Max Entries" required error={errors.max_entries}>
          <input
            className={`ev-form-input${errors.max_entries ? " ev-form-input--error" : ""}`}
            type="number"
            placeholder="e.g. 100"
            value={form.max_entries}
            onChange={(e) => set("max_entries", e.target.value)}
          />
        </FormField>

        <FormField label="Points Reward" required error={errors.points_reward}>
          <input
            className={`ev-form-input${errors.points_reward ? " ev-form-input--error" : ""}`}
            type="number"
            placeholder="e.g. 500"
            value={form.points_reward}
            onChange={(e) => set("points_reward", e.target.value)}
          />
        </FormField>

        <FormField label="Location">
          <input
            className="ev-form-input"
            type="text"
            placeholder="e.g. Online"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </FormField>

        <FormField label="Time">
          <input
            className="ev-form-input"
            type="time"
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
          />
        </FormField>

        <div className="ev-form-grid__full">
          <FormField label="Description" required error={errors.description}>
            <textarea
              className={`ev-form-textarea${errors.description ? " ev-form-textarea--error" : ""}`}
              rows={4}
              placeholder="Describe the event, rules, and deliverables..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </FormField>
        </div>

        <div className="ev-form-grid__full">
          <FormField label="Banner Image">
            <div
              className={`ev-img-upload${dragOver ? " ev-img-upload--active" : ""}${imagePreview ? " ev-img-upload--has-image" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Banner preview"
                    className="ev-img-upload__preview"
                  />
                  <div className="ev-img-upload__overlay">
                    <Ic n="img" s={18} c="#fff" />
                    <span>Change image</span>
                  </div>
                </>
              ) : (
                <div className="ev-img-upload__placeholder">
                  <Ic n="img" s={24} c="rgba(196,18,98,0.6)" />
                  <span className="ev-img-upload__label">
                    Drop image here or click to browse
                  </span>
                  <span className="ev-img-upload__sub">
                    JPG, PNG, WEBP · max 10 MB
                  </span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>
            {imageFile && (
              <div className="ev-img-upload__file-row">
                <span className="ev-img-upload__file-name">
                  {imageFile.name}
                </span>
                <button
                  type="button"
                  className="ev-img-upload__remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            {uploadError && (
              <span className="ev-form-error">{uploadError}</span>
            )}
          </FormField>
        </div>
      </div>

      <div className="ev-form-footer">
        <button className="ev-btn-ghost" onClick={onClose} disabled={uploading}>
          Cancel
        </button>
        <button
          className="ev-btn-primary"
          onClick={submit}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="ev-upload-spinner" /> Uploading…
            </>
          ) : (
            <>
              <Ic n="plus" s={13} c="#fff" /> Create Event
            </>
          )}
        </button>
      </div>
    </div>
  );
}

//________________________________________________________________
// Invite Judge form
//__________________________________________________________________

function JudgeInviteForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInvite = async() => {
    function configEmailJS() {
      emailjs.init({ publicKey: "N8hgLvHSjKw4sAw8T" });
    }

    configEmailJS();
    if (!validate()) return;
    emailjs.send("service_7s2q8fk", "sheIsDesignJudgeInvite", { email }).then(
      (response) => console.log("SUCCESS!", response.status, response.text),
      (error) => console.log("FAILED...", error),
    );

    setModal(null);
  };

  return (
    <div>
      
      <div className="ev-form-grid__full mt-5" style={{ padding: "0 20px 20px" }}>

      <form className="" onSubmit={() => {  handleInvite() }}>
      <FormField label="Judge Email" required error={errors.email}>
          <input
            className={`ev-form-input`}
            type="email"
            placeholder="judge@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>
        <div className="ev-form-footer">
          <button className="ev-btn-ghost" onClick={() => setModal(null)}>
            Close
          </button>
          <button
            className="ev-btn-primary"
            type="submit"
          >
            Send Invite
          </button>
        </div>
      </form>
      </div>
        

      </div>
   
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { id: 1, icon: "plus", label: "Create Event" },
  { id: 2, icon: "award", label: "Invite Judge" },
  { id: 3, icon: "chart", label: "View Leaderboard" },
];

function QuickActions() {
  const [modal, setModal] = useState(null);

  const navigate = useNavigate();

  const handleCreate = async (eventData) => {
    try {
      await eventService.createEvent({
        title: eventData.title,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        description: eventData.description,
        max_entry: eventData.max_entry,
        category: eventData.category,
        points_reward: eventData.points_reward,
        status: eventData.status,
        image_link: eventData.image_link,
      });
    } catch (err) {
      console.error("Create event error:", err);
    }
    setModal(null);
  };

  const buttonAction = (id) => {
    switch (id) {
      case 1:
        setModal("create");
        break;
      case 2:
        setModal("invite");
        break;
      case 3:
        navigate("/admin/leaderboard");
        break;
      default:
        break;
    }
  };

  return (
    <div className="quick-actions">
      {QUICK_ACTIONS.map((action, i) => (
        <button
          key={action.id}
          className={`quick-actions__btn${i === 0 ? " quick-actions__btn--primary" : ""}`}
          onClick={() => buttonAction(action.id)}
        >
          <Icon
            name={action.icon}
            size={15}
            color={i === 0 ? "#fff" : "var(--text-second)"}
          />
          {action.label}
        </button>
      ))}

      {modal === "create" && (
        <EventModal
          title="Create New Event"
          onClose={() => setModal(null)}
          wide
        >
          <EventForm onSave={handleCreate} onClose={() => setModal(null)} />
        </EventModal>
      )}

      {/* Invite Judge keeps its existing modal for now */}
      {modal === "invite" && (
        <EventModal
          title="Invite Judge"
          onClose={() => setModal(null)}
          wide
        >
            <JudgeInviteForm onClose={() => setModal(null)} />
          
        </EventModal>
      )}
    </div>
  );
}

export default QuickActions;
