// ─────────────────────────────────────────────────────────────────────────────
// OtpModal.jsx — 6-digit OTP verification modal
// Used after: login (both admin + student), and can be reused for email verify
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef } from "react";
import { MdVerifiedUser } from "react-icons/md";

const MOCK_OTP = "123456";

// ── OTP Input ─────────────────────────────────────────────────────────────────
function OtpInput({ length = 6, value, onChange }) {
  const inputsRef = useRef([]);

  function handleChange(e, idx) {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = value.split("");
    arr[idx] = val;
    onChange(arr.join(""));
    if (val && idx < length - 1) inputsRef.current[idx + 1]?.focus();
  }

  function handleKeyDown(e, idx) {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted.padEnd(length, "").slice(0, length));
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
    e.preventDefault();
  }

  return (
    <div className="otp-input-row">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className={`otp-box ${value[i] ? "otp-box--filled" : ""}`}
        />
      ))}
    </div>
  );
}

// ── OtpModal ──────────────────────────────────────────────────────────────────
export default function OtpModal({ email, isAdmin, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleVerify() {
    if (otp.length < 6) { setError("Please enter all 6 digits."); return; }
    setLoading(true);
    setTimeout(() => {
      if (otp === MOCK_OTP) {
        setLoading(false);
        onVerified();
      } else {
        setLoading(false);
        setError("Incorrect OTP. Please try again.");
        setOtp("");
      }
    }, 900);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="modal-glow-line" />
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="modal-icon-wrap modal-icon-wrap--otp">
          <MdVerifiedUser size={26} />
        </div>

        <div className="modal-eyebrow">
          <div className="modal-eyebrow-dot" />
          <span>One-Time Password</span>
        </div>
        <h2 className="modal-heading">Verify Your Identity</h2>
        <p className="modal-sub">
          Enter the 6-digit OTP sent to{" "}
          <span className="modal-email">{email}</span>.
        </p>

        <OtpInput
          length={6}
          value={otp}
          onChange={(val) => { setOtp(val); setError(""); }}
        />
        {error && <span className="modal-error modal-error--center">{error}</span>}

        <button
          className="modal-btn"
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
        >
          {loading ? (
            <span className="modal-spinner" />
          ) : (
            <>
              <MdVerifiedUser size={18} />
              Confirm OTP
            </>
          )}
        </button>

        <p className="modal-resend">
          Didn't receive it?{" "}
          <button type="button" className="modal-resend-link">Resend OTP</button>
        </p>
      </div>
    </div>
  );
}