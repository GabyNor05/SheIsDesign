// ─────────────────────────────────────────────────────────────────────────────
// LoginPage.jsx — Page shell
// Renders: animated background + split layout (LoginForm left, FloatingCards right)
// All logic lives in sub-components; this file owns only layout + background
// ─────────────────────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import LoginForm from "../../../components/auth/LoginForm/LoginForm"
import FloatingCards from "../../../components/auth/FloatingCards/FloatingCards"
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-root">
      {/* ── Animated background layers ── */}
      <div className="login-bg">
        {/* Layer 1: Orbs */}
        <div className="login-bg__orb login-bg__orb--a" />
        <div className="login-bg__orb login-bg__orb--b" />
        <div className="login-bg__orb login-bg__orb--c" />

        {/* Layer 2: Aurora streaks */}
        <div className="login-bg__aurora login-bg__aurora--1" />
        <div className="login-bg__aurora login-bg__aurora--2" />

        {/* Layer 3: Dot grid */}
        <div className="login-bg__dotgrid" />

        {/* Layer 4: Grain */}
        <div className="login-bg__grain" />

        {/* Layer 5: Vignette */}
        <div className="login-bg__vignette" />
      </div>

      {/* ── Split layout ── */}
      <div className="login-split">
        {/* Left: form */}
        <div className="login-split__left">
          <LoginForm onCreateAccount={() => navigate("/signup")} />
        </div>

        {/* Right: floating cards */}
        <div className="login-split__right">
          <FloatingCards />
        </div>
      </div>
    </div>
  );
}