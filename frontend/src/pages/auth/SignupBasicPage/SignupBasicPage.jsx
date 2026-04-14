// ─────────────────────────────────────────────────────────────────────────────
// SignupBasicPage.jsx — Page shell
// Identical to LoginPage: same background layers, same split layout, same FloatingCards
// Only difference: right side renders SignupForm instead of LoginForm
// ─────────────────────────────────────────────────────────────────────────────
import SignupForm from "../../../components/auth/SignupForm/SignupForm";
import FloatingCards from "../../../components/auth/FloatingCards/FloatingCards";
import "../LoginPage/LoginPage.css";

export default function SignupBasicPage() {
  return (
    <div className="login-root">
      {/* ── Animated background layers (shared with LoginPage) ── */}
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

      {/* ── Split layout ── */}
      <div className="login-split">
        {/* Left: signup form */}
        <div className="login-split__left">
          <SignupForm />
        </div>

        {/* Right: same floating cards as login */}
        <div className="login-split__right">
          <FloatingCards />
        </div>
      </div>
    </div>
  );
}