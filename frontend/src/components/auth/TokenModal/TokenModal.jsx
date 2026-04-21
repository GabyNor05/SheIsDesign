// ─────────────────────────────────────────────────────────────────────────────
// TokenModal.jsx — Admin access token verification modal
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiShield, FiKey } from "react-icons/fi";

// Simulated token — in production this is validated server-side
const MOCK_TOKEN = "abc123def456";

export default function TokenModal({ email, onClose, onVerified }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleVerify() {
    if (!token.trim()) { setError("Please enter your access token."); return; }
    setLoading(true);
    setTimeout(() => {
      if (token.trim() === MOCK_TOKEN) {
        setLoading(false);
        onVerified();
      } else {
        setLoading(false);
        setError("Invalid token. Please check your email and try again.");
      }
    }, 900);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="modal-glow-line" />
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="modal-icon-wrap">
          <FiShield size={26} />
        </div>

        <div className="modal-eyebrow">
          <div className="modal-eyebrow-dot" />
          <span>Admin Verification</span>
        </div>
        <h2 className="modal-heading">Admin Access Token</h2>
        <p className="modal-sub">
          We sent a token to{" "}
          <span className="modal-email">{email}</span>.<br />
          Enter it below to continue.
        </p>

        <div className="modal-field">
          <label className="modal-label">
            <FiKey size={12} />
            Access Token
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => { setToken(e.target.value); setError(""); }}
            placeholder="e.g. abc123def456"
            className={`modal-input ${error ? "modal-input--error" : ""}`}
            spellCheck={false}
          />
          {error && <span className="modal-error">{error}</span>}
        </div>

        <button className="modal-btn" onClick={handleVerify} disabled={loading}>
          {loading ? (
            <span className="modal-spinner" />
          ) : (
            <>
              <MdAdminPanelSettings size={18} />
              Verify Token
            </>
          )}
        </button>

        <p className="modal-resend">
          Didn't receive it?{" "}
          <button type="button" className="modal-resend-link">Resend token</button>
        </p>
      </div>
    </div>
  );
}