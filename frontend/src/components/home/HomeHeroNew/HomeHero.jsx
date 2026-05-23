import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HomeHero.css";

// ── Particle canvas ────────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;

    const PINK = "196, 18, 98";
    const ROSE = "254, 64, 129";
    const AMBER = "254, 120, 50";

    const particles = [];
    const PARTICLE_COUNT = 140;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    class Particle {
      constructor() { this.reset(true); }

      reset(initial = false) {
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : H + 10;
        this.size = Math.random() * 2.4 + 0.4;
        this.speedY = -(Math.random() * 0.9 + 0.3);
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.opacity = 0;
        this.targetOpacity = Math.random() * 0.55 + 0.15;
        this.fadeIn = Math.random() * 0.01 + 0.004;
        this.life = 0;
        this.maxLife = Math.random() * 320 + 160;
        const r = Math.random();
        this.color = r > 0.65 ? PINK : r > 0.3 ? ROSE : AMBER;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.03 + 0.008;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.025 + 0.005;
      }

      update() {
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.y += this.speedY;
        this.life++;
        this.pulse += this.pulseSpeed;
        this.wobble += this.wobbleSpeed;

        if (this.life < 50) {
          this.opacity = Math.min(this.targetOpacity, this.opacity + this.fadeIn);
        } else if (this.life > this.maxLife - 50) {
          this.opacity = Math.max(0, this.opacity - this.fadeIn * 1.2);
        }

        if (this.life > this.maxLife || this.y < -10) this.reset();
      }

      draw() {
        const pulsed = this.opacity * (0.8 + Math.sin(this.pulse) * 0.2);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${pulsed})`;
        ctx.fill();
      }
    }

    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // connection lines between nearby particles
    function drawConnections() {
      const MAX_DIST = 90;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.07;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${ROSE}, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="home-hero__canvas" aria-hidden="true" />;
}

// ── Marquee strip ──────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "Brand Identity", "UX Research", "Cybersecurity", "Visual Communication",
  "Fashion Illustration", "Network Defence", "Graphic Design", "Threat Analysis",
  "Communication Design", "Garment Construction", "UI Design", "Ethical Hacking",
  "Motion Graphics", "Textile Design", "Penetration Testing", "Art Direction",
  "Colour Theory", "Digital Forensics", "Fashion Styling", "Interaction Design",
  "Trend Forecasting", "Data Privacy", "Illustration", "Wearable Tech",
  "Typography", "Incident Response", "Pattern Making", "Service Design",
  "Cloud Security", "Editorial Design", "Sustainable Fashion", "Information Architecture",
];

function MarqueeStrip({ reverse = false, speed = 32 }) {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className={`home-hero__marquee ${reverse ? "home-hero__marquee--reverse" : ""}`}>
      <div className="home-hero__marquee-track" style={{ "--speed": `${speed}s` }}>
        {items.map((item, i) => (
          <span key={i} className="home-hero__marquee-item">
            <span className="home-hero__marquee-dot" aria-hidden="true">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Split word animator ────────────────────────────────────────────────────────
function AnimatedWord({ word, delay = 0, accent = false }) {
  return (
    <span className={`home-hero__word ${accent ? "home-hero__word--accent" : ""}`} aria-hidden="true">
      {word.split("").map((char, i) => (
        <span
          key={i}
          className="home-hero__char"
          style={{ animationDelay: `${delay + i * 0.04}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HomeHero() {
  const [phase, setPhase] = useState(0); // 0=loading, 1=title-in, 2=tagline-in, 3=cta-in

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setPhase(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  function scrollDown() {
    const el = document.getElementById("home-features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }

  return (
    <section className="home-hero" aria-label="SheIsDesign hero banner">

      {/* Particle field */}
      <ParticleCanvas />

      {/* Rich background */}
      <div className="home-hero__bg" aria-hidden="true">
        <div className="home-hero__bg-grad home-hero__bg-grad--1" />
        <div className="home-hero__bg-grad home-hero__bg-grad--2" />
        <div className="home-hero__bg-grad home-hero__bg-grad--3" />
      </div>

      {/* Diagonal rule lines */}
      <div className="home-hero__rules" aria-hidden="true">
        <div className="home-hero__rule home-hero__rule--1" />
        <div className="home-hero__rule home-hero__rule--2" />
      </div>

      {/* Centre content */}
      <div className="home-hero__center">

        {/* Eyebrow */}
        <p className={`home-hero__eyebrow ${phase >= 1 ? "home-hero__eyebrow--visible" : ""}`}>
          <span className="home-hero__eyebrow-line" aria-hidden="true" />
          For Women in Design
          <span className="home-hero__eyebrow-line" aria-hidden="true" />
        </p>

        {/* Main headline — character-by-character */}
        <h1 className="home-hero__headline" aria-label="SheIs Design">
          {phase >= 1 && (
            <>
              <AnimatedWord word="SheIs" delay={0.1} />
              <AnimatedWord word="Design" delay={0.35} accent />
            </>
          )}
        </h1>

        {/* Tagline */}
        <p className={`home-hero__tagline ${phase >= 2 ? "home-hero__tagline--visible" : ""}`}>
          Where{" "}
          <span className="home-hero__tagline-accent">Creativity</span>
          {" "}Meets{" "}
          <span className="home-hero__tagline-accent">Mentorship</span>
          .
        </p>

        {/* CTA row */}
        <div className={`home-hero__cta-row ${phase >= 3 ? "home-hero__cta-row--visible" : ""}`}>
          <Link to="/register" className="home-hero__btn home-hero__btn--primary">
            Join the Community
          </Link>
          <Link to="/events" className="home-hero__btn home-hero__btn--ghost">
            Browse Events
          </Link>
        </div>

        {/* Scroll cue */}
        <button
          className={`home-hero__scroll ${phase >= 3 ? "home-hero__scroll--visible" : ""}`}
          onClick={scrollDown}
          aria-label="Scroll down"
        >
          <div className="home-hero__scroll-ring">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 2v8M2 7l4 4 4-4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="home-hero__scroll-label">Scroll</span>
        </button>
      </div>

      {/* Bottom marquee strips */}
      <div className={`home-hero__marquee-wrap ${phase >= 3 ? "home-hero__marquee-wrap--visible" : ""}`}>
        <MarqueeStrip speed={52} />
        <MarqueeStrip reverse speed={46} />
      </div>

    </section>
  );
}