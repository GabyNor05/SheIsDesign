import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      {/* Top glow line */}
      <div className="site-footer__glow-line" />

      <div className="site-footer__inner">

        {/* Left — logo + tagline */}
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo">
            SheIs<span className="site-footer__logo-accent">Design</span>
          </Link>
          <p className="site-footer__tagline">
            Empowering young South African women in design.
          </p>
        </div>

        {/* Centre — nav links */}
        <div className="site-footer__links">
          <div className="site-footer__links-group">
            <span className="site-footer__links-heading">Explore</span>
            <Link to="/events"      className="site-footer__link">Events</Link>
            <Link to="/gallery"     className="site-footer__link">Gallery</Link>
            <Link to="/leaderboard" className="site-footer__link">Leaderboard</Link>
          </div>
          <div className="site-footer__links-group">
            <span className="site-footer__links-heading">Get Involved</span>
            <Link to="/donate"    className="site-footer__link">Donate</Link>
            <Link to="/signup"    className="site-footer__link">Join</Link>
            <Link to="/volunteer" className="site-footer__link">Volunteer</Link>
          </div>
        </div>

        {/* Right — CTA */}
        <div className="site-footer__cta">
          <p className="site-footer__cta-text">Ready to start your design journey?</p>
          <Link to="/signup" className="site-footer__cta-btn">
            Join SheIsDesign
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="site-footer__bottom">
        <p className="site-footer__copy">© 2026 SheIsDesign. All rights reserved.</p>
        <div className="site-footer__bottom-links">
          <Link to="/terms"   className="site-footer__bottom-link">Terms</Link>
          <Link to="/privacy" className="site-footer__bottom-link">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;