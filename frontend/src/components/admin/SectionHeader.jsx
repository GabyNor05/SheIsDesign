import { T } from "./theme";

function SectionHeader({ icon, title, badge, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && (
          <div style={{ width: 30, height: 30, borderRadius: 8, background: T.surfaceHi, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span aria-hidden="true">{icon}</span>
          </div>
        )}
        <h2 style={{ margin: 0, fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: T.textPrimary }}>
          {title}
        </h2>
        {badge !== undefined && (
          <span style={{
            background: T.pink, color: "#fff", borderRadius: 20,
            padding: "2px 9px", fontSize: 11, fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
          }}>
            {badge}
          </span>
        )}
      </div>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Poppins', sans-serif", fontSize: 12, fontWeight: 600,
          color: T.pink, display: "flex", alignItems: "center", gap: 5,
          padding: "4px 8px", borderRadius: 6, transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.pinkDim}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          {action} <span aria-hidden="true"></span>
        </button>
      )}
    </div>
  );
}

export default SectionHeader;