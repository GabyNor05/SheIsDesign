// ─────────────────────────────────────────────────────────────────────────────
// LoginForm.jsx — Glassy login form card
// Handles: email/password input, admin vs student routing, modal state machine
// Modals: TokenModal (admin only) → OtpModal → navigate
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { Field, PasswordField, OrDivider, GoogleButton } from "../../../components/ui/Fields/Field/Field";
import TokenModal from "../../../components/auth/TokenModal/TokenModal";
import OtpModal from "../../../components/auth/OtpModal/OtpModal";
import "./LoginForm.css";

// Simulated admin emails — replace with API role check in production
const ADMIN_EMAILS = ["admin@sheisdesign.co.za", "superadmin@example.com"];

export default function LoginForm({ onCreateAccount }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Modal state machine: null | "token" | "otp"
  const [modalStep, setModalStep] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: POST /api/auth/login — use response role instead of client-side check
    const adminCheck = ADMIN_EMAILS.includes(email.toLowerCase().trim());
    setIsAdmin(adminCheck);
    setModalStep(adminCheck ? "token" : "otp");
  }

  function handleTokenVerified() {
    setModalStep("otp");
  }

  function handleOtpVerified() {
    setModalStep(null);
    navigate(isAdmin ? "/admin/dashboard" : "/");
  }

  return (
    <>
      <div className="login-form-panel">
        <div className="login-form-panel__glow" />

        <div className="login-form-card">
          {/* Top glow accent */}
          <div className="login-form-card__glow-line" />

          {/* Header */}
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

          {/* Form */}
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

            {/* Primary button — uses your existing PrimaryButton component */}
            {/* Replace the button below with your <PrimaryButton> component */}
            <button type="submit" className="login-form-card__submit">
              Log in
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