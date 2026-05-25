import { useEffect, useState } from "react";
import {
  CalendarDots,
  CalendarBlank,
  Plus,
  Pencil,
  Trash,
} from "@phosphor-icons/react";
import SectionHeader from "../SectionHeader";
import Card from "./Card";
import { getUpcomingEvents } from "../../../services/eventService";

import { T } from "../theme";

const STATUS_MAP = {
  ACTIVE: { bg: "#10e26633", color: T.activeGreen, dot: T.activeGreen },
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
        fontFamily: "'DM Sans', sans-serif",
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
  const pct = Math.min(
    100,
    Math.round((event.entries / event.maxEntries) * 100),
  );
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "18px 20px",
        maxHeight: "167.891px",
        minWidth: 230,
        maxWidth: 260,
        flex: "0 0 240px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.pink + "66";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <div className="w-full">
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 14.5,
                color: T.textPrimary,
                marginBottom: 4,
                lineHeight: 1.3,
              }}
            >
              {event.title}
            </div>
          </div>
          <StatusBadge status={event.status} />
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            width: "100%",
            fontSize: 10.5,
            color: T.textMuted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {event.category}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: T.textMuted,
        }}
      >
        <CalendarBlank size={14} color={T.textSecond} />

        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: T.textSecond,
          }}
        >
          {event.dateRange}
        </span>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11.5,
              color: T.textMuted,
            }}
          >
            Entries
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: T.textSecond,
            }}
          >
            {event.entries} / {event.maxEntries}
          </span>
        </div>
        <div
          style={{
            height: 5,
            background: T.surfaceBord,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background:
                pct > 80
                  ? T.pink
                  : `linear-gradient(90deg, ${T.pink}88, ${T.pink})`,
              borderRadius: 3,
              transition: "width 0.5s ease",
            }}
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

  const loadEvents = async () => {
    try {
      setLoading(true);
      const upcoming = await getUpcomingEvents();
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

  useEffect(() => {
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
