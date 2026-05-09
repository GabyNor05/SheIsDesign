import {useEffect} from "react";
import { T } from "./theme";

function Modal({ onClose, title, children, wide }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 16, width: "100%", maxWidth: wide ? 780 : 580,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: "modalIn 0.2s ease",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: `1px solid ${T.border}`,
          position: "sticky", top: 0, background: T.surface, zIndex: 1,
        }}>
          <h2 style={{ margin: 0, fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: T.text }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            background: T.surfaceHi, border: "none", borderRadius: 8, cursor: "pointer",
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            color: T.textSec, transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.redBg; e.currentTarget.style.color = T.red; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.surfaceHi; e.currentTarget.style.color = T.textSec; }}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(16px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
}

export default Modal;