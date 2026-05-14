import { T } from "../theme";
import Badge from "./Badge";
import MetaRow from "./MetaRow";
import Icon from "./Icon";

export default function CompactCard({ event, onEdit, onDelete, onView, onCloseEvent }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.pink + "44"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: T.textPrimary,
              margin: 0,
              marginBottom: 4,
            }}
          >
            {event.title}
          </h4>
          <div
            style={{
              fontSize: 11,
              color: T.textMuted,
            }}
          >
            {event.categoryLabel || event.category}
          </div>
        </div>
        <Badge status={event.status} />
      </div>

      <MetaRow icon="cal" text={`${event.start_date} – ${event.end_date}`} />
      <MetaRow icon="users" text={`${event.entry_count} / ${event.max_entries} entries`} />

      <div
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            padding: "6px 12px",
            background: T.surfaceBord,
            border: "none",
            borderRadius: 6,
            color: T.textSecond,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Icon name="edit" size={12} color={T.textSecond} /> Edit
        </button>
        <button
          onClick={onView}
          style={{
            flex: 1,
            padding: "6px 12px",
            background: T.surfaceBord,
            border: "none",
            borderRadius: 6,
            color: T.textSecond,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Icon name="eye" size={12} color={T.textSecond} /> View
        </button>
        {event.status !== "CLOSED" && (
          <button
            onClick={onCloseEvent}
            style={{
              flex: 1,
              padding: "6px 12px",
              background: T.surfaceBord,
              border: "none",
              borderRadius: 6,
              color: T.textMuted,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Icon name="x" size={12} color={T.textMuted} /> Close
          </button>
        )}
        <button
          onClick={onDelete}
          style={{
            padding: "6px 12px",
            background: T.closedBg,
            border: "none",
            borderRadius: 6,
            color: T.closedRed,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Icon name="trash" size={12} color={T.closedRed} />
        </button>
      </div>
    </div>
  );
}
