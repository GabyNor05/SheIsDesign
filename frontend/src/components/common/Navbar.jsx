import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const hasLoggedInBefore = localStorage.getItem("hasLoggedInBefore") === "true";

  function handleLogout() {
    logout();
    navigate("/");
  }

  function renderAuthButton() {
    if (isAuthenticated) {
      return (
        <button onClick={handleLogout} className="btn btn-sm bg-white text-primary border-none hover:bg-accent hover:text-white">
          Log Out
        </button>
      );
    }
    if (hasLoggedInBefore) {
      return (
        <Link to="/login" className="btn btn-sm bg-white text-primary border-none hover:bg-accent hover:text-white">
          Log In
        </Link>
      );
    }
    return (
      <Link to="/signup" className="btn btn-sm bg-white text-primary border-none hover:bg-accent hover:text-white">
        Join
      </Link>
    );
  }

  return (
    <div className="navbar bg-primary px-8 sticky top-0 z-50 shadow-lg">

      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="text-primary-content font-bold text-xl tracking-wide">
          SheIs<span className="text-accent">Design</span>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-none hidden md:flex gap-6 mr-6">
        <Link to="/events" className="text-primary-content hover:text-accent transition-colors text-sm font-medium">Events</Link>
        <Link to="/gallery" className="text-primary-content hover:text-accent transition-colors text-sm font-medium">Gallery</Link>
        <Link to="/leaderboard" className="text-primary-content hover:text-accent transition-colors text-sm font-medium">Leaderboard</Link>
        <Link to="/donate" className="text-primary-content hover:text-accent transition-colors text-sm font-medium">Donate</Link>
        <Link to="/volunteer" className="text-primary-content hover:text-accent transition-colors text-sm font-medium">Volunteer</Link>
      </div>

      {/* Join / Log In / Log Out button */}
      <div className="flex-none">
        {renderAuthButton()}
      </div>

    </div>
  );
}

export default Navbar;