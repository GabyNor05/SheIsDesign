import { T } from "../theme";

export default function FormField({ label, required = false, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          color: error ? T.closedRed : T.textPrimary,
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: T.closedRed }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{ fontSize: 12, color: T.closedRed, marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  );
}
