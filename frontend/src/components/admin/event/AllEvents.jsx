import { useState, useEffect } from "react";
import { T, STATUS_STYLES } from "../theme";
import { Plus } from "@phosphor-icons/react";
import CompactCard from "./CompactCard";
import EventDetail from "./EventDetail";
import Modal from "../Modal";
import EventForm from "./EventForm";
import ConfirmDelete from "./ConfirmDelete";
import Searchbar from "./Searchbar";
import { eventService } from "../../../services/eventService";

const STATUS_TABS = ["ALL", "OPEN", "DRAFT", "UPCOMING", "CLOSED"];

function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [active, setActive] = useState(null);
  const [detailId, setDetailId] = useState(null);

  // Load events from API
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate tab counts
  const tabCounts = {
    ALL: events.length,
    OPEN: events.filter(e => e.status === "OPEN").length,
    DRAFT: events.filter(e => e.status === "DRAFT").length,
    UPCOMING: events.filter(e => e.status === "UPCOMING").length,
    CLOSED: events.filter(e => e.status === "CLOSED").length,
  };

  // Filter events by tab and search
  const filtered = events.filter(e => {
    const matchTab = tab === "ALL" || e.status === tab;
    const matchSearch = 
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleCreate = (data) => {
    const newEvent = {
      ...data,
      EventID: "evt-" + Date.now().toString(36),
    };
    setEvents([newEvent, ...events]);
    setModal(null);
  };

  const handleEdit = (data) => {
    setEvents(
      events.map(e =>
        e.EventID === active.EventID ? { ...data, EventID: active.EventID } : e
      )
    );
    setModal(null);
    setActive(null);
  };

  const handleDelete = () => {
    setEvents(events.filter(e => e.EventID !== active.EventID));
    if (detailId === active.EventID) setDetailId(null);
    setModal(null);
    setActive(null);
  };

  const handleCloseEvent = (eventId) => {
    setEvents(
      events.map(e =>
        e.EventID === eventId ? { ...e, status: "CLOSED" } : e
      )
    );
  };

  const detailEvent = events.find(e => e.EventID === detailId);

  if (loading) return <div style={{ padding: 24, color: T.textSecond }}>Loading events...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 20, fontWeight: 700, color: T.textPrimary, margin: 0 }}>
          All Events
        </h2>
        <button
          onClick={() => setModal("create")}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: T.pink, color: "#fff", border: "none",
            borderRadius: 8, padding: "10px 16px", cursor: "pointer",
            fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <Plus size={16} /> Create Event
        </button>
      </div>

      {/* Search & Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", flex: 1 }}>
          {STATUS_TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? T.pink : T.surface,
                color: tab === t ? "#fff" : T.textSecond,
                border: `1px solid ${tab === t ? T.pink : T.border}`,
                borderRadius: 6, padding: "8px 12px",
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {t} ({tabCounts[t]})
            </button>
          ))}
        </div>
        
      </div>

      {/* Events List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: T.textMuted }}>
            No events found
          </div>
        ) : (
          filtered.map(event => (
            <CompactCard
              key={event.EventID}
              event={event}
              onView={() => setDetailId(event.EventID)}
              onManage={() => { setActive(event); setModal("edit"); }}
              onDelete={() => { setActive(event); setModal("delete"); }}
              onClose={() => handleCloseEvent(event.EventID)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {modal === "create" && (
        <Modal title="Create New Event" onClose={() => setModal(null)} wide>
          <EventForm onSave={handleCreate} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "edit" && active && (
        <Modal title="Edit Event" onClose={() => { setModal(null); setActive(null); }} wide>
          <EventForm initial={active} onSave={handleEdit} onClose={() => { setModal(null); setActive(null); }} />
        </Modal>
      )}
      {modal === "delete" && active && (
        <ConfirmDelete event={active} onConfirm={handleDelete} onClose={() => { setModal(null); setActive(null); }} />
      )}

      {/* Event Detail Modal */}
      {detailId && detailEvent && (
        <EventDetail event={detailEvent} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
}

export default AllEvents;
