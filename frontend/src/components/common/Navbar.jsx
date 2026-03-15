import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar bg-primary px-8">

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

      {/* Sign In button */}
      <div className="flex-none">
        <Link to="/login" className="btn btn-sm bg-white text-primary border-none hover:bg-accent hover:text-white">
          Sign In
        </Link>
      </div>

    </div>
  );
}

export default Navbar;