import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdCheckCircle, MdArrowForward, MdExplore } from "react-icons/md";
import { FiClock } from "react-icons/fi";
import "./SignupSuccessPage.css";

const REDIRECT_SECONDS = 15;

export default function SignupSuccessPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const firstName = location.state?.firstName || "there";

  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, navigate]);

  // Progress = how much of the circle is filled (0 → full as seconds count down)
  const progress = ((REDIRECT_SECONDS - seconds) / REDIRECT_SECONDS) * 100;
  const circumference = 2 * Math.PI * 28; // r=28
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="ssp-root">
      {/* Background glows */}
      <div className="ssp-glow ssp-glow--1" />
      <div className="ssp-glow ssp-glow--2" />
      <div className="ssp-dots" />

      {/* Logo */}
      <nav className="ssp-nav">
        <Link to="/" className="ssp-nav__logo">
          <div className="ssp-nav__logo-mark">
            <span className="material-icons" style={{ fontSize: "18px", color: "white" }}>brush</span>
          </div>
          <span className="ssp-nav__logo-text">SheisDesign</span>
        </Link>
      </nav>

      {/* Centred card */}
      <main className="ssp-main">
        <div className="ssp-card">
          <div className="ssp-card__glow-line" />

          {/* Check icon */}
          <div className="ssp-icon-wrap">
            <MdCheckCircle size={52} className="ssp-check-icon" />
            <div className="ssp-icon-ring" />
          </div>

          {/* Heading */}
          <div className="ssp-card__header">
            <span className="ssp-eyebrow">
              <span className="ssp-eyebrow__dot" />
              Application submitted
            </span>
            <h1 className="ssp-heading">
              You're in, <span className="ssp-heading__name">{firstName}.</span>
            </h1>
            <p className="ssp-subtext">
              Welcome to SheIsDesign! Your profile has been submitted for review.
            </p>
          </div>

          {/* Status notice */}
          <div className="ssp-notice">
            <div className="ssp-notice__row">
              <span className="material-icons ssp-notice__icon">pending</span>
              <div>
                <p className="ssp-notice__title">Profile under review</p>
                <p className="ssp-notice__body">
                  We'll look over your details and send you an email once your account is fully approved. This usually takes 1–2 business days.
                </p>
              </div>
            </div>
          </div>

          {/* Limited access notice */}
          <div className="ssp-access">
            <div className="ssp-access__row">
              <span className="material-icons ssp-access__icon">explore</span>
              <div>
                <p className="ssp-access__title">Limited access available now</p>
                <p className="ssp-access__body">
                  While we review your profile, you can browse events, explore the gallery, and check out the leaderboard — you just won't be able to submit work or compete yet.
                </p>
              </div>
            </div>
          </div>

          {/* Countdown + CTA */}
          <div className="ssp-footer">
            {/* Circular countdown */}
            <div className="ssp-countdown">
              <svg width="68" height="68" viewBox="0 0 68 68">
                {/* Track */}
                <circle
                  cx="34" cy="34" r="28"
                  fill="none"
                  stroke="rgba(248,235,237,0.06)"
                  strokeWidth="3"
                />
                {/* Progress */}
                <circle
                  cx="34" cy="34" r="28"
                  fill="none"
                  stroke="url(#ssp-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 34 34)"
                  style={{ transition: "stroke-dashoffset 0.9s linear" }}
                />
                <defs>
                  <linearGradient id="ssp-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C41262" />
                    <stop offset="100%" stopColor="#FE4081" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="ssp-countdown__number">{seconds}</span>
            </div>

            <div className="ssp-footer__text">
              <p className="ssp-footer__redirecting">
                Taking you to the homepage in <strong>{seconds}s</strong>
              </p>
              <p className="ssp-footer__hint">or jump straight in —</p>
            </div>
          </div>

          {/* Manual CTA */}
          <Link to="/" className="ssp-cta">
            <MdExplore size={18} />
            Browse SheIsDesign
            <MdArrowForward size={16} className="ssp-cta__arrow" />
          </Link>
        </div>
      </main>
    </div>
  );
}