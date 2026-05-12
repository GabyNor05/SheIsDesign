import {Plus} from "@phosphor-icons/react";

import { T } from "../theme";

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