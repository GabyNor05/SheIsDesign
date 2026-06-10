// ─────────────────────────────────────────────────────────────────────────────
// ShelsDesign — Design Tokens
// Import with: import { T } from "./theme";
// ─────────────────────────────────────────────────────────────────────────────

export const T = {
  // Backgrounds
  bg:          "#0D0D0D",   // page background
  surface:     "#1A1A1A",   // card / sidebar background
  surfaceHi:   "#242424",   // elevated card, hover surface
  surfaceBord: "#2A2A2A",   // subtle inner borders
  border:      "#2E2E2E",   // dividers
  borderHi:    "#3A3A3A",   // hover border

  // Brand
  pink:        "#E8186E",   // primary CTA / active state
  pinkDim:     "#230512",   // pink tint background (accessible)
  pinkGlow:    "rgba(255,45,120,0.15)",

  // Text — all WCAG AA on #1A1A1A
  textPrimary: "#F0F0F0",   // 15.3:1 on surface
  textSecond:  "#A0A0A0",   // 5.9:1 on surface — AA large
  textMuted:   "#6B6B6B",   // decorative only

  // Status — Open
  activeGreen: "#22C55E",
  activeBg:    "#052512",

  // Status — Upcoming
  upBlue:      "#60A5FA",
  upBg:        "#0A1628",

  // Status — Draft
  draftGray:   "#A0A0A0",
  draftBg:     "#222222",

  // Status — Closed
  closedRed:   "#F87171",
  closedBg:    "#200B0B",

  // Extra
  amber:       "#FBBF24",
  amberBg:     "#1C1200",
};

// Convenience map for status badge rendering
export const STATUS_STYLES = {
  OPEN:     { bg: "#052512", color: "#22C55E", dot: "#22C55E" },
  UPCOMING: { bg: "#0A1628", color: "#60A5FA", dot: "#60A5FA" },
  DRAFT:    { bg: "#222222", color: "#A0A0A0", dot: "#A0A0A0" },
  CLOSED:   { bg: "#200B0B", color: "#F87171", dot: "#F87171" },
};

export const INPUT_STYLES = {
  background: T.surfaceHi,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "10px 14px",
  color: T.textPrimary,
  fontFamily: "'Poppins', sans-serif",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

export const inputStyle = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: 13,
  padding: "10px 12px",
  background: T.surface,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  color: T.textPrimary,
  width: "100%",
  boxSizing: "border-box",
};