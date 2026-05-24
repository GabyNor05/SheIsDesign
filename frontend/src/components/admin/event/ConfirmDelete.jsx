import { T } from "../theme";
import Icon from "./Icon";

export default function ConfirmDelete({ event, onConfirm, onClose }) {
  return (
    <div>
      <div
        style={{
          padding: "20px",
          background: T.closedBg,
          borderRadius: 10,
          marginBottom: 20,
          display: "flex",
          gap: 12,
          alignItems: "start",
        }}
      >
        <Icon name="x" size={20} color={T.closedRed} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.closedRed, marginBottom: 4 }}>
            Delete Event
          </div>
          <div style={{ fontSize: 13, color: T.textSecond }}>
            Are you sure you want to delete <strong>{event.title}</strong>? This action cannot be undone.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            background: T.surfaceBord,
            border: "none",
            borderRadius: 8,
            color: T.textSecond,
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: "10px 20px",
            background: T.closedRed,
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Delete Permanently
        </button>
      </div>
    </div>
  );
}
