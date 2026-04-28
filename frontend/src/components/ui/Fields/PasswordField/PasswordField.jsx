import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./PasswordField.css";

function PasswordField({ label, name, placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false);

  return (
    <div className="password-field">
      {label && <label className="password-field__label">{label}</label>}
      <div className="password-field__wrap">
        <span className="password-field__lock" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`password-field__input ${error ? "password-field__input--error" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="password-field__toggle"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <FiEyeOff size={15} /> : <FiEye size={15} />}
        </button>
      </div>
      {error && <span className="password-field__error">{error}</span>}
    </div>
  );
}

export default PasswordField;