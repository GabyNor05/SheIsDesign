import { useEffect, useState } from "react";
import {
  CalendarDots,
  CalendarBlank,
} from "@phosphor-icons/react";
import SectionHeader from "../SectionHeader";
import { eventService } from "../../../services/eventService";
import {Icon} from "./Icon";
import { T } from "../theme";

const STATUS_MAP = {
  OPEN: { bg: "#10e26633", color: T.activeGreen, dot: T.activeGreen },
  UPCOMING: { bg: T.upBg, color: T.upBlue, dot: T.upBlue },
  DRAFT: { bg: T.draftBg, color: T.draftGray, dot: T.draftGray },
  CLOSED: { bg: T.closedBg, color: T.closedRed, dot: T.closedRed },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.DRAFT;
  return (
    <span
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: s.bg,
        color: s.color,
        borderRadius: 20,
        padding: "4px 10px",
        fontSize: 11.5,
        fontWeight: 600,
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: "0.06em",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
}

function EventCard({ event }) {
  const pct = Math.min(100, Math.round((event.entries / event.maxEntries) * 100));
  return (
    <div className="event-card">
      <div className="event-card__top">
        <div>
          <div className="event-card__title">{event.title}</div>
          <div className="event-card__category">{event.category}</div>
        </div>
        <StatusBadge status={event.status} />
      </div>
      <div className="event-card__date">
        <Icon name="calendar" size={12} color="var(--text-muted)" />
        <span>{event.dateRange}</span>
      </div>
      <div>
        <div className="event-card__entries-label">
          <span className="event-card__entries-text">Entries</span>
          <span className="event-card__entries-count">{event.entries} / {event.maxEntries}</span>
        </div>
        <div className="event-card__bar-track">
          <div
            className={`event-card__bar-fill${pct > 80 ? " event-card__bar-fill--full" : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const upcoming = await eventService.getUpcomingEvents();
        console.log("Next events:", upcoming);
        setEvents(upcoming);
        setError(null);
      } catch (err) {
        console.error("Failed to load events", err);
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div>
        <SectionHeader
          icon={<CalendarDots />}
          title="Upcoming Events"
          badge="Loading..."
        />
        <div style={{ padding: "20px", textAlign: "center", color: T.textMuted }}>
          Loading events...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SectionHeader
          icon={<CalendarDots />}
          title="Upcoming Events"
          badge="Error"
        />
        <div style={{ padding: "20px", textAlign: "center", color: T.closedRed }}>
          Failed to load events: {error}
        </div>
      </div>
    );
  }

  const openCount = events.filter((e) => e.status === "OPEN").length;

  return (
    <div>
      <SectionHeader
        icon={<CalendarDots />}
        title="Upcoming Events"
        badge={`${openCount} open`}
        action="View all"
      />
      <div>
        <div
          style={{
            display: "flex",
            width: "1020px",
            height: "180px",
            overflowX: "auto",
            overflowY: "hidden",
            alignItems: "space-between",
            whiteSpace: "nowrap",
            gap: 14,
            padding: 4,
          }}
        >
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UpcomingEvents;
