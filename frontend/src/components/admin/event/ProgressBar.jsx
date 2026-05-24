import { T } from "../theme";

export default function ProgressBar({ count = 0, max = 100, showLabel = true }) {
  const pct = Math.min(100, Math.round((count / max) * 100));
  return (
    <div>
      {showLabel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            marginBottom: 6,
            color: T.textMuted,
          }}
        >
          <span>Entries</span>
          <span style={{ fontWeight: 600, color: T.textSecond }}>
            {count} / {max}
          </span>
        </div>
      )}
      <div
        style={{
          height: 5,
          background: T.surfaceBord,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: pct > 80 ? T.pink : `linear-gradient(90deg, ${T.pink}88, ${T.pink})`,
            borderRadius: 3,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}
