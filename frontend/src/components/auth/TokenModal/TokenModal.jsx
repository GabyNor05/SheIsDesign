import { useState } from "react";
import PropTypes from "prop-types";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiShield, FiKey } from "react-icons/fi";
import { verifyAdminCode } from "../../../services/authService";

export default function TokenModal({ onClose, onVerified }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (!token.trim()) { setError("Please enter your access code."); return; }
    setLoading(true);
    setError("");
    try {
      await verifyAdminCode(token.trim());
      onVerified();
    } catch {
      setError("Invalid access code. Please check with your administrator.");
    } finally {
      setLoading(false);
    }
  }

  function handleInputKeyDown(e) {
    if (e.key === "Enter") handleVerify();
  }

  return (
    <button
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
      aria-label="Close modal"
      type="button"
    >
      <dialog
        open
        className="modal-wrapper"
        aria-labelledby="admin-modal-heading"
      >
        <div className="modal-glow-line" />
        <button className="modal-close" onClick={onClose}>&times;</button>

        <div className="modal-icon-wrap">
          <FiShield size={26} />
        </div>

        <div className="modal-eyebrow">
          <div className="modal-eyebrow-dot" />
          <span>Admin Verification</span>
        </div>
        <h2 id="admin-modal-heading" className="modal-heading">Admin Access Code</h2>
        <p className="modal-sub">
          Enter the admin access code that was distributed to you.
        </p>

        <div className="modal-field">
          <label className="modal-label">
            <FiKey size={12} />
            Access Code
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => { setToken(e.target.value); setError(""); }}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter your admin access code"
            className={`modal-input ${error ? "modal-input--error" : ""}`}
            spellCheck={false}
            autoFocus
          />
          {error && <span className="modal-error">{error}</span>}
        </div>

        <button className="modal-btn" onClick={handleVerify} disabled={loading}>
          {loading ? (
            <span className="modal-spinner" />
          ) : (
            <>
              <MdAdminPanelSettings size={18} />
              Verify Code
            </>
          )}
        </button>
      </dialog>
    </button>
  );
}

TokenModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onVerified: PropTypes.func.isRequired,
};
