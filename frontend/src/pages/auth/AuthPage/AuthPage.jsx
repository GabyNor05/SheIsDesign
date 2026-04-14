// ─────────────────────────────────────────────────────────────────────────────
// AuthPage.jsx — Unified auth page
// One card, one background, slider at top toggles between Login and Sign Up
// Accepts ?mode=login or ?mode=signup via URL, defaults to login
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdLogin, MdPersonAdd, MdArrowForward, MdAdminPanelSettings, MdVerifiedUser } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { Field, PasswordField, OrDivider, GoogleButton } from "../../../components/ui/Fields/Field/Field";
import FloatingCards from "../../components/auth/FloatingCards/FloatingCards";
import TokenModal from "../../components/auth/TokenModal/TokenModal";
import OtpModal from "../../components/auth/OtpModal/OtpModal";
import "./AuthPage.css";

const ADMIN_EMAILS = ["admin@sheisdesign.co.za", "superadmin@example.com"];

// ── Toggle slider ─────────────────────────────────────────────────────────────
function AuthToggle({ mode, onChange }) {
  return (
    <div className="auth-toggle">
      <button
        type="button"
        className={`auth-toggle__btn ${mode === "login" ? "auth-toggle__btn--active" : ""}`}
        onClick={() => onChange("login")}
      >
        {mode === "login" && (
          <motion.div
            className="auth-toggle__pill"
            layoutId="auth-pill"
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
          />
        )}
        <span className="auth-toggle__label">Log in</span>
      </button>

      <button
        type="button"
        className={`auth-toggle__btn ${mode === "signup" ? "auth-toggle__btn--active" : ""}`}
        onClick={() => onChange("signup")}
      >
        {mode === "signup" && (
          <motion.div
            className="auth-toggle__pill"
            layoutId="auth-pill"
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
          />
        )}
        <span className="auth-toggle__label">Sign up</span>
      </button>
    </div>
  );
}

// ── Login fields ──────────────────────────────────────────────────────────────
function LoginFields({ onSubmit }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="auth-card__header">
        <div className="auth-card__eyebrow">
          <div className="auth-card__eyebrow-dot" />
          <span>Welcome back</span>
        </div>
        <h1 className="auth-card__heading">Log in to your account</h1>
        <p className="auth-card__subtext">
          Access your profile, submissions, and leaderboard ranking.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ email, password }); }}
            className="auth-card__form">
        <Field
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@university.ac.za"
          icon={FiMail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="auth-card__password-group">
          <PasswordField
            label="Password"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="auth-card__forgot-row">
            <button type="button" className="auth-card__forgot">
              Forgot password?
            </button>
          </div>
        </div>

        <button type="submit" className="auth-card__submit">
          <MdLogin size={18} />
          Log in
        </button>
      </form>

      <OrDivider />
      <GoogleButton />
    </>
  );
}

// ── Signup fields ─────────────────────────────────────────────────────────────
function SignupFields({ onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");

  return (
    <>
      <div className="auth-card__header">
        <div className="auth-card__eyebrow">
          <div className="auth-card__eyebrow-dot" />
          <span>Create your account</span>
        </div>
        <h1 className="auth-card__heading">Join SheIsDesign</h1>
        <p className="auth-card__subtext">
          It only takes a minute. Join 1,200+ women in design.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ firstName, lastName, email, password }); }}
            className="auth-card__form">
        <div className="auth-card__name-row">
          <Field
            label="First Name"
            name="firstName"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Field
            label="Last Name"
            name="lastName"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <Field
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@university.ac.za"
          icon={FiMail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          label="Password"
          placeholder="Create a password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="auth-card__submit">
          <MdPersonAdd size={18} />
          Sign up
        </button>
      </form>

      <OrDivider />
      <GoogleButton label="Sign up with Google" />

      <p className="auth-card__terms">
        By signing up you agree to our{" "}
        <a href="/terms" className="auth-card__terms-link">Terms of Service</a>
        {" "}and{" "}
        <a href="/privacy" className="auth-card__terms-link">Privacy Policy</a>.
      </p>
    </>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────
function AuthCard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );

  // Login modal state
  const [modalStep, setModalStep] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  function handleLoginSubmit({ email, password }) {
    setLoginEmail(email);
    const adminCheck = ADMIN_EMAILS.includes(email.toLowerCase().trim());
    setIsAdmin(adminCheck);
    setModalStep(adminCheck ? "token" : "otp");
  }

  function handleSignupSubmit({ firstName, lastName, email, password }) {
    // TODO: POST /api/auth/register
    navigate("/signup/details", { state: { firstName, email } });
  }

  function handleOtpVerified() {
    setModalStep(null);
    navigate(isAdmin ? "/admin/dashboard" : "/");
  }

  return (
    <>
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-card__glow-line" />

          {/* Slider toggle */}
          <AuthToggle mode={mode} onChange={setMode} />

          {/* Animated content swap */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {mode === "login" ? (
                <LoginFields onSubmit={handleLoginSubmit} />
              ) : (
                <SignupFields onSubmit={handleSignupSubmit} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Switch link below the card content */}
          <p className="auth-card__switch">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button type="button" onClick={() => setMode("signup")} className="auth-card__switch-link">
                  Sign up <MdArrowForward size={13} />
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button type="button" onClick={() => setMode("login")} className="auth-card__switch-link">
                  Log in <MdArrowForward size={13} />
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Modals — only relevant in login mode */}
      {modalStep === "token" && (
        <TokenModal
          email={loginEmail}
          onClose={() => setModalStep(null)}
          onVerified={() => setModalStep("otp")}
        />
      )}
      {modalStep === "otp" && (
        <OtpModal
          email={loginEmail}
          isAdmin={isAdmin}
          onClose={() => setModalStep(null)}
          onVerified={handleOtpVerified}
        />
      )}
    </>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────────
export default function AuthPage() {
  return (
    <div className="login-root">
      <div className="login-bg">
        <div className="login-bg__orb login-bg__orb--a" />
        <div className="login-bg__orb login-bg__orb--b" />
        <div className="login-bg__orb login-bg__orb--c" />
        <div className="login-bg__aurora login-bg__aurora--1" />
        <div className="login-bg__aurora login-bg__aurora--2" />
        <div className="login-bg__dotgrid" />
        <div className="login-bg__grain" />
        <div className="login-bg__vignette" />
      </div>

      <div className="login-split">
        <div className="login-split__left">
          <AuthCard />
        </div>
        <div className="login-split__right">
          <FloatingCards />
        </div>
      </div>
    </div>
  );
}