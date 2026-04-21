// ─────────────────────────────────────────────────────────────────────────────
// Navbar.jsx — Auth-aware navbar
// Never logged in:    shows "Join"    → /signup
// Returning user:     shows "Log In"  → /login
// Logged in:          shows avatar/initials + dropdown with Profile + Log out
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdPerson, MdLogout, MdAccountCircle } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

// ── Avatar with dropdown ──────────────────────────────────────────────────────
function UserAvatar({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Get initials from fullname
  const initials = user.fullname
    ? user.fullname.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div className="nav-avatar" ref={ref}>
      <button
        className="nav-avatar__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Profile menu"
      >
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={user.fullname || "Profile"}
            className="nav-avatar__img"
          />
        ) : (
          <div className="nav-avatar__initials">{initials}</div>
        )}
        <div className="nav-avatar__status" />
      </button>

      {open && (
        <div className="nav-avatar__dropdown">
          <div className="nav-avatar__dropdown-glow" />

          {/* User info */}
          <div className="nav-avatar__dropdown-user">
            <span className="nav-avatar__dropdown-name">
              {user.fullname || "Designer"}
            </span>
            <span className="nav-avatar__dropdown-email">{user.email}</span>
          </div>

          <div className="nav-avatar__dropdown-divider" />

          {/* Links */}
          <Link
            to="/profile"
            className="nav-avatar__dropdown-item"
            onClick={() => setOpen(false)}
          >
            <MdAccountCircle size={15} />
            My Profile
          </Link>

          <div className="nav-avatar__dropdown-divider" />

          <button
            className="nav-avatar__dropdown-item nav-avatar__dropdown-item--danger"
            onClick={() => { setOpen(false); onLogout(); }}
          >
            <MdLogout size={15} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
export default function Navbar({ solid = false }) {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { user, logout, hasLoggedInBefore } = useAuth();

  const isActive = (path) => location.pathname === path;

  const navClass = ["navbar-custom", solid ? "navbar-custom--solid" : ""]
    .filter(Boolean)
    .join(" ");

  function handleLogout() {
    logout();
    navigate("/");
  }

  function renderAuthControl() {
    if (user) {
      return <UserAvatar user={user} onLogout={handleLogout} />;
    }
    if (hasLoggedInBefore) {
      return <Link to="/login" className="navbar-custom__cta">Log In</Link>;
    }
    return <Link to="/signup" className="navbar-custom__cta">Join</Link>;
  }

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

      {/* Right side — Avatar, Log In, or Join */}
      {renderAuthControl()}
    </nav>
  );
}