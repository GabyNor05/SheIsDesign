import Modal from "../Modal";

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

function ConfirmDeleteModal({ event, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose} title="Delete Event">
      <div style={{ padding: 24 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSec, lineHeight: 1.6, marginBottom: 24 }}>
          Are you sure you want to delete <strong style={{ color: T.text }}>{event.title}</strong>? This action cannot be undone and will permanently remove the event.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
            padding: "10px 20px", color: T.textSec, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            background: T.redBg, border: `1px solid ${T.red}33`, borderRadius: 8,
            padding: "10px 20px", color: T.red, cursor: "pointer",
            fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700,
          }}>Delete Event</button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;