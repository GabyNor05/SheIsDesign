import { T } from "../theme";

const STATUS_MAP = {
  OPEN: { bg: "#10e26633", color: T.activeGreen, dot: T.activeGreen },
  UPCOMING: { bg: T.upBg, color: T.upBlue, dot: T.upBlue },
  DRAFT: { bg: T.draftBg, color: T.draftGray, dot: T.draftGray },
  CLOSED: { bg: T.closedBg, color: T.closedRed, dot: T.closedRed },
};

export default function Badge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.DRAFT;
  return (
    <span
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: s.bg,
        color: s.color,
        borderRadius: 20,
        padding: "4px 10px",
        fontSize: 11.5,
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: "0.06em",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
}
