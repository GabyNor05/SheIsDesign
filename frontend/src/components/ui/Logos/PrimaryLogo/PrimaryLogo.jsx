import "./PrimaryLogo.css";

/* Full logo: icon mark + wordmark, used in navbars and headers */
function PrimaryLogo({ size = "md" }) {
  return (
    <div className={`primary-logo primary-logo--${size}`}>
      <div className="primary-logo__mark">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      </div>
      <span className="primary-logo__wordmark">SheIsDesign</span>
    </div>
  );
}

export default PrimaryLogo;