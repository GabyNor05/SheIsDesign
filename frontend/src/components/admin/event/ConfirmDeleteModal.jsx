import Modal from "../Modal";
import { T } from "../theme";

function ConfirmDeleteModal({ event, onConfirm, onClose }) {
  return (
    <Modal onClose={onClose} title="Delete Event">
      <div style={{ padding: 24 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: T.textSec, lineHeight: 1.6, marginBottom: 24 }}>
          Are you sure you want to delete <strong style={{ color: T.text }}>{event.title}</strong>? This action cannot be undone and will permanently remove the event.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
            padding: "10px 20px", color: T.textSec, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            background: T.redBg, border: `1px solid ${T.red}33`, borderRadius: 8,
            padding: "10px 20px", color: T.red, cursor: "pointer",
            fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700,
          }}>Delete Event</button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;