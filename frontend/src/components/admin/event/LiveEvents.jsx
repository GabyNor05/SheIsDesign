import { useState, useEffect } from "react";
import { T } from "../theme";
import Badge from "./Badge";
import EventImage from "./EventImage";
import MetaRow from "./MetaRow";
import JudgeAvatars from "./JudgeAvatars";
import ProgressBar from "./ProgressBar";
import Icon from "./Icon";
import Modal from "./Modal";
import EventForm from "./EventForm";
import EventDetail from "./EventDetail";
import ConfirmDelete from "./ConfirmDelete";
import { getUpcomingEvents } from "../../../services/eventService";
import { loadEvents, saveEvents, genId, fmtDate } from "./utils";

const SEED_EVENTS = [
  {
    EventID: "evt-001",
    title: "Brand Identity Challenge",
    category: "Branding",
    categoryLabel: "Brand Identity",
    start_date: "2025-03-12",
    end_date: "2025-03-10",
    entry_count: 84,
    max_entries: 92,
    description:
      "A comprehensive brand identity challenge where participants design a full visual identity system for a fictional female-led startup. Includes logo, colour palette, typography, and brand guidelines.",
    points_reward: 500,
    status: "OPEN",
    image_link: "",
    submissions: 66,
    location: "Online",
    time: "09:00",
    judges: 6,
  },
  {
    EventID: "evt-002",
    title: "Motion Design Bootcamp",
    category: "Motion",
    categoryLabel: "Motion Design",
    start_date: "2025-03-20",
    end_date: "2025-03-18",
    entry_count: 41,
    max_entries: 60,
    description:
      "An intensive motion design bootcamp focused on animated brand assets, type animation, and logo reveals.",
    points_reward: 300,
    status: "OPEN",
    image_link: "",
    submissions: 28,
    location: "Online",
    time: "10:00",
    judges: 3,
  },
  {
    EventID: "evt-003",
    title: "UI/UX Hackathon 2026",
    category: "UI/UX",
    categoryLabel: "UX Design",
    start_date: "2025-04-05",
    end_date: "2025-04-03",
    entry_count: 61,
    max_entries: 75,
    description:
      "A 48-hour hackathon challenging participants to redesign a real app for accessibility and inclusivity.",
    points_reward: 750,
    status: "OPEN",
    image_link: "",
    submissions: 47,
    location: "Wits University, Johannesburg",
    time: "08:00",
    judges: 4,
  },
];

export default function LiveEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [active, setActive] = useState(null);
  const [detailId, setDetail] = useState(null);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const persist = (next) => {
    setEvents(next);
    saveEvents(next);
  };

  const handleEdit = (data) => {
    persist(
      events.map((e) =>
        e.EventID === active.EventID
          ? { ...data, EventID: active.EventID }
          : e
      )
    );
    setModal(null);
    setActive(null);
  };

  const handleDelete = () => {
    persist(events.filter((e) => e.EventID !== active.EventID));
    if (detailId === active.EventID) setDetail(null);
    setModal(null);
    setActive(null);
  };


  const liveOpen = events.filter((e) => e.status === "OPEN").slice(0, 3);
  const detailEv = detailId ? events.find((e) => e.EventID === detailId) : null;

  // Detail view
  if (detailEv) {
    return (
      <div>
        <EventDetail
          event={detailEv}
          onBack={() => setDetail(null)}
          onEdit={() => {
            setActive(detailEv);
            setModal("edit");
          }}
        />
        {modal === "edit" && active && (
          <Modal title="Edit Event" onClose={() => setModal(null)} wide>
            <EventForm
              initial={active}
              onSave={handleEdit}
              onClose={() => setModal(null)}
            />
          </Modal>
        )}
      </div>
    );
  }
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
    <section aria-label="Live and open events" style={{ marginBottom: 36 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: T.activeGreen,
              display: "inline-block",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.textSecond,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Live & Open Events
          </span>
          <span
            style={{
              background: T.activeBg,
              color: T.activeGreen,
              borderRadius: 20,
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {liveOpen.length}
          </span>
        </div>
      </div>

      {liveOpen.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 18,
          }}
        >
          {liveOpen.map((ev) => (
            <div
              key={ev.EventID}
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: 14,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 0.2s, transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.pink + "66";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Image Header */}
              <div style={{ position: "relative" }}>
                <EventImage url={ev.image_link} height={140} />
                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <Badge status={ev.status} />
                </div>
              </div>

              {/* Content */}
              <div
                style={{
                  padding: "16px 18px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      fontSize: 11,
                      color: T.textMuted,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {ev.categoryLabel || ev.category}
                  </p>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                      color: T.textPrimary,
                      lineHeight: 1.3,
                    }}
                  >
                    {ev.title}
                  </h3>
                </div>

                {/* Meta info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <MetaRow icon="cal" text={fmtDate(ev.start_date)} />
                  {ev.location && <MetaRow icon="pin" text={ev.location} />}
                  {ev.time && <MetaRow icon="clock" text={ev.time} />}
                </div>

                {/* Progress */}
                <ProgressBar count={ev.entry_count} max={ev.max_entries} />

                {/* Judges */}
                <JudgeAvatars count={ev.judges} />
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  borderTop: `1px solid ${T.border}`,
                }}
              >
                <button
                  onClick={() => setDetail(ev.EventID)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "none",
                    border: "none",
                    borderRight: `1px solid ${T.border}`,
                    cursor: "pointer",
                    color: T.textSecond,
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = T.surfaceHi;
                    e.currentTarget.style.color = T.textPrimary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                    e.currentTarget.style.color = T.textSecond;
                  }}
                >
                  <Icon name="eye" size={13} color="currentColor" />
                  View
                </button>
                <button
                  onClick={() => {
                    setActive(ev);
                    setModal("edit");
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: T.pink,
                    border: "none",
                    cursor: "pointer",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <Icon name="edit" size={13} color="#fff" />
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: T.textMuted,
            fontSize: 14,
          }}
        >
          No live or open events
        </div>
      )}

      {/* Modals */}
      {modal === "edit" && active && (
        <Modal title="Edit Event" onClose={() => setModal(null)} wide>
          <EventForm
            initial={active}
            onSave={handleEdit}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
      {modal === "delete" && active && (
        <Modal title="Delete Event" onClose={() => setModal(null)}>
          <ConfirmDelete
            event={active}
            onConfirm={handleDelete}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
