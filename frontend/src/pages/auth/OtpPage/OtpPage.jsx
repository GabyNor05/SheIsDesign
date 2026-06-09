import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiLock, FiClock, FiCheckCircle } from "react-icons/fi";
import { generateOtp, getExpiryTimestamp, sendVerificationEmail } from "../../../services/emailService";
import { registerUser, createMentee, createIndustryProfessional } from "../../../services/authService";
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
  return {
    display: `${mm}:${ss}`,
    expired: !active || seconds <= 0,
    reset: () => { setSeconds(initial); setActive(true); },
  };
}

const OTP_KEYS = ["d1", "d2", "d3", "d4", "d5", "d6"];

function OtpPage() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const email          = location.state?.email          || "your email";
  const firstName      = location.state?.firstName      || "";
  const lastName       = location.state?.lastName       || "";
  const password       = location.state?.password       || "";
  const tab            = location.state?.tab            || "student";
  const studentFields  = location.state?.studentFields  || {};
  const wantsVolunteer = location.state?.wantsVolunteer || false;
  const industryFields = location.state?.industryFields || {};

  const codeRef   = useRef(location.state?.code   || "");
  const expiryRef = useRef(location.state?.expiry || 0);

  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting]   = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (otp.join("").length < 6) { setError("Please enter the full 6-digit code."); return; }
    if (Date.now() > expiryRef.current) { setError("Code has expired. Please request a new one."); return; }
    if (otp.join("") !== codeRef.current) {
      setError("Incorrect code. Please try again.");
      setOtp(new Array(6).fill(""));
      refs.current[0]?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await registerUser(email, password);
      const userId = res.id;

      if (tab === "student") {
        const student_res = await createMentee({
          fullname:        `${firstName} ${lastName}`.trim(),
          university:      studentFields.university      || "",
          year_of_study:   studentFields.year_of_study  ?? 1,
          field_of_study:  studentFields.fieldOfStudy   || "",
          student_number:  studentFields.studentNumber  || "",
          wants_volunteer: wantsVolunteer,
          userId,
        });

        const studentId = student_res.id;
        sessionStorage.setItem("StudentID", studentId);
      } else {
        await createIndustryProfessional({
          fullname:    `${firstName} ${lastName}`.trim(),
          institution: industryFields.institution || "",
          job_title:   industryFields.jobTitle    || "",
          userId,
        });
      }

      navigate("/application-status", { state: { firstName, lastName, email, status: "Pending" } });
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleResend() {
    const newCode   = generateOtp();
    const newExpiry = getExpiryTimestamp();
    codeRef.current   = newCode;
    expiryRef.current = newExpiry;
    await sendVerificationEmail(email, firstName, newCode, newExpiry);
    reset();
    setOtp(new Array(6).fill(""));
    setError("");
  }

  return (
    <div className="otp-page">
      {/* Background glows */}
      <div className="otp-page__glow otp-page__glow--1" />
      <div className="otp-page__glow otp-page__glow--2" />

      {/* Nav */}
      <nav className="otp-page__nav">
        <Link to="/" className="otp-page__nav-logo">
          <div className="otp-page__nav-logo-mark">
            <span className="material-icons" style={{ fontSize: "18px", color: "white" }}>brush</span>
          </div>
          <span className="otp-page__nav-logo-text">SheisDesign</span>
        </Link>
        <Link to="/signup/details" className="otp-page__nav-back">
          <span className="material-icons" style={{ fontSize: "15px" }}>arrow_back</span>
          Back
        </Link>
      </nav>

      <div className="otp-page__content">
        <div className="otp-page__card">
          <div className="otp-page__card-glow-line" />

          {/* Lock icon */}
          <div className="otp-page__icon">
            <div className="otp-page__lock-icon">
              <FiLock size={26} />
            </div>
          </div>

          {/* Secure badge */}
          <div className="otp-page__secure-badge">
            <FiCheckCircle size={12} />
            Secure Verification
          </div>

          {/* Heading */}
          <div className="otp-page__heading">
            <h1 className="otp-page__title">Enter OTP</h1>
            <p className="otp-page__subtitle">
              Enter the 6-digit code sent to{" "}
              <span className="otp-page__email">{email}</span>
            </p>
          </div>

          {/* Form */}
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

            {(error || submitError) && (
              <div className="otp-page__error">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error || submitError}
              </div>
            )}

            {/* Timer + resend inline */}
            <div className="otp-page__timer-row">
              <FiClock size={13} className="otp-page__timer-icon" />
              <span className="otp-page__countdown">{display}</span>
              <span className="otp-page__timer-sep">·</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={!expired}
                className="otp-page__resend-btn"
              >
                Resend Code
              </button>
            </div>

            <button type="submit" className="otp-page__submit" disabled={submitting}>
              <FiCheckCircle size={16} />
              {submitting ? "Creating account…" : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OtpPage;
