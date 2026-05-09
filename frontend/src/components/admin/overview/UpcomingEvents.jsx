import {
  CalendarDots,
  CalendarBlank,
  Plus,
  Pencil,
  Trash,
} from "@phosphor-icons/react";
import SectionHeader from "../SectionHeader";
import Card from "./Card";

import { T } from "../theme";

const UPCOMING_EVENTS = [
  {
    id: "evt-001",
    title: "Brand Identity Challenge",
    category: "BRAND IDENTITY",
    status: "OPEN",
    dateRange: "1–12 Mar 2026",
    entries: 84,
    maxEntries: 100,
  },
  {
    id: "evt-002",
    title: "Motion Design Bootcamp",
    category: "MOTION DESIGN",
    status: "OPEN",
    dateRange: "10–20 Mar 2026",
    entries: 41,
    maxEntries: 60,
  },
  {
    id: "evt-003",
    title: "UI/UX Hackathon 2026",
    category: "UX DESIGN",
    status: "OPEN",
    dateRange: "1–5 Apr 2026",
    entries: 112,
    maxEntries: 150,
  },
  {
    id: "evt-004",
    title: "Typography Sprint",
    category: "GRAPHIC DESIGN",
    status: "UPCOMING",
    dateRange: "12–18 Apr 2026",
    entries: 29,
    maxEntries: 60,
  },
  {
    id: "evt-005",
    title: "Typography Sprint",
    category: "GRAPHIC DESIGN",
    status: "UPCOMING",
    dateRange: "12–18 Apr 2026",
    entries: 29,
    maxEntries: 60,
  },
  {
    id: "evt-006",
    title: "Motion Design Bootcamp",
    category: "MOTION DESIGN",
    status: "OPEN",
    dateRange: "10–20 Mar 2026",
    entries: 41,
    maxEntries: 60,
  },
   {
    id: "evt-004",
    title: "Typography Sprint",
    category: "GRAPHIC DESIGN",
    status: "UPCOMING",
    dateRange: "12–18 Apr 2026",
    entries: 29,
    maxEntries: 60,
  },
  {
    id: "evt-005",
    title: "Typography Sprint",
    category: "GRAPHIC DESIGN",
    status: "UPCOMING",
    dateRange: "12–18 Apr 2026",
    entries: 29,
    maxEntries: 60,
  },
  
];

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
  const openCount = UPCOMING_EVENTS.filter((e) => e.status === "OPEN").length;
  return (
    <div >
      <SectionHeader
        icon={<CalendarDots />}
        title="Upcoming Events"
        badge={`${openCount} open`}
        action="View all"
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          height: "167.891px",
          overflow: "hidden",
          overflowX: "scroll",

          alignItems: "flex-start",
          alignSelf: "stretch",
          gap: 14,
          paddingBottom: 4,
          scrollbarWidth: "thin",
          scrollbarColor: `${T.border} `,
        }}
      >
        {UPCOMING_EVENTS.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}

export default UpcomingEvents;
