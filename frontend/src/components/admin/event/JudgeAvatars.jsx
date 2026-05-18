import { T } from "../theme";

export default function JudgeAvatars({ count = 0 }) {
  if (count === 0) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          display: "flex",
          marginLeft: -8,
        }}
      >
        {[...Array(Math.min(count, 3))].map((_, i) => (
          <div
            key={i}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: T.pink,
              border: `2px solid ${T.surface}`,
              marginLeft: i > 0 ? -8 : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
      {count > 3 && (
        <span style={{ fontSize: 12, color: T.textMuted }}>+{count - 3}</span>
      )}
    </div>
  );
}
