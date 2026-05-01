import {Plus} from "@phosphor-icons/react";

const T = {
  // Backgrounds
  bg:        "#0D0D0D",   // page background
  surface:   "#1A1A1A",   // card / sidebar background
  surfaceHi: "#242424",   // elevated card, hover surface
  border:    "#2E2E2E",   // subtle dividers
  // Brand
  pink:      "#FF2D78",   // primary CTA / active state
  pinkDim:   "#3D0F22",   // pink tint background (accessible)
  // Text — all WCAG AA on #1A1A1A
  textPrimary:  "#F0F0F0",  // 15.3:1 on surface
  textSecond:   "#A0A0A0",  // 5.9:1 on surface — AA large
  textMuted:    "#6B6B6B",  // decorative only
  // Status
  activeGreen:  "#22C55E",
  activeBg:     "#052512",
  upBlue:       "#60A5FA",
  upBg:         "#0A1628",
  draftGray:    "#A0A0A0",
  draftBg:      "#222222",
  closedRed:    "#F87171",
  closedBg:     "#200B0B",
};

function Section({ icon, title, onNewEvent, children }) {
  return (
    <section
      aria-label={title}
      style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16,
        overflow: "hidden", marginBottom: 20,
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 24px", borderBottom: `1px solid ${T.border}`,
      }}>
        <h2 style={{ display: "flex", alignItems: "center", gap: 8, margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, color: T.textPrimary }}>
          <span aria-hidden="true">{icon}</span>
          {title}
        </h2>
        {onNewEvent ? (
          <button onClick={onNewEvent}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: T.pink, border: "none", borderRadius: 8,
              padding: "8px 16px", cursor: "pointer", color: "#fff",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px #fff, 0 0 0 4px ${T.pink}`; }}
            onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <Plus size={13} color="#fff" />
            New Event
          </button>
        ) : (
          <button style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.pink, fontWeight: 600,
          }}
          onFocus={e  => { e.currentTarget.style.boxShadow = `0 0 0 2px ${T.pink}`; e.currentTarget.style.borderRadius = "4px"; }}
          onBlur={e   => { e.currentTarget.style.boxShadow = "none"; }}
          >
            Show all
          </button>
        )}
      </div>
      <div style={{ padding: "6px 24px 20px" }}>
        {children}
      </div>
    </section>
  );
}

export default Section;