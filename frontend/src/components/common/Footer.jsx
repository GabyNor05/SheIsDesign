import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-neutral text-white px-8 py-6 flex items-center justify-between text-sm">
      <p className="text-white/70">© 2025 SheIsDesign. All rights reserved.</p>
      <div className="flex gap-4">
        <Link to="/donate" className="text-white/70 hover:text-accent transition-colors">Donate</Link>
        <Link to="/volunteer" className="text-white/70 hover:text-accent transition-colors">Volunteer</Link>
      </div>
    </footer>
  );
}

export default Footer;