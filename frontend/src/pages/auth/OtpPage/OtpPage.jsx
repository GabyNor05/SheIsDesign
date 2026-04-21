
// import React, { useState, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import { FiMail, FiLock, FiClock, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
// import "./AuthPage.css";


// function OtpPage() {
//   const location = useLocation();
//   const { isRegister } = location.state || { isRegister: false };

//   // OTP state as array for 6 inputs
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [timer, setTimer] = useState(60);
//   const inputRefs = useRef(Array.from({ length: 6 }, () => React.createRef()));

//   // Timer countdown
//   React.useEffect(() => {
//     if (timer > 0) {
//       const interval = setInterval(() => setTimer((t) => t - 1), 1000);
//       return () => clearInterval(interval);
//     }
//   }, [timer]);

//   // Handle OTP input
//   const handleOtpChange = (idx, val) => {
//     if (!/^[0-9]?$/.test(val)) return;
//     const newOtp = [...otp];
//     newOtp[idx] = val;
//     setOtp(newOtp);
//     setError("");
//     // Move to next input
//     if (val && idx < 5) {
//       inputRefs.current[idx + 1].current?.focus();
//     }
//     // Backspace to previous
//     if (!val && idx > 0) {
//       inputRefs.current[idx - 1].current?.focus();
//     }
//   };

//   // Handle paste
//   const handlePaste = (e) => {
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
//     if (pasted.length) {
//       const newOtp = [...otp];
//       for (let i = 0; i < 6; i++) {
//         newOtp[i] = pasted[i] || "";
//       }
//       setOtp(newOtp);
//       // Focus last filled
//       const lastIdx = pasted.length - 1;
//       if (inputRefs.current[lastIdx]) inputRefs.current[lastIdx].current?.focus();
//     }
//   };

//   // Handle submit
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (otp.join("").length !== 6) {
//       setError("Please enter the 6-digit code sent to your email.");
//       return;
//     }
//     // TODO: Verify OTP logic
//   };

//   // Resend code
//   const handleResend = () => {
//     if (timer === 0) {
//       setTimer(60);
//       // TODO: Trigger resend code logic
//     }
//   };

//   return (
//     <section className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden px-4">
//       <div className="hero-glow-1" />
//       <div className="hero-glow-2" />
//       <div className="hero-glow-3" />
//       <div className="form-card relative rounded-[32px] p-8 sm:p-12 w-full max-w-md shadow-xl border border-white/10 bg-gradient-to-br from-[#201A1B] to-[#0D0608] z-10 flex flex-col items-center">
//         <div className="form-card-glow-line" />
//         {/* Top icon */}
//         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border-2 border-primary mb-4 mt-2">
//           <FiMail size={32} className="text-primary" />
//         </div>
//         {/* Heading and subheading */}
//         <h2 className="hero-heading text-2xl md:text-3xl font-extrabold leading-tight text-white mb-2 text-center">
//           Enter OTP
//         </h2>
//         <p className="text-base text-white/70 text-center mb-4">
//           Enter the 6-digit code sent to your email or phone
//         </p>
//         {/* Lock icon and subheader */}
//         <div className="flex items-center justify-center gap-2 mb-6">
//           <FiLock size={20} className="text-accent" />
//           <span className="text-white/80 text-sm font-medium">Secure Verification</span>
//         </div>
//         {/* OTP Inputs */}
//         <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
//           <div className="flex justify-center gap-2 mb-6 w-full">
//             {otp.map((digit, idx) => (
//               <input
//                 key={idx}
//                 ref={inputRefs.current[idx]}
//                 type="text"
//                 inputMode="numeric"
//                 pattern="[0-9]*"
//                 maxLength={1}
//                 value={digit}
//                 onChange={e => handleOtpChange(idx, e.target.value)}
//                 onPaste={handlePaste}
//                 className="input input-bordered w-12 h-16 text-2xl text-center bg-white/5 border-white/10 text-white rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all"
//                 autoFocus={idx === 0}
//               />
//             ))}
//           </div>
//           {/* Timer and resend */}
//           <div className="flex items-center justify-center gap-2 mb-6 w-full">
//             <FiClock size={20} className="text-accent" />
//             <span className="text-white/70 text-sm font-mono">
//               {timer > 0 ? `0:${timer.toString().padStart(2, "0")}` : "00:00"}
//             </span>
//             <span className="text-white/30 mx-2">•</span>
//             <button
//               type="button"
//               className={`text-primary text-sm font-semibold flex items-center gap-1 ${timer > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
//               onClick={handleResend}
//               disabled={timer > 0}
//             >
//               <FiRefreshCw size={16} /> Resend Code
//             </button>
//           </div>
//           {/* Error */}
//           {error && <div className="text-red-400 text-sm text-center mb-2 w-full">{error}</div>}
//           {/* Verify button */}
//           <button type="submit" className="btn hero-btn-primary w-full flex items-center justify-center gap-2 px-8 py-4 text-base font-bold mt-2">
//             <FiCheckCircle size={20} /> Verify
//           </button>
//         </form>
//         {/* Hint text */}
//         <p className="text-xs text-white/40 text-center mt-6">
//           Hint for demo: enter <span className="font-mono text-white/70">123456</span> to simulate verification.
//         </p>
//       </div>
//     </section>
//   );
// }

// export default OtpPage;

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMail } from "react-icons/fi";
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

function OtpPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = location.state?.email || "your email";

  const [otp, setOtp]       = useState(Array(6).fill(""));
  const [error, setError]   = useState("");
  const refs                = useRef(Array.from({ length: 6 }, () => null));
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
    // TODO: verify OTP via API
    navigate("/signup/details");
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
                  key={i}
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
              {!expired ? (
                <span className="otp-page__countdown">{display}</span>
              ) : (
                <button type="button" onClick={reset} className="otp-page__resend-btn">
                  Resend now
                </button>
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