import { useState } from "react";

const T = {
  // Same T object as in other components
  bg: "#0D0D0D",
  surface: "#1A1A1A",
  surfaceHi: "#242424",
  border: "#2E2E2E",
  pink: "#FF2D78",
  pinkDim: "#3D0F22",
  textPrimary: "#F0F0F0",
  textSecond: "#A0A0A0",
  textMuted: "#6B6B6B",
  activeGreen: "#22C55E",
  activeBg: "#052512",
  upBlue: "#60A5FA",
  upBg: "#0A1628",
  draftGray: "#A0A0A0",
  draftBg: "#222222",
  closedRed: "#F87171",
  closedBg: "#200B0B",
};

const inputStyle = {
  background: T.surfaceHi,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "10px 14px",
  color: T.textPrimary,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

function InviteJudgeForm({ onSave, onClose }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ email });
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 18 }}>
        <label style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: T.textSecond,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 6
        }}>
          Judge Email *
        </label>
        <input
          type="email"
          placeholder="judge@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            ...inputStyle,
            borderColor: errors.email ? T.closedRed : T.border,
          }}
        />
        {errors.email && <span style={{ fontSize: 11, color: T.closedRed, marginTop: 4, display: "block" }}>{errors.email}</span>}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
        <button onClick={onClose} style={{
          background: "none",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "10px 20px",
          color: T.textSecond,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textPrimary; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecond; }}
        >
          Cancel
        </button>
        <button onClick={handleSubmit} style={{
          background: T.pink,
          border: "none",
          borderRadius: 8,
          padding: "10px 24px",
          color: "#fff",
          cursor: "pointer",
          fontFamily: "Syne, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          Send Invite
        </button>
      </div>
    </div>
  );
}

export default InviteJudgeForm;