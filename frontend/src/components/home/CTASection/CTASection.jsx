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

      {/* Ambient glows */}
      <div className="cta-glow cta-glow--left" />
      <div className="cta-glow cta-glow--right" />

      <div className="cta-inner">
        <div className="cta-card">

          {/* Top glow line */}
          <div className="cta-card-glow-line" />

          {/* Animated grid background */}
          <div className="cta-grid-bg" />

          {/* Floating orbs inside card */}
          <div className="cta-orb cta-orb--1" />
          <div className="cta-orb cta-orb--2" />
          <div className="cta-orb cta-orb--3" />

          {/* Corner icons */}
          {["tl", "tr", "bl", "br"].map((pos) => (
            <div key={pos} className={`cta-corner cta-corner--${pos}`}>
              <div className="cta-corner__dot" />
            </div>
          ))}

          {/* Content */}
          <div className="cta-content">
            <span className="cta-eyebrow">Ready to Begin?</span>

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
              <Link to="/register" className="cta-btn cta-btn--primary">
                <MdPersonAdd size={20} />
                Create Your Free Account
              </Link>
              <Link to="/events" className="cta-btn cta-btn--ghost">
                Browse Events
              </Link>
            </div>

            <span className="cta-hint">No credit card required · Free to join</span>
          </div>

          {/* Decorative stats */}
          <div className="cta-stats">
            {[
              { value: "320+", label: "Designers" },
              { value: "48", label: "Events" },
              { value: "12k+", label: "Points Awarded" },
            ].map((s) => (
              <div key={s.label} className="cta-stat">
                <span className="cta-stat__value">{s.value}</span>
                <span className="cta-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;