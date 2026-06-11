import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__left">
        <Link to="/" className="app-footer__logo">
          SheIs<span className="app-footer__logo-accent">Design</span>
        </Link>
        <div className="app-footer__sep" />
        <p className="app-footer__copy">© 2026 SheIsDesign</p>
      </div>
      <div className="app-footer__right">
        <Link to="/terms"   className="app-footer__link">Terms</Link>
        <div className="app-footer__dot" />
        <Link to="/privacy" className="app-footer__link">Privacy</Link>
      </div>
    </footer>
  );
}

export default Footer;