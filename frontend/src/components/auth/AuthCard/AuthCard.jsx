import "./AuthCard.css";

function AuthCard({ children, wide = false }) {
  return (
    <div className={`auth-card ${wide ? "auth-card--wide" : ""}`}>
      <div className="auth-card__glow-line" aria-hidden="true" />
      {children}
    </div>
  );
}

export default AuthCard;