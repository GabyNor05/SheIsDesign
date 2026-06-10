import { Link } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="nf-root">
      <div className="nf-glow" aria-hidden="true" />

      <div className="nf-content">
        <div className="nf-code" aria-hidden="true">
          <span className="nf-code__4">4</span>
          <span className="nf-code__0">0</span>
          <span className="nf-code__4">4</span>
        </div>

        <p className="nf-eyebrow">Page not found</p>
        <h1 className="nf-title">You've wandered off the canvas.</h1>
        <p className="nf-sub">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn nf-btn--primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
