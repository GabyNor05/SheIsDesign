import { useState } from "react";
import emailjs from "@emailjs/browser";
import { T, INPUT_STYLES } from "../theme";

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

  function configEmailJS() {
    emailjs.init({ publicKey: "N8hgLvHSjKw4sAw8T" });
  }

  const handleSubmit = () => {
    configEmailJS();
    if (!validate()) return;
    emailjs.send("service_7s2q8fk", "sheIsDesignJudgeInvite", { email }).then(
      (response) => console.log("SUCCESS!", response.status, response.text),
      (error) => console.log("FAILED...", error)
    );
    onClose();
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: 18 }}>
        <label
          style={{
            fontFamily: "'Poppins', sans-serif",  // ✅ was 'DM Sans'
            fontSize: 12,
            fontWeight: 600,
            color: T.textSecond,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 6,
          }}
        >
          Judge Email *
        </label>
        <input
          type="email"
          placeholder="judge@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            ...INPUT_STYLES,
            borderColor: errors.email ? T.closedRed : T.border,
          }}
        />
        {errors.email && (
          <span style={{ fontSize: 11, color: T.closedRed, marginTop: 4, display: "block" }}>
            {errors.email}
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          paddingTop: 8,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "10px 20px",
            color: T.textSecond,
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",  // ✅ was 'DM Sans'
            fontSize: 14,
            fontWeight: 500,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = T.textPrimary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.textSecond)}
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          style={{
            background: "linear-gradient(135deg, #C41262, #FE4081)",  // ✅ was T.pink flat colour
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif", 
            fontSize: 14,
            fontWeight: 700,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Send Invite
        </button>
      </div>
    </div>
  );
}

export default InviteJudgeForm;