import { useNavigate } from "react-router-dom";
import { X } from "@phosphor-icons/react";
import "./LoginPromptModal.css";

export default function LoginPromptModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="login-modal__overlay">
      <div className="login-modal__card">
        <button className="login-modal__close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>

        <div className="login-modal__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C9.243 2 7 4.243 7 7v2H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 00-2-2h-2V7c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v2H9V7c0-1.654 1.346-3 3-3zm0 9a2 2 0 110 4 2 2 0 010-4z" fill="#FE4081"/>
          </svg>
        </div>

        <div className="login-modal__text">
          <h3 className="login-modal__title">Log in to apply</h3>
          <p className="login-modal__subtitle">
            You need an account to enter events, track your submissions, and
            earn points on the leaderboard.
          </p>
        </div>

        <div className="login-modal__actions">
          <button className="login-modal__btn-login" onClick={() => navigate("/login")}>
            Log in
          </button>
          <button className="login-modal__btn-signup" onClick={() => navigate("/signup")}>
            Create an account
          </button>
          <button className="login-modal__btn-dismiss" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}