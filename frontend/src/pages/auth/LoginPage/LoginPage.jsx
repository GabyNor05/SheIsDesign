// ─────────────────────────────────────────────────────────────────────────────
// LoginPage.jsx — SheIsDesign login page
// Left: login form (wider, dark, glassy)
// Right: editorial panel (slimmer, branded)
// Flow: login → [admin? token modal → OTP → /admin/dashboard] : [OTP → /]
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogin, MdArrowForward, MdAdminPanelSettings, MdVerifiedUser } from "react-icons/md";
import { FiMail, FiShield, FiKey } from "react-icons/fi";
import { Field, PasswordField, OrDivider, GoogleButton } from '../../../components/ui/Fields/Field/Field';
import "./LoginPage.css";

// ── OTP Input component ───────────────────────────────────────────────────────
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
    const focusIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
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

// ── Admin Token Modal ─────────────────────────────────────────────────────────
function TokenModal({ email, onClose, onVerified }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulated token sent to email — in production this is checked server-side
  const MOCK_TOKEN = "abc123def456";

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
        {/* Glow accent line */}
        <div className="modal-glow-line" />

        {/* Close */}
        <button className="modal-close" onClick={onClose}>&times;</button>

        {/* Icon */}
        <div className="modal-icon-wrap">
          <FiShield size={26} />
        </div>

        {/* Header */}
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

        {/* Token input */}
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

        {/* CTA */}
        <button
          className="modal-btn"
          onClick={handleVerify}
          disabled={loading}
        >
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

// ── OTP Modal ─────────────────────────────────────────────────────────────────
function OtpModal({ email, isAdmin, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const MOCK_OTP = "123456";

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

        {/* Icon */}
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

        {/* 6-box OTP */}
        <OtpInput length={6} value={otp} onChange={(val) => { setOtp(val); setError(""); }} />
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

// ── Animated editorial right panel ───────────────────────────────────────────
function EditorialPanel() {
  const lines = ["Create.", "Compete.", "Connect.", "Lead.", "Belong."];

  return (
    <div className="login-editorial">
      <div className="login-editorial__noise" />
      <div className="login-editorial__glow login-editorial__glow--1" />
      <div className="login-editorial__glow login-editorial__glow--2" />
      <div className="login-editorial__dots" />

      <div className="login-editorial__body">
        <div className="login-editorial__words">
          {lines.map((word, i) => (
            <span
              key={word}
              className="login-editorial__word"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {word}
            </span>
          ))}
        </div>

        <p className="login-editorial__tagline">
          A platform built to celebrate, challenge,<br />
          and elevate women in design.
        </p>

        <div className="login-editorial__stats">
          <div className="login-editorial__stat">
            <span className="login-editorial__stat-num">1,200+</span>
            <span className="login-editorial__stat-label">Designers</span>
          </div>
          <div className="login-editorial__stat-divider" />
          <div className="login-editorial__stat">
            <span className="login-editorial__stat-num">48</span>
            <span className="login-editorial__stat-label">Events</span>
          </div>
          <div className="login-editorial__stat-divider" />
          <div className="login-editorial__stat">
            <span className="login-editorial__stat-num">320+</span>
            <span className="login-editorial__stat-label">Projects</span>
          </div>
        </div>
      </div>

      <div className="login-editorial__glow-line" />
    </div>
  );
}

// ── Login form LEFT panel ─────────────────────────────────────────────────────
function LoginForm({ onCreateAccount }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Modal state machine: null | "token" | "otp"
  const [modalStep, setModalStep] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Simulated admin emails — replace with actual API check
  const ADMIN_EMAILS = ["admin@sheisdesign.co.za", "superadmin@example.com"];

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: POST /api/auth/login — response tells us role
    const adminCheck = ADMIN_EMAILS.includes(email.toLowerCase().trim());
    setIsAdmin(adminCheck);

    if (adminCheck) {
      // Admin: token modal first
      setModalStep("token");
    } else {
      // Student: OTP straight away
      setModalStep("otp");
    }
  }

  function handleTokenVerified() {
    // After token → show OTP
    setModalStep("otp");
  }

  function handleOtpVerified() {
    setModalStep(null);
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  }

  return (
    <>
      <div className="login-form-panel">
        <div className="login-form-panel__glow" />

        <div className="login-form-card">
          <div className="login-form-card__glow-line" />

          <div className="login-form-card__header">
            <div className="login-form-card__eyebrow">
              <div className="login-form-card__eyebrow-dot" />
              <span>Welcome back</span>
            </div>
            <h1 className="login-form-card__heading">Log in to your account</h1>
            <p className="login-form-card__subtext">
              Access your profile, submissions, and leaderboard ranking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form-card__form">
            <Field
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@university.ac.za"
              icon={FiMail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="login-form-card__password-group">
              <PasswordField
                label="Password"
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="login-form-card__forgot-row">
                <button type="button" className="login-form-card__forgot">
                  Forgot password?
                </button>
              </div>
            </div>

            <button type="submit" className="login-form-card__submit">
              <MdLogin size={18} />
              Login
            </button>
          </form>

          <OrDivider />
          <GoogleButton />

          <p className="login-form-card__switch">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onCreateAccount}
              className="login-form-card__switch-link"
            >
              Create one
              <MdArrowForward size={13} />
            </button>
          </p>
        </div>
      </div>

      {/* ── Modals ── */}
      {modalStep === "token" && (
        <TokenModal
          email={email}
          onClose={() => setModalStep(null)}
          onVerified={handleTokenVerified}
        />
      )}

      {modalStep === "otp" && (
        <OtpModal
          email={email}
          isAdmin={isAdmin}
          onClose={() => setModalStep(null)}
          onVerified={handleOtpVerified}
        />
      )}
    </>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-root">
      {/* Form is NOW on the LEFT */}
      <LoginForm onCreateAccount={() => navigate("/signup")} />
      {/* Editorial is NOW on the RIGHT */}
      <EditorialPanel />
    </div>
  );
}