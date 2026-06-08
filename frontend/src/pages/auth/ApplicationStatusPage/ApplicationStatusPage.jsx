import { Link, useLocation } from "react-router-dom";
import { MdPending, MdCheckCircle, MdCancel, MdArrowForward, MdExplore } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";
import "../SignupSuccessPage/SignupSuccessPage.css";

const STATUS_CONFIG = {
  Pending: {
    icon:    <MdPending size={52} style={{ color: "#FE7FAB", filter: "drop-shadow(0 0 16px rgba(196,18,98,0.5))", animation: "check-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.35s both" }} />,
    eyebrow: "Under review",
    heading: "Your application is pending.",
    subtext: "We're reviewing your profile. You'll receive an email once your account is approved.",
    notice: {
      icon:  "pending",
      title: "Profile under review",
      body:  "We'll look over your details and get back to you within 1–2 business days.",
    },
    extra: {
      icon:  "explore",
      title: "Limited access available",
      body:  "While we review your profile, you can browse events, explore the gallery, and check out the leaderboard — you just won't be able to submit work or compete yet.",
    },
    cta: { to: "/", label: "Browse SheIsDesign", secondary: true },
  },

  Approved: {
    icon:    <MdCheckCircle size={52} className="ssp-check-icon" />,
    eyebrow: "Account approved",
    heading: "You're approved!",
    subtext: "Your profile has been verified. You can now submit work and participate in competitions.",
    notice: {
      icon:  "check_circle",
      title: "Account active",
      body:  "Explore events, submit your work, and connect with the SheIsDesign community.",
    },
    extra:   null,
    cta: { to: "/", label: "Start exploring", secondary: false },
  },

  Rejected: {
    icon:    <MdCancel size={52} style={{ color: "rgba(248,235,237,0.3)", filter: "drop-shadow(0 0 8px rgba(0,0,0,0.3))", animation: "check-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.35s both" }} />,
    eyebrow: "Application not approved",
    heading: "We're sorry.",
    subtext: "Your application wasn't approved at this time. Please reach out if you think this is a mistake.",
    notice: {
      icon:  "mail",
      title: "Need help?",
      body:  "Contact us at info@sheisdesign.org and we'll be happy to assist you.",
    },
    extra:   null,
    cta: { to: "mailto:info@sheisdesign.org", label: "Contact us", secondary: false, external: true },
  },
};

function renderHeading(heading, firstName) {
  if (!firstName) return heading;
  return (
    <>
      {heading.replace(".", "")} <span className="ssp-heading__name">{firstName}.</span>
    </>
  );
}

export default function ApplicationStatusPage() {
  const location  = useLocation();
  const { user }  = useAuth();

  const status    = location.state?.status    || user?.status    || "Pending";
  const firstName = location.state?.firstName || user?.givenName || "";
  const email     = location.state?.email     || user?.email     || "";

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;

  return (
    <div className="ssp-root">
      <div className="ssp-glow ssp-glow--1" />
      <div className="ssp-glow ssp-glow--2" />
      <div className="ssp-dots" />

      <nav className="ssp-nav">
        <Link to="/" className="ssp-nav__logo">
          <div className="ssp-nav__logo-mark">
            <span className="material-icons" style={{ fontSize: "18px", color: "white" }}>brush</span>
          </div>
          <span className="ssp-nav__logo-text">SheisDesign</span>
        </Link>
      </nav>

      <main className="ssp-main">
        <div className="ssp-card">
          <div className="ssp-card__glow-line" />

          <div className="ssp-icon-wrap">
            {cfg.icon}
            <div className="ssp-icon-ring" />
          </div>

          <div className="ssp-card__header">
            <span className="ssp-eyebrow">
              <span className="ssp-eyebrow__dot" />
              {cfg.eyebrow}
            </span>
            <h1 className="ssp-heading">
              {renderHeading(cfg.heading, firstName)}
            </h1>
            <p className="ssp-subtext">{cfg.subtext}</p>
            {email && <p className="ssp-subtext" style={{ fontSize: "12px" }}>{email}</p>}
          </div>

          <div className="ssp-notice">
            <div className="ssp-notice__row">
              <span className="material-icons ssp-notice__icon">{cfg.notice.icon}</span>
              <div>
                <p className="ssp-notice__title">{cfg.notice.title}</p>
                <p className="ssp-notice__body">{cfg.notice.body}</p>
              </div>
            </div>
          </div>

          {cfg.extra && (
            <div className="ssp-access">
              <div className="ssp-access__row">
                <span className="material-icons ssp-access__icon">{cfg.extra.icon}</span>
                <div>
                  <p className="ssp-access__title">{cfg.extra.title}</p>
                  <p className="ssp-access__body">{cfg.extra.body}</p>
                </div>
              </div>
            </div>
          )}

          {cfg.cta.secondary ? (
            <Link to={cfg.cta.to} className="ssp-cta" style={{ background: "rgba(248,235,237,0.04)", border: "1px solid rgba(248,235,237,0.08)", boxShadow: "none" }}>
              <MdExplore size={18} />
              {cfg.cta.label}
              <MdArrowForward size={16} className="ssp-cta__arrow" />
            </Link>
          ) : (
            <Link
              to={cfg.cta.to}
              className="ssp-cta"
              {...(cfg.cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {cfg.cta.label}
              <MdArrowForward size={16} className="ssp-cta__arrow" />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
