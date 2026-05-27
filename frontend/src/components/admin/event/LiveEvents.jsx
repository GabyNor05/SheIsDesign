import { useState, useEffect } from "react";
import { T } from "../theme";
import { getUpcomingEvents } from "../../../services/eventService";
import EventForm from "./EventForm";
import FeaturedCard from "./FeaturedCard";
import Modal from "../Modal";

const STORAGE_KEY = "sheisdesign_events";

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

function saveEvents(evs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evs));
  } catch {}
}

export default function LiveEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [active, setActive] = useState(null);

  function onView() {}
  function onManage() {}

  useEffect(() => {
    const loadUpcomingEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUpcomingEvents();
        setEvents(data || []);
        saveEvents(data || []);
      } catch (err) {
        console.error("Error fetching upcoming events:", err);
        setError(err.message || "Failed to load events");
        setEvents(SEED_EVENTS);
        saveEvents(SEED_EVENTS);
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingEvents();
  }, []);

  const handleEdit = (data) => {
    const updated = events.map((e) =>
      e.EventID === active.EventID ? { ...data, EventID: active.EventID } : e,
    );
    setEvents(updated);
    saveEvents(updated);
    setModal(null);
    setActive(null);
  };

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: T.textSecond, fontSize: 14 }}>
        Loading upcoming events...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: T.closedRed, fontSize: 14 }}>
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 12,
            background: T.pink,
            border: "none",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: T.textMuted, fontSize: 14 }}>
        No upcoming events at this time.
      </div>
    );
  }

  const displayEvents = events.slice(0, 4);

  return (
    <>
      <section style={{ marginBottom: 36 }} aria-label="Upcoming events">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: T.activeGreen,
                display: "inline-block",
                animation: "ping 1.8s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12.5,
                fontWeight: 600,
                color: T.textSecond,
                letterSpacing: "0.06em",
              }}
            >
              UPCOMING EVENTS
            </span>
            <span
              style={{
                background: T.activeBg,
                color: T.activeGreen,
                borderRadius: 20,
                padding: "2px 9px",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {displayEvents.length}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            overflowX: "auto",
            paddingBottom: 6,
            scrollbarWidth: "none",
          }}
        >
          {displayEvents.map((ev) => (
            <FeaturedCard key={ev.EventID} event={ev} onView={onView} onManage={onManage} />
          ))}
        </div>
      </section>

      {modal === "edit" && active && (
        <Modal
          title="Edit Event"
          onClose={() => { setModal(null); setActive(null); }}
          wide
        >
          <EventForm
            initial={active}
            onSave={handleEdit}
            onClose={() => { setModal(null); setActive(null); }}
          />
        </Modal>
      )}

      <style>{`
        @keyframes ping {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>
    </>
  );
}