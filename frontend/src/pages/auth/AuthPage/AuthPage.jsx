import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdLogin, MdPersonAdd } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { Field, PasswordField, OrDivider, GoogleButton } from "../../../components/ui/Fields/Field/Field";
import FloatingCards from "../../../components/auth/FloatingCards/FloatingCards";
import TokenModal from "../../../components/auth/TokenModal/TokenModal";
import OtpModal from "../../../components/auth/OtpModal/OtpModal";
import { useAuth } from "../../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { loginUser, registerUser, googleLoginUser } from "../../../services/authService";
import { generateOtp, getExpiryTimestamp, sendVerificationEmail } from "../../../services/emailService";
import "./AuthPage.css";

const ADMIN_EMAILS = ["admin@sheisdesign.co.za", "superadmin@example.com"];

function sanitiseError(err) {
  const msg = err?.message || "";
  if (msg.toLowerCase().includes("bcrypt") ||
      msg.toLowerCase().includes("system.") ||
      msg.toLowerCase().includes("microsoft.") ||
      msg.toLowerCase().includes("at lambda") ||
      msg.toLowerCase().includes("stack") ||
      msg.length > 200) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.toLowerCase().includes("unauthorized") || msg.includes("401")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.toLowerCase().includes("not found") || msg.includes("404")) {
    return "No account found with that email address.";
  }
  if (msg.toLowerCase().includes("network") || msg.toLowerCase().includes("fetch")) {
    return "Connection error. Please check your internet and try again.";
  }
  return msg || "Something went wrong. Please try again.";
}

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
function LoginFields({ onSubmit, error, onGoogleClick, googleLoading, googleError }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="auth-card__header">
        <h1 className="auth-card__heading">Log in to your account</h1>
        <p className="auth-card__subtext">
          Access your profile, submissions, and leaderboard ranking.
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit({ email, password }); }}
        className="auth-card__form"
      >
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

        {error && <p className="auth-card__error">{error}</p>}

        <button type="submit" className="auth-card__submit">
          <MdLogin size={18} />
          Log in
        </button>
      </form>

      <div className="auth-card__google-group">
        <OrDivider />
        <GoogleButton
          onClick={onGoogleClick}
          disabled={googleLoading}
          label={googleLoading ? "Signing in..." : "Continue with Google"}
        />
        {googleError && <p className="auth-card__error">{googleError}</p>}
      </div>
    </>
  );
}

// ── Signup fields ─────────────────────────────────────────────────────────────
function SignupFields({ onSubmit, error, onGoogleClick, googleLoading, googleError }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");

  return (
    <>
      <div className="auth-card__header">
        <h1 className="auth-card__heading">Join SheIsDesign</h1>
        <p className="auth-card__subtext">
          It only takes a minute. Join 1,200+ women in design.
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit({ firstName, lastName, email, password }); }}
        className="auth-card__form"
      >
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

        {error && <p className="auth-card__error">{error}</p>}

        <button type="submit" className="auth-card__submit">
          <MdPersonAdd size={18} />
          Sign up
        </button>
      </form>

      <div className="auth-card__google-group">
        <OrDivider />
        <GoogleButton
          onClick={onGoogleClick}
          disabled={googleLoading}
          label={googleLoading ? "Signing in..." : "Sign up with Google"}
        />
        {googleError && <p className="auth-card__error">{googleError}</p>}
      </div>

      <p className="auth-card__terms">
        By signing up you agree to our{" "}
        <a href="/terms" className="auth-card__terms-link">Terms of Service</a>
        {" "}and{" "}
        <a href="/privacy" className="auth-card__terms-link">Privacy Policy</a>.
      </p>
    </>
  );
}

// ── Auth card ─────────────────────────────────────────────────────────────────
function AuthCard() {
  const navigate       = useNavigate();
  const { login }      = useAuth();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState(
    searchParams.get("mode") === "signup" ? "signup" : "login"
  );

  const [modalStep, setModalStep]         = useState(null);
  const [loginEmail, setLoginEmail]       = useState("");
  const [isAdmin, setIsAdmin]             = useState(false);
  const [isJudge]                         = useState(false);
  const [loginError, setLoginError]       = useState("");
  const [signupError, setSignupError]     = useState("");
  const [apiUser, setApiUser]             = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError]     = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setGoogleError("");
      try {
        const res = await googleLoginUser(tokenResponse.access_token);
        if (res.isNewUser) {
          navigate("/signup/details", {
            state: {
              firstName: res.givenName  || "",
              lastName:  res.familyName || "",
              email:     res.email,
              userId:    res.id,
            },
          });
        } else {
          login(res);
          navigate(
            res.role === "admin" ? "/admin/dashboard"
            : res.role === "judge" ? "/judge/dashboard"
            : "/"
          );
        }
      } catch (err) {
        setGoogleError(sanitiseError(err));
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setGoogleError("Google sign-in was cancelled or failed."),
  });

  async function handleLoginSubmit({ email, password }) {
    setLoginError("");
    try {
      const res = await loginUser(email, password);
      setApiUser(res);
      setLoginEmail(email);
      const adminCheck = res.role === "admin" || ADMIN_EMAILS.includes(email.toLowerCase().trim());
      setIsAdmin(adminCheck);
      setModalStep(adminCheck ? "token" : "otp");
    } catch (err) {
      setLoginError(sanitiseError(err));
    }
  }

  async function handleSignupSubmit({ firstName, lastName, email, password }) {
    setSignupError("");
    try {
      const res    = await registerUser(email, password);
      const code   = generateOtp();
      const expiry = getExpiryTimestamp();
      await sendVerificationEmail(email, firstName, code, expiry);
      navigate("/signup/verify", {
        state: { firstName, lastName, email, userId: res.id, code, expiry },
      });
    } catch (err) {
      setSignupError(sanitiseError(err));
    }
  }

  function handleOtpVerified() {
    setModalStep(null);
    login(apiUser);
    navigate(isAdmin ? "/admin/dashboard" : isJudge ? "/judge/dashboard" : "/");
  }

  return (
    <>
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-card__glow-line" />

          <AuthToggle mode={mode} onChange={setMode} />

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {mode === "login" ? (
                <LoginFields
                  onSubmit={handleLoginSubmit}
                  error={loginError}
                  onGoogleClick={googleLogin}
                  googleLoading={googleLoading}
                  googleError={googleError}
                />
              ) : (
                <SignupFields
                  onSubmit={handleSignupSubmit}
                  error={signupError}
                  onGoogleClick={googleLogin}
                  googleLoading={googleLoading}
                  googleError={googleError}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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