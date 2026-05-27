// ─────────────────────────────────────────────────────────────────────────────
// Field.jsx — shared input component for SheIsDesign auth flows
// Supports: default, filled, error, disabled states
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import "./Field.css";

// ── Text / Email / Generic input ─────────────────────────────────────────────
export function Field({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  staticValue,
  disabled,
  value,
  onChange,
  name,
}) {
  return (
    <div className="sid-field">
      <label className="sid-field__label">{label}</label>
      <div className="sid-field__wrap">
        {Icon && (
          <span className={`sid-field__icon ${disabled ? "sid-field__icon--disabled" : ""}`}>
            <Icon size={16} />
          </span>
        )}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          defaultValue={staticValue}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={[
            "sid-field__input",
            Icon ? "sid-field__input--icon" : "",
            error ? "sid-field__input--error" : "",
            disabled ? "sid-field__input--disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {disabled && !Icon && (
          <span className="sid-field__lock material-icons">lock</span>
        )}
      </div>
      {error && <span className="sid-field__error">{error}</span>}
    </div>
  );
}

// ── Password with show/hide toggle ───────────────────────────────────────────
export function PasswordField({ label, placeholder, name, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="sid-field">
      <label className="sid-field__label">{label}</label>
      <div className="sid-field__wrap">
        <span className="sid-field__icon material-icons" style={{ fontFamily: "Material Icons" }}>
          lock_outline
        </span>
        <input
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="sid-field__input sid-field__input--icon sid-field__input--password"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="sid-field__toggle"
          aria-label={show ? "Hide password" : "Show password"}
        >
          <span className="material-icons" style={{ fontSize: "18px" }}>
            {show ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
export function SelectField({ label, placeholder, options, name, value, onChange }) {
  return (
    <div className="sid-field">
      <label className="sid-field__label">{label}</label>
      <div className="sid-field__wrap">
        <select
          name={name}
          value={value}
          onChange={onChange}
          defaultValue=""
          className="sid-field__select"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span className="sid-field__icon sid-field__icon--right material-icons">expand_more</span>
      </div>
    </div>
  );
}

// ── Tag Input ─────────────────────────────────────────────────────────────────
export function TagInput({ label = "Skills & Specialities", initialTags = [] }) {
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState("");

  function addTag(val) {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) setTags((p) => [...p, trimmed]);
    setInput("");
  }

  function removeTag(tag) {
    setTags((p) => p.filter((t) => t !== tag));
  }

  return (
    <div className="sid-field">
      <label className="sid-field__label">{label}</label>
      <div className="sid-field__tag-container">
        {tags.map((tag) => (
          <div key={tag} className="sid-field__tag">
            <span>{tag}</span>
            <button type="button" onClick={() => removeTag(tag)} className="sid-field__tag-remove">
              <span className="material-icons" style={{ fontSize: "14px" }}>close</span>
            </button>
          </div>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(input);
            }
            if (e.key === "Backspace" && !input && tags.length)
              setTags((p) => p.slice(0, -1));
          }}
          placeholder={tags.length === 0 ? "e.g. UX Design, JavaScript… press Enter" : "Add skill…"}
          className="sid-field__tag-input"
        />
      </div>
    </div>
  );
}

// ── Or Divider ────────────────────────────────────────────────────────────────
export function OrDivider() {
  return (
    <div className="sid-or">
      <div className="sid-or__line" />
      <span className="sid-or__text">or</span>
      <div className="sid-or__line" />
    </div>
  );
}

// ── Google Button ─────────────────────────────────────────────────────────────
export function GoogleButton({ label = "Continue with Google", onClick, disabled }) {
  return (
    <button type="button" className="sid-google-btn" onClick={onClick} disabled={disabled}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4" />
        <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853" />
        <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4068 3.78409 7.83 3.96409 7.29V4.9581H0.957275C0.347727 6.1731 0 7.5477 0 9C0 10.4522 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05" />
        <path d="M9 3.5795C10.3214 3.5795 11.5077 4.0336 12.4405 4.9254L15.0218 2.344C13.4632 0.8918 11.4259 0 9 0C5.48182 0 2.43818 2.0168 0.957275 4.9581L3.96409 7.29C4.67182 5.1627 6.65591 3.5795 9 3.5795Z" fill="#EA4335" />
      </svg>
      {label}
    </button>
  );
}