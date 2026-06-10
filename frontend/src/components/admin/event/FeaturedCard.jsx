import { T } from "../theme";
import Badge from "./Badge";
import EventImage from "./EventImage";
import MetaRow from "./MetaRow";
import JudgeAvatars from "./JudgeAvatars";
import ProgressBar from "./ProgressBar";
import Icon from "./Icon";

function FeaturedCard({ event, onManage, onView }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        alignItems: "start",
      }}
    >
      <EventImage url={event.image_link} height={140} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: T.textPrimary,
                margin: 0,
              }}
            >
              {event.title}
            </h3>
            <Badge status={event.status} />
          </div>
          <p
            style={{
              fontSize: 12,
              color: T.textMuted,
              margin: 0,
              marginBottom: 8,
            }}
          >
            {event.description?.substring(0, 100)}
            {event.description?.length > 100 ? "..." : ""}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <MetaRow icon="cal" text={`${event.start_date}`} />
          <MetaRow icon="users" text={`${event.entry_count} entries`} />
          <JudgeAvatars count={event.judges} />
        </div>

        <ProgressBar count={event.entry_count} max={event.max_entries} />

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onManage}
            style={{
              flex: 1,
              padding: "8px 16px",
              background: T.pink,
              border: "none",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Icon name="edit" size={14} color="#fff" /> Edit
          </button>
          <button
            onClick={onView}
            style={{
              flex: 1,
              padding: "8px 16px",
              background: T.surfaceBord,
              border: "none",
              borderRadius: 8,
              color: T.textSecond,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12,
              fontFamily: "'Poppins', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Icon name="eye" size={14}  /> View
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeaturedCard;