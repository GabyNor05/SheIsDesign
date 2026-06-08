import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Lock,
  ArrowRight,
  X,
  Lightning,
  Users,
  BookOpen,
  SignIn,
} from "@phosphor-icons/react";
import { useAuth } from "../../context/AuthContext";
import "./DonatePage.css";

// ─── Preset amounts ───────────────────────────────────────────────────────────
const PRESETS = ["R100", "R250", "R500", "R1 000", "R2 500", "R5 000"];

const ALLOCATION = [
  { icon: <Lightning size={16} weight="fill" />, label: "Events & Competitions", pct: 55 },
  { icon: <BookOpen size={16} weight="fill" />,  label: "Student Resources",     pct: 30 },
  { icon: <Users size={16} weight="fill" />,     label: "Community Workshops",   pct: 15 },
];

// ─── Login prompt modal ───────────────────────────────────────────────────────
function LoginPromptModal({ onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="dp-modal-backdrop" onClick={onClose}>
      <div className="dp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dp-modal__glow" />

        <button className="dp-modal__close" onClick={onClose}>
          <X size={15} />
        </button>

        <div className="dp-modal__icon">
          <Heart size={22} weight="fill" color="#FE4081" />
        </div>

        <h2 className="dp-modal__title">Log in to donate</h2>
        <p className="dp-modal__sub">
          You need a SheIsDesign account to make a donation. It only takes a minute to join.
        </p>

        <div className="dp-modal__actions">
          <Link to="/login" className="dp-modal__btn-primary">
            <SignIn size={16} weight="bold" />
            Log in
          </Link>
          <Link to="/login?mode=signup" className="dp-modal__btn-secondary">
            Create an account
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        <p className="dp-modal__note">
          Already supporting us? Your donation history is saved to your profile.
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DonatePage() {
  const { user } = useAuth();

  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  function handlePreset(val) {
    setSelected(val);
    setCustom("");
    setAmountError("");
  }

  function handleCustom(val) {
    setSelected(null);
    setCustom(val);
    setAmountError("");

    const num = Number(val);
    if (val && (num <= 0 || isNaN(num))) {
      setAmountError("Please enter a valid amount greater than R0.");
    }
  }

  const activeAmount = selected ?? (custom && Number(custom) > 0 ? `R ${custom}` : null);

  function handleContinue() {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!activeAmount) return;

    // TODO: wire to payment gateway
    alert(`Continuing to payment: ${activeAmount}`);
  }

  return (
    <div className="dp-page">
      {/* Background */}
      <div className="dp-bg">
        <div className="dp-bg__orb dp-bg__orb--1" />
        <div className="dp-bg__orb dp-bg__orb--2" />
        <div className="dp-bg__gradient" />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className={`dp-hero ${heroVisible ? "dp-hero--visible" : ""}`}>
        <div className="dp-hero__inner">
          <div className="dp-hero__eyebrow">
            <div className="dp-hero__eyebrow-line" />
            <span>Support SheIsDesign</span>
          </div>

          <h1 className="dp-hero__title">
            Make a <span className="dp-hero__title--accent">difference.</span>
          </h1>

          <p className="dp-hero__sub">
            Every contribution goes directly towards events, student resources, and the SheIsDesign community. No fluff — just impact.
          </p>

          <div className="dp-hero__trust">
            {[
              { icon: <Lock size={12} />, label: "Secure checkout" },
              { icon: <Heart size={12} />, label: "100% to community" },
              { icon: <Users size={12} />, label: "1,200+ designers supported" },
            ].map((t) => (
              <div key={t.label} className="dp-trust-item">
                {t.icon}
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <section className="dp-body">
        <div className="dp-body__inner">

          {/* LEFT — donation card */}
          <div className="dp-card">
            <div className="dp-card__glow" />

            <div className="dp-card__label">
              <Heart size={12} weight="fill" color="#FE4081" />
              <span>General Donation</span>
            </div>

            <h2 className="dp-card__title">Choose an amount</h2>

            {/* Preset grid */}
            <div className="dp-presets">
              {PRESETS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => handlePreset(amt)}
                  className={`dp-preset ${selected === amt ? "dp-preset--active" : ""}`}
                >
                  {amt}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="dp-divider">
              <span>or enter your own</span>
            </div>

            {/* Custom input */}
            <div className="dp-input-wrap">
              <span className="dp-input-prefix">R</span>
              <input
                type="number"
                min={1}
                placeholder="Enter amount"
                value={custom}
                onChange={(e) => handleCustom(e.target.value)}
                className={`dp-input ${custom && Number(custom) > 0 ? "dp-input--filled" : ""} ${amountError ? "dp-input--error" : ""}`}
              />
            </div>

            {/* Amount validation error */}
            {amountError && (
              <p className="dp-amount-error">{amountError}</p>
            )}

            {/* Selected summary */}
            {activeAmount && (
              <div className="dp-summary">
                <Heart size={13} weight="fill" color="#FE4081" />
                <span>
                  Donating <strong>{activeAmount}</strong> to the SheIsDesign General Fund
                </span>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleContinue}
              disabled={!activeAmount || !!amountError}
              className={`dp-cta ${!activeAmount || amountError ? "dp-cta--disabled" : ""}`}
            >
              {!user ? (
                <>
                  <Lock size={15} weight="bold" />
                  Log in to donate
                </>
              ) : (
                <>
                  <ArrowRight size={15} weight="bold" />
                  Continue to payment
                </>
              )}
            </button>

            {!user && (
              <p className="dp-login-hint">
                Don't have an account?{" "}
                <Link to="/login?mode=signup" className="dp-login-hint__link">
                  Create an account
                </Link>
              </p>
            )}
          </div>

          {/* RIGHT — allocation breakdown */}
          <div className="dp-allocation">
            <div className="dp-allocation__label">
              <span>Where your money goes</span>
            </div>

            <h3 className="dp-allocation__title">100% to the community</h3>
            <p className="dp-allocation__sub">
              Every rand is split across three pillars — no admin fees, no overhead deductions.
            </p>

            <div className="dp-allocation__items">
              {ALLOCATION.map((item) => (
                <div key={item.label} className="dp-alloc-item">
                  <div className="dp-alloc-item__top">
                    <div className="dp-alloc-item__icon">{item.icon}</div>
                    <div className="dp-alloc-item__meta">
                      <span className="dp-alloc-item__label">{item.label}</span>
                      <span className="dp-alloc-item__pct">{item.pct}%</span>
                    </div>
                  </div>
                  <div className="dp-alloc-bar">
                    <div
                      className="dp-alloc-bar__fill"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="dp-secure-note">
              <Lock size={12} />
              <span>Secure payment · All contributions acknowledged via email</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Login modal ───────────────────────────────────────────────── */}
      {showLoginModal && (
        <LoginPromptModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}