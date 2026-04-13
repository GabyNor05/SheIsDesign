import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlowBackground from "../../../components/auth/GlowBackground/GlowBackground";
import AuthNav from "../../../components/auth/AuthNav/AuthNav";
import PrimaryButton from "../../../components/ui/Buttons/PrimaryButton/PrimaryButton";
import "./SignupSuccessPage.css";

function SignupSuccessPage() {
  const navigate    = useNavigate();
  const [visible, setVisible] = useState(false);

  const saved      = JSON.parse(sessionStorage.getItem("signup_basic") || "{}");
  const firstName  = saved.firstName || "";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="signup-success-page">
      <GlowBackground />
      <AuthNav />

      <div className={`signup-success-page__content ${visible ? "signup-success-page__content--visible" : ""}`}>

        {/* Check circle */}
        <div className="signup-success-page__circle">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C41262" />
                <stop offset="100%" stopColor="#FE4081" />
              </linearGradient>
            </defs>
            <polyline points="20 6 9 17 4 12" stroke="url(#checkGrad)" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Heading */}
        <div className="signup-success-page__heading">
          <h1 className="signup-success-page__title">
            You're all set{firstName ? `, ${firstName}` : ""}.
          </h1>
          <p className="signup-success-page__subtitle">
            Your account has been created.{" "}
            <span className="signup-success-page__highlight">Welcome to SheIsDesign.</span>
          </p>
        </div>

        {/* CTA */}
        <div className="signup-success-page__cta">
          <PrimaryButton onClick={() => navigate("/")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go to homepage
          </PrimaryButton>
        </div>

        <div className="signup-success-page__rule" />

        <p className="signup-success-page__confirm">
          A confirmation has been sent to your email address.
        </p>
      </div>
    </div>
  );
}

export default SignupSuccessPage;