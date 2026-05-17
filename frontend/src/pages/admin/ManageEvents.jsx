import { useState, useEffect } from "react";
import { T, STATUS_STYLES } from "../../components/admin/theme";
import Badge from "../../components/admin/event/Badge";
import CompactCard from "../../components/admin/event/CompactCard";
import ConfirmDelete from "../../components/admin/event/ConfirmDelete";
import EventDetail from "../../components/admin/event/EventDetail";
import EventForm from "../../components/admin/event/EventForm";
import FeaturedCard from "../../components/admin/event/FeaturedCard";
import LiveEvents from "../../components/admin/event/LiveEvents";
import Icon from "../../components/admin/event/Icon";
import Modal from "../../components/admin/event/Modal";
import { loadEvents, saveEvents, genId, fmtDate } from "../../components/admin/event/utils";
import { getUpcomingEvents } from "../../services/eventService";

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

const CATEGORIES = [
  "Branding", "Motion", "UI/UX", "Typography",
  "Illustration", "Packaging", "Photography", "Web Design", "Other",
];
const STATUSES = ["OPEN", "DRAFT", "UPCOMING", "CLOSED"];
const STATUS_TABS = ["DRAFT", "UPCOMING", "OPEN", "CLOSED"];

export default function ManageEvents() {
  const [events, setEvents] = useState(() => loadEvents(SEED_EVENTS));
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("OPEN");
  const [modal, setModal] = useState(null);
  const [active, setActive] = useState(null);
  const [detailId, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch events from API on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingEvents();
      setEvents(data);
      saveEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError(err.message);
      // Fall back to seed events
      setEvents(SEED_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  const persist = (next) => {
    setEvents(next);
    saveEvents(next);
  };

  const handleCreate = (data) => {
    persist([{ ...data, EventID: genId() }, ...events]);
    setModal(null);
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

  const handleClose = (ev) => {
    persist(
      events.map((e) =>
        e.EventID === ev.EventID ? { ...e, status: "CLOSED" } : e
      )
    );
  };

  const liveOpen = events.filter((e) => e.status === "OPEN").slice(0, 3);
  const filtered = events.filter(
    (e) =>
      e.status === tab && e.title.toLowerCase().includes(search.toLowerCase())
  );
  const tabCounts = STATUS_TABS.reduce((a, s) => {
    a[s] = events.filter((e) => e.status === s).length;
    return a;
  }, {});
  const detailEv = detailId ? events.find((e) => e.EventID === detailId) : null;

  // Detail view
  if (detailEv) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, color: T.textPrimary }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px" }}>
          <EventDetail
            event={detailEv}
            onBack={() => setDetail(null)}
            onEdit={() => {
              setActive(detailEv);
              setModal("edit");
            }}
          />
        </div>

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

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.textPrimary }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 12,
                color: T.textMuted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Admin · Events
            </p>
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: 32,
                fontWeight: 800,
                color: T.textPrimary,
              }}
            >
              Manage Events
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: T.textSecond,
              }}
            >
              Create, manage and monitor all SheIsDesign events.
            </p>
          </div>

          {/* Search + Create button */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Icon
                name="search"
                size={14}
                color={T.textMuted}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                style={{
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "10px 14px 10px 38px",
                  color: T.textPrimary,
                  fontSize: 13,
                  width: 220,
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = T.pink;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = T.border;
                }}
              />
            </div>
            <button
              onClick={() => setModal("create")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: T.pink,
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                color: "#fff",
                cursor: "pointer",
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                transition: "opacity 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <Icon name="plus" size={14} color="#fff" />
              Create Event
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              background: `${T.closedRed}20`,
              border: `1px solid ${T.closedRed}40`,
              borderRadius: 8,
              padding: 16,
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: T.closedRed, fontSize: 13 }}>
              {error}
            </span>
            <button
              onClick={fetchEvents}
              style={{
                background: T.closedRed,
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                color: "#fff",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: T.textMuted,
              fontSize: 14,
            }}
          >
            Loading events...
          </div>
        )}

        {/* Live & Open section */}
        <div>
          <LiveEvents />
        </div>

        {/* All Events section */}
        <section>
          {/* Header + tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: T.textPrimary,
                }}
              >
                All Events
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: T.textMuted,
                  background: T.surfaceHi,
                  borderRadius: 20,
                  padding: "3px 10px",
                }}
              >
                {events.length}
              </span>
            </div>

            {/* Status tabs */}
            <div style={{ display: "flex", gap: 6 }}>
              {STATUS_TABS.map((s) => {
                const isActive = s === tab;
                const sc = STATUS_STYLES[s] || {};
                return (
                  <button
                    key={s}
                    onClick={() => setTab(s)}
                    style={{
                      background: isActive ? sc.bg : "none",
                      border: `1px solid ${isActive ? sc.color + "55" : T.border}`,
                      borderRadius: 8,
                      padding: "6px 14px",
                      cursor: "pointer",
                      color: isActive ? sc.color : T.textSecond,
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 400,
                      transition: "all 0.15s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = T.surfaceHi;
                        e.currentTarget.style.color = T.textPrimary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "none";
                        e.currentTarget.style.color = T.textSecond;
                      }
                    }}
                  >
                    {s}
                    {tabCounts[s] > 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          background: isActive ? sc.color + "33" : T.surfaceHi,
                          color: isActive ? sc.color : T.textMuted,
                          borderRadius: 20,
                          padding: "1px 6px",
                        }}
                      >
                        {tabCounts[s]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events grid */}
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "60px 0",
                textAlign: "center",
                color: T.textMuted,
                fontSize: 14,
              }}
            >
              No {tab.toLowerCase()} events{search ? ` matching "${search}"` : ""}.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {filtered.map((ev) => (
                <CompactCard
                  key={ev.EventID}
                  event={ev}
                  onView={() => setDetail(ev.EventID)}
                  onEdit={() => {
                    setActive(ev);
                    setModal("edit");
                  }}
                  onDelete={() => {
                    setActive(ev);
                    setModal("delete");
                  }}
                  onCloseEvent={() => handleClose(ev)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      {modal === "create" && (
        <Modal title="Create New Event" onClose={() => setModal(null)} wide>
          <EventForm onSave={handleCreate} onClose={() => setModal(null)} />
        </Modal>
      )}

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
        <ConfirmDelete
          event={active}
          onConfirm={handleDelete}
          onClose={() => {
            setModal(null);
            setActive(null);
          }}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
