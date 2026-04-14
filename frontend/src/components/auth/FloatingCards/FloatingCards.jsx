// ─────────────────────────────────────────────────────────────────────────────
// FloatingCards.jsx — Auto-cycling stat cards for LoginPage right panel
// Cards rotate every 3.5s with Framer Motion AnimatePresence
// On mobile: falls back to touch/drag swipe via drag="x"
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEmojiEvents, MdPeople, MdDashboard, MdStar } from "react-icons/md";

const CARDS = [
  {
    id: "events",
    icon: <MdEmojiEvents size={24} />,
    stat: "48",
    label: "Live Events",
    sub: "Open competitions this semester",
    bg: "#1a0610",
    border: "rgba(196,18,98,0.7)",
    glow: "rgba(196,18,98,0.35)",
  },
  {
    id: "designers",
    icon: <MdPeople size={24} />,
    stat: "1,200+",
    label: "Designers",
    sub: "Active members on the platform",
    bg: "#150510",
    border: "rgba(254,64,129,0.6)",
    glow: "rgba(254,64,129,0.3)",
  },
  {
    id: "projects",
    icon: <MdDashboard size={24} />,
    stat: "320+",
    label: "Projects",
    sub: "Submitted this year",
    bg: "#1c0812",
    border: "rgba(254,127,171,0.55)",
    glow: "rgba(254,127,171,0.25)",
  },
  {
    id: "ranked",
    icon: <MdStar size={24} />,
    stat: "Top 3",
    label: "SA Rankings",
    sub: "Women in design, nationally recognised",
    bg: "#180610",
    border: "rgba(196,18,98,0.65)",
    glow: "rgba(196,18,98,0.3)",
  },
];

// Stack positions: more separation so back cards are clearly visible
const STACK = [
  // front card
  { zIndex: 3, rotate: 0,   x: 0,   y: 0,   scale: 1,    opacity: 1    },
  // mid card — peek more to the right and down
  { zIndex: 2, rotate: 6,   x: 36,  y: -28, scale: 0.93, opacity: 0.8  },
  // back card — even further
  { zIndex: 1, rotate: 11,  x: 66,  y: -52, scale: 0.86, opacity: 0.55 },
];

export default function FloatingCards() {
  const [active, setActive] = useState(0);

  // Auto-cycle every 3.5s
  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % CARDS.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  // Build the ordered list: active first, then next, then one after
  const ordered = [0, 1, 2].map((offset) => ({
    card: CARDS[(active + offset) % CARDS.length],
    stackPos: STACK[offset],
    offset,
  }));

  return (
    <div className="fc-wrapper">
      {/* Heading above the stack */}
      <div className="fc-header">
        <div className="fc-header__eyebrow">
          <div className="fc-header__dot" />
          <span>Platform highlights</span>
        </div>
        <h2 className="fc-header__title">
          Built for women<br />who lead.
        </h2>
        <p className="fc-header__sub">
          SheIsDesign is a space to compete,<br />
          connect, and be recognised.
        </p>
      </div>

      {/* Card stack */}
      <div className="fc-stack">
        <AnimatePresence mode="popLayout">
          {ordered.map(({ card, stackPos, offset }) => (
            <motion.div
              key={card.id}
              className="fc-card"
              style={{
                background: card.bg,
                borderColor: card.border,
                zIndex: stackPos.zIndex,
                boxShadow: `0 0 28px ${card.glow}, 0 0 0 1px ${card.border}, 0 16px 48px rgba(13,6,8,0.7)`,
              }}
              initial={
                offset === 0
                  ? { opacity: 0, scale: 0.88, rotate: -8, x: -20 }
                  : false
              }
              animate={{
                opacity: stackPos.opacity,
                scale: stackPos.scale,
                rotate: stackPos.rotate,
                x: stackPos.x,
                y: stackPos.y,
              }}
              exit={{
                opacity: 0,
                scale: 0.82,
                rotate: 12,
                x: 60,
                y: -20,
                transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              // Also allow manual click to advance
              onClick={() => {
                if (offset !== 0) {
                  setActive((prev) => (prev + offset) % CARDS.length);
                }
              }}
            >
              {/* Top glow line */}
              <div className="fc-card__glow-line" />

              {/* Icon */}
              <div className="fc-card__icon">{card.icon}</div>

              {/* Stat */}
              <div className="fc-card__stat">{card.stat}</div>

              {/* Label + sub */}
              <div className="fc-card__label">{card.label}</div>
              <div className="fc-card__sub">{card.sub}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="fc-dots">
        {CARDS.map((_, i) => (
          <button
            key={i}
            className={`fc-dot ${i === active ? "fc-dot--active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}