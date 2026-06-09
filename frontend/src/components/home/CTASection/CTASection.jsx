import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MdPersonAdd } from "react-icons/md";
import "./CTASection.css";

function CTASection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`cta-section ${visible ? "cta-section--visible" : ""}`}>

      {/* ── Animated background layer ── */}
      <div className="cta-bg-gradient" />
      <div className="cta-orb cta-orb--1" />
      <div className="cta-orb cta-orb--2" />
      <div className="cta-orb cta-orb--3" />

      {/* ── Floating geometric shapes ── */}
      <div className="cta-shape cta-shape--ring-1" />
      <div className="cta-shape cta-shape--ring-2" />
      <div className="cta-shape cta-shape--diamond-1" />
      <div className="cta-shape cta-shape--diamond-2" />
      <div className="cta-shape cta-shape--dot-1" />
      <div className="cta-shape cta-shape--dot-2" />
      <div className="cta-shape cta-shape--dot-3" />
      <div className="cta-shape cta-shape--dot-4" />
      <div className="cta-shape cta-shape--dot-5" />

      {/* ── Content ── */}
      <div className="cta-inner">

        <div className="cta-eyebrow">
          <div className="cta-eyebrow-line" />
          <span>Ready to Begin?</span>
          <div className="cta-eyebrow-line" />
        </div>

        <h2 className="cta-heading">
          <span className="cta-heading__light">Your design story</span>
          <br />
          <span className="cta-heading__gradient">starts here.</span>
        </h2>

        <p className="cta-subtext">
          Join a growing community of talented women designers.<br />
          Compete, create, and be celebrated.
        </p>

        <div className="cta-actions">
          <Link to="/signup" className="cta-btn cta-btn--primary">
            <MdPersonAdd size={18} />
            Create Your Free Account
          </Link>
          <Link to="/events" className="cta-btn cta-btn--ghost">
            Browse Events
          </Link>
        </div>

        <span className="cta-hint">No credit card required · Free to join</span>

        {/* ── Stats row ── */}
        <div className="cta-stats">
          {[
            { value: "320+", label: "Designers" },
            { value: "48",   label: "Events" },
            { value: "12k+", label: "Points Awarded" },
          ].map((s, i) => (
            <>
              <div key={s.label} className="cta-stat">
                <span className="cta-stat__value">{s.value}</span>
                <span className="cta-stat__label">{s.label}</span>
              </div>
              {i < 2 && <div key={`div-${i}`} className="cta-stat-divider" />}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CTASection;