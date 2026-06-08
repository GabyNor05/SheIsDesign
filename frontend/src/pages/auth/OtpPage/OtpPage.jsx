import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { generateOtp, getExpiryTimestamp, sendVerificationEmail } from "../../../services/emailService";
import GlowBackground from "../../../components/auth/GlowBackground/GlowBackground";
import AuthNav from "../../../components/auth/AuthNav/AuthNav";
import AuthCard from "../../../components/auth/AuthCard/AuthCard";
import PrimaryButton from "../../../components/ui/Buttons/PrimaryButton/PrimaryButton";
import "./OtpPage.css";

function useCountdown(initial) {
  const [seconds, setSeconds] = useState(initial);
  const [active, setActive]   = useState(true);

  useEffect(() => {
    if (!active || seconds <= 0) { setActive(false); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, active]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return { display: `${mm}:${ss}`, expired: !active || seconds <= 0, reset: () => { setSeconds(initial); setActive(true); } };
}

const OTP_KEYS = ["d1", "d2", "d3", "d4", "d5", "d6"];

function OtpPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const email     = location.state?.email     || "your email";
  const firstName = location.state?.firstName || "";
  const lastName  = location.state?.lastName  || "";
  const userId    = location.state?.userId;

  const codeRef   = useRef(location.state?.code   || "");
  const expiryRef = useRef(location.state?.expiry || 0);

  const [otp, setOtp]     = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const refs              = useRef(new Array(6).fill(null));
  const { display, expired, reset } = useCountdown(60);

  function handleChange(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft"  && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next   = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (otp.join("").length < 6) { setError("Please enter the full 6-digit code."); return; }
    if (Date.now() > expiryRef.current) { setError("Code has expired. Please request a new one."); return; }
    if (otp.join("") !== codeRef.current) { setError("Incorrect code. Please try again."); setOtp(new Array(6).fill("")); return; }
    navigate("/signup/details", { state: { firstName, lastName, email, userId } });
  }

  async function handleResend() {
    const newCode   = generateOtp();
    const newExpiry = getExpiryTimestamp();
    codeRef.current   = newCode;
    expiryRef.current = newExpiry;
    await sendVerificationEmail(email, firstName, newCode, newExpiry);
    reset();
  }

  return (
    <div className="otp-page">
      <GlowBackground />
      <AuthNav backTo="/signup" backLabel="Back" />

      <div className="otp-page__content">
        <AuthCard>
          <div className="otp-page__icon">
            <FiMail size={28} className="otp-page__mail-icon" />
          </div>

          <div className="otp-page__heading">
            <h1 className="otp-page__title">Check your email</h1>
            <p className="otp-page__subtitle">
              We sent a 6-digit code to{" "}
              <span className="otp-page__email">{email}</span>.
              Enter it below to verify your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="otp-page__form">
            <div className="otp-page__inputs">
              {otp.map((v, i) => (
                <input
                  key={OTP_KEYS[i]}
                  ref={el => { refs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  autoFocus={i === 0}
                  className={`otp-page__box ${error ? "otp-page__box--error" : ""} ${v ? "otp-page__box--filled" : ""}`}
                />
              ))}
            </div>

            {error && (
              <div className="otp-page__error">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className="otp-page__resend">
              <span className="otp-page__resend-label">Resend code</span>
              {expired ? (
                <button type="button" onClick={handleResend} className="otp-page__resend-btn">
                  Resend now
                </button>
              ) : (
                <span className="otp-page__countdown">{display}</span>
              )}
            </div>

            <PrimaryButton type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verify &amp; Continue
            </PrimaryButton>
          </form>

          <p className="otp-page__spam-note">Didn't receive it? Check your spam folder.</p>
        </AuthCard>
      </div>
    </div>
  );
}

export default OtpPage;
