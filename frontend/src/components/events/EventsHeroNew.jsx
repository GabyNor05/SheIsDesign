import { useEffect, useState } from "react";
import "./EventsHeroNew.css";

export default function EventsHeroNew() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCollapsed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  function handleScrollDown() {
    const next = document.getElementById("events-featured");
    if (next) {
      next.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    }
  }

  return (
    <section className="events-hero-new">

      {/* Rich pink background gradient */}
      <div className="events-hero-new__bg-gradient" />

      {/* Moving orb */}
      <div className="events-hero-new__orb" />

      {/* Minimal decorative accents only */}
      <div className="events-hero-new__shape-rect" />
      <div className="events-hero-new__shape-slash" />

      {/* Text block */}
      <div className={`events-hero-new__text${collapsed ? " events-hero-new__text--collapsed" : ""}`}>

        <p className="events-hero-new__eyebrow" aria-hidden="true">
          Competitions &amp; Challenges
        </p>

        {/* Phase 1 — stacked */}
        {!collapsed && (
          <div className="events-hero-new__stacked" aria-hidden="true">
            <span className="events-hero-new__word events-hero-new__word--1">
              Compete.
            </span>
            <span className="events-hero-new__word events-hero-new__word--accent events-hero-new__word--2">
              Create.
            </span>
            <span className="events-hero-new__word events-hero-new__word--3">
              Get Seen.
            </span>
          </div>
        )}

        {/* Phase 2 — inline sentence */}
        {collapsed && (
          <div className="events-hero-new__inline" aria-label="Compete. Create. Get Seen.">
            <span className="events-hero-new__inline-word">Compete.</span>
            <span className="events-hero-new__inline-word events-hero-new__inline-word--accent">
              Create.
            </span>
            <span className="events-hero-new__inline-word">Get Seen.</span>
          </div>
        )}
      </div>

      {/* Scroll CTA */}
      <button
        className="events-hero-new__scroll"
        onClick={handleScrollDown}
        aria-label="Scroll to events"
      >
        <span className="events-hero-new__scroll-label">See more</span>
        <div className="events-hero-new__scroll-arrow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 2v10M3 8l4 4 4-4"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
    </section>
  );
}