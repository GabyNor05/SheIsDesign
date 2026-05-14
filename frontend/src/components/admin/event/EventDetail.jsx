import { T } from "../theme";
import Badge from "./Badge";
import EventImage from "./EventImage";
import MetaRow from "./MetaRow";
import ProgressBar from "./ProgressBar";
import Icon from "./Icon";
import { fmtDate } from "./utils";

export default function EventDetail({ event, onBack, onEdit }) {
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: T.pink,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          marginBottom: 16,
          padding: 0,
        }}
      >
        <Icon name="arrow" size={14} color={T.pink} />
        Back to Events
      </button>

      <EventImage url={event.image_link} height={240} />

      <div style={{ marginTop: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: 12,
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: T.textPrimary,
              margin: 0,
            }}
          >
            {event.title}
          </h2>
          <Badge status={event.status} />
        </div>

        <p
          style={{
            fontSize: 14,
            color: T.textMuted,
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          {event.description}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <MetaRow icon="cal" text={fmtDate(event.start_date)} />
          <MetaRow icon="cal" text={fmtDate(event.end_date)} />
          <MetaRow icon="users" text={`${event.entry_count} entries`} />
          <div style={{ fontSize: 13, color: T.textSecond }}>
            {event.points_reward} pts
          </div>
        </div>

        <ProgressBar count={event.entry_count} max={event.max_entries} />

        <button
          onClick={onEdit}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: T.pink,
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon name="edit" size={14} color="#fff" /> Edit Event
        </button>
      </div>
    </div>
  );
}
