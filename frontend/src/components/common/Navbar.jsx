// ─────────────────────────────────────────────────────────────────────────────
// Navbar.jsx
// Transparent by default so it bleeds into the page background
// Gains a glass fill on scroll via .navbar-custom--scrolled
// Pass solid={true} on non-auth pages to force the pink fill
// ─────────────────────────────────────────────────────────────────────────────

import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ solid = false }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navClass = [
    "navbar-custom",
    solid ? "navbar-custom--solid" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={navClass}>
      {/* Logo */}
      <Link to="/" className="navbar-custom__logo">
        SheIs<span className="navbar-custom__logo-accent">Design</span>
      </Link>

      {/* Nav links */}
      <div className="navbar-custom__links">
        {[
          { to: "/events",      label: "Events"      },
          { to: "/gallery",     label: "Gallery"     },
          { to: "/leaderboard", label: "Leaderboard" },
          { to: "/donate",      label: "Donate"      },
          { to: "/volunteer",   label: "Volunteer"   },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`navbar-custom__link ${isActive(to) ? "navbar-custom__link--active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link to="/signup" className="navbar-custom__cta">
        Join
      </Link>
    </nav>
  );
}