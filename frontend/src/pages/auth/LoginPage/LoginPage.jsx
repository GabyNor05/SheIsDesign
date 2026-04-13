// ─────────────────────────────────────────────────────────────────────────────
// LoginPage.jsx — SheIsDesign login page
// Left: animated editorial panel (dark, branded)
// Right: login form (dark, glassy)
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin, MdArrowForward } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { Field, PasswordField, OrDivider, GoogleButton } from '../../../components/ui/Fields/Field/Field';
import "./LoginPage.css";

// ── Animated editorial left panel ────────────────────────────────────────────
function EditorialPanel() {
  const lines = ["Create.", "Compete.", "Connect.", "Lead.", "Belong."];

  return (
    <div className="login-editorial">
      {/* Noise texture overlay */}
      <div className="login-editorial__noise" />

      {/* Gradient glows */}
      <div className="login-editorial__glow login-editorial__glow--1" />
      <div className="login-editorial__glow login-editorial__glow--2" />

      {/* Dot grid */}
      <div className="login-editorial__dots" />

      {/* Animated word stack */}
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

        {/* Tagline */}
        <p className="login-editorial__tagline">
          A platform built to celebrate, challenge,<br />
          and elevate women in design.
        </p>

        {/* Decorative stat pills */}
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

      {/* Bottom glow line */}
      <div className="login-editorial__glow-line" />
    </div>
  );
}

// ── Login form right panel ────────────────────────────────────────────────────
function LoginForm({ onCreateAccount }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire to POST /api/auth/login
    navigate("/");
  }

  return (
    <div className="login-form-panel">
      {/* Subtle glow blob behind the card */}
      <div className="login-form-panel__glow" />

      <div className="login-form-card">
        {/* Top glow line on card */}
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

          <button type="submit" className="login-form-card__submit">
            <MdLogin size={18} />
            Login
          </button>
        </form>

        <OrDivider />
        <GoogleButton />

        {/* Sign up link */}
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
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  function handleCreateAccount() {
    navigate("/signup");
  }

  return (
    <div className="login-root">
      <EditorialPanel />
      <LoginForm onCreateAccount={handleCreateAccount} />
    </div>
  );
}