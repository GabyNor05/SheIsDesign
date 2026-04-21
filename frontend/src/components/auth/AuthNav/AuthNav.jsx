import { Link } from "react-router-dom";
import PrimaryLogo from "../../ui/Logos/PrimaryLogo/PrimaryLogo";
import "./AuthNav.css";

function AuthNav({ backTo, backLabel = "Back" }) {
  return (
    <nav className="auth-nav">
      <div className="auth-nav__inner">
        <Link to="/" className="auth-nav__logo">
          <PrimaryLogo size="sm" />
        </Link>

        {backTo && (
          <Link to={backTo} className="auth-nav__back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {backLabel}
          </Link>
        )}
      </div>
    </nav>
  );
}

export default AuthNav;