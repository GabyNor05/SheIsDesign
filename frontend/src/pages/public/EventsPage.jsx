import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { eventService } from "../../services/eventService";

import EventsHeroNew from "../../components/events/EventsHeroNew";
import FeaturedEvent from "../../components/events/FeaturedEvent";
import EventsGrid from "../../components/ui/Grids/EventsGrid/EventsGrid";
import RecommendedEvents from "../../components/events/RecommendedEvents";
import LoginPromptModal from "../../components/ui/Modals/LoginPromptModal/LoginPromptModal";
import EventDetailModal from "../../components/events/EventDetailModal";
import ApplyModal from "../../components/events/ApplyModal";
import "./EventsPage.css";

export default function EventsPage() {
  const { user } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [events,         setEvents]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [activeFilter,   setActiveFilter]   = useState("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedEvent,  setSelectedEvent]  = useState(null);

  // ── Apply modal + applied tracking ─────────────────────────────────────────
  const [applyEvent,   setApplyEvent]   = useState(null);  // event to confirm
  // appliedIds: Set of event IDs the user has applied to this session
  const [appliedIds,   setAppliedIds]   = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("appliedEvents") || "[]")); }
    catch { return new Set(); }
  });

  // ── Fetch all events on mount ──────────────────────────────────────────────
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    const cats = [...new Set(events.map(e => e.category).filter(Boolean))];
    return cats;
  }, [events]);

  const featuredEvent = useMemo(() => {
    const open = events
      .filter(e => e.status?.toLowerCase() === "open")
      .sort((a, b) => (b.entry_count ?? 0) - (a.entry_count ?? 0));
    if (open.length > 0) return open[0];
    const upcoming = events
      .filter(e => new Date(e.start_date) > new Date())
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    return upcoming[0] ?? null;
  }, [events]);

  const recommendedEvents = useMemo(() => {
    if (!user) return [];
    const field = user.field_of_study?.toLowerCase() ?? "";
    if (!field) return [];
    const keywords = field.split(/[\s,]+/).filter(w => w.length > 2);
    return events.filter(e =>
      keywords.some(kw => e.category?.toLowerCase().includes(kw))
    ).slice(0, 3);
  }, [events, user]);

  const heroStats = useMemo(() => ({
    totalEvents:  events.filter(e => e.status?.toLowerCase() === "open").length,
    totalEntries: events.reduce((sum, e) => sum + (e.entry_count ?? 0), 0),
    totalPoints:  events.reduce((sum, e) => sum + (e.points_reward ?? 0), 0),
  }), [events]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleViewDetails(event) { setSelectedEvent(event); }
  function handleCloseModal()       { setSelectedEvent(null); }

  function handleApply(event) {
    if (!user) { setShowLoginModal(true); return; }
    if (appliedIds.has(event.id)) return; // already applied
    setApplyEvent(event);
  }

  function handleConfirmApply(event) {
    // TODO: call actual submission API endpoint here
    // e.g. await submissionService.createSubmission({ eventId: event.id, studentId: user.studentId })
    const next = new Set(appliedIds);
    next.add(event.id);
    setAppliedIds(next);
    localStorage.setItem("appliedEvents", JSON.stringify([...next]));
  }

  function handleFilterChange(filter) {
    setActiveFilter(filter);
    const gridEl = document.getElementById("events-grid");
    if (gridEl) gridEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="events-page__loading">
        <div className="events-page__loading-inner">
          <div className="events-page__spinner" />
          <p className="events-page__loading-text">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page__error">
        <div className="events-page__error-inner">
          <p className="events-page__error-title">Could not load events</p>
          <p className="events-page__error-msg">{error}</p>
          <button className="events-page__retry-btn" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page">
      {/* 1. Hero */}
      <EventsHeroNew
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        stats={heroStats}
        categories={categories}
      />

      {/* 2. Featured event */}
      <div id="events-featured">
        <FeaturedEvent
          event={featuredEvent}
          onApply={() => handleApply(featuredEvent)}
          onViewDetails={() => handleViewDetails(featuredEvent)}
          applied={featuredEvent ? appliedIds.has(featuredEvent.id) : false}
        />
      </div>

      {/* 3. All events grid */}
      <div id="events-grid">
        <EventsGrid
          events={events}
          activeFilter={activeFilter}
          onApply={handleApply}
          onViewDetails={handleViewDetails}
          appliedIds={appliedIds}
        />
      </div>

      {/* 4. Recommended for you */}
      <RecommendedEvents
        events={recommendedEvents}
        user={user}
        onApply={handleApply}
        onViewDetails={handleViewDetails}
        appliedIds={appliedIds}
      />

      {/* Apply confirmation modal */}
      {applyEvent && (
        <ApplyModal
          event={applyEvent}
          onClose={() => setApplyEvent(null)}
          onConfirm={handleConfirmApply}
        />
      )}

      {/* Event detail modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onApply={event => { handleCloseModal(); handleApply(event); }}
          applied={appliedIds.has(selectedEvent.id)}
        />
      )}

      {/* Login gate modal */}
      {showLoginModal && (
        <LoginPromptModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}