
import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FiMail, FiLock, FiClock, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import "./AuthPage.css";


function OtpPage() {
  const location = useLocation();
  const { isRegister } = location.state || { isRegister: false };

  // OTP state as array for 6 inputs
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef(Array.from({ length: 6 }, () => React.createRef()));

  // Timer countdown
  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle OTP input
  const handleOtpChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    setError("");
    // Move to next input
    if (val && idx < 5) {
      inputRefs.current[idx + 1].current?.focus();
    }
    // Backspace to previous
    if (!val && idx > 0) {
      inputRefs.current[idx - 1].current?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (pasted.length) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || "";
      }
      setOtp(newOtp);
      // Focus last filled
      const lastIdx = pasted.length - 1;
      if (inputRefs.current[lastIdx]) inputRefs.current[lastIdx].current?.focus();
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }
    // TODO: Verify OTP logic
  };

  // Resend code
  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
      // TODO: Trigger resend code logic
    }
  };

  return (
    <section className="hero-section min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />
      <div className="hero-glow-3" />
      <div className="form-card relative rounded-[32px] p-8 sm:p-12 w-full max-w-md shadow-xl border border-white/10 bg-gradient-to-br from-[#201A1B] to-[#0D0608] z-10 flex flex-col items-center">
        <div className="form-card-glow-line" />
        {/* Top icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border-2 border-primary mb-4 mt-2">
          <FiMail size={32} className="text-primary" />
        </div>
        {/* Heading and subheading */}
        <h2 className="hero-heading text-2xl md:text-3xl font-extrabold leading-tight text-white mb-2 text-center">
          Enter OTP
        </h2>
        <p className="text-base text-white/70 text-center mb-4">
          Enter the 6-digit code sent to your email or phone
        </p>
        {/* Lock icon and subheader */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <FiLock size={20} className="text-accent" />
          <span className="text-white/80 text-sm font-medium">Secure Verification</span>
        </div>
        {/* OTP Inputs */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="flex justify-center gap-2 mb-6 w-full">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs.current[idx]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(idx, e.target.value)}
                onPaste={handlePaste}
                className="input input-bordered w-12 h-16 text-2xl text-center bg-white/5 border-white/10 text-white rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all"
                autoFocus={idx === 0}
              />
            ))}
          </div>
          {/* Timer and resend */}
          <div className="flex items-center justify-center gap-2 mb-6 w-full">
            <FiClock size={20} className="text-accent" />
            <span className="text-white/70 text-sm font-mono">
              {timer > 0 ? `0:${timer.toString().padStart(2, "0")}` : "00:00"}
            </span>
            <span className="text-white/30 mx-2">•</span>
            <button
              type="button"
              className={`text-primary text-sm font-semibold flex items-center gap-1 ${timer > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
              onClick={handleResend}
              disabled={timer > 0}
            >
              <FiRefreshCw size={16} /> Resend Code
            </button>
          </div>
          {/* Error */}
          {error && <div className="text-red-400 text-sm text-center mb-2 w-full">{error}</div>}
          {/* Verify button */}
          <button type="submit" className="btn hero-btn-primary w-full flex items-center justify-center gap-2 px-8 py-4 text-base font-bold mt-2">
            <FiCheckCircle size={20} /> Verify
          </button>
        </form>
        {/* Hint text */}
        <p className="text-xs text-white/40 text-center mt-6">
          Hint for demo: enter <span className="font-mono text-white/70">123456</span> to simulate verification.
        </p>
      </div>
    </section>
  );
}

export default OtpPage;
