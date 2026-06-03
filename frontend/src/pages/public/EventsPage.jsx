import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { eventService } from "../../services/eventService";

import EventsHeroNew from "../../components/events/EventsHeroNew";
import FeaturedEvent from "../../components/events/FeaturedEvent";
import EventsGrid from "../../components/ui/Grids/EventsGrid/EventsGrid";
import RecommendedEvents from "../../components/events/RecommendedEvents";
import LoginPromptModal from "../../components/ui/Modals/LoginPromptModal/LoginPromptModal";
import EventDetailModal from "../../components/events/EventDetailModal";
import "./EventsPage.css";

export default function EventsPage() {
  const { user } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
    const cats = [...new Set(events.map((e) => e.category).filter(Boolean))];
    return cats;
  }, [events]);

  const featuredEvent = useMemo(() => {
    const open = events
      .filter((e) => e.status?.toLowerCase() === "open")
      .sort((a, b) => (b.entry_count ?? 0) - (a.entry_count ?? 0));
    if (open.length > 0) return open[0];

    const upcoming = events
      .filter((e) => new Date(e.start_date) > new Date())
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    return upcoming[0] ?? null;
  }, [events]);

  const recommendedEvents = useMemo(() => {
    if (!user) return [];
    const field = user.field_of_study?.toLowerCase() ?? "";
    if (!field) return [];
    const keywords = field.split(/[\s,]+/).filter((w) => w.length > 2);
    return events.filter((e) =>
      keywords.some((kw) => e.category?.toLowerCase().includes(kw))
    ).slice(0, 3);
  }, [events, user]);

  const heroStats = useMemo(() => ({
    totalEvents: events.filter((e) => e.status?.toLowerCase() === "open").length,
    totalEntries: events.reduce((sum, e) => sum + (e.entry_count ?? 0), 0),
    totalPoints: events.reduce((sum, e) => sum + (e.points_reward ?? 0), 0),
  }), [events]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleViewDetails(event) {
    setSelectedEvent(event);
  }

  function handleCloseModal() {
    setSelectedEvent(null);
  }

  function handleApply(event) {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    // TODO: hook up actual signup endpoint here
    console.log("Applying for event:", event.id);
    alert(`You are applying for: ${event.title}`);
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
          <button
            className="events-page__retry-btn"
            onClick={() => window.location.reload()}
          >
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
        />
      </div>

      {/* 3. All events grid */}
      <div id="events-grid">
        <EventsGrid
          events={events}
          activeFilter={activeFilter}
          onApply={handleApply}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* 4. Recommended for you */}
      <RecommendedEvents
        events={recommendedEvents}
        user={user}
        onApply={handleApply}
        onViewDetails={handleViewDetails}
      />

      {/* Event detail modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onApply={(event) => {
            handleCloseModal();
            handleApply(event);
          }}
        />
      )}

      {/* Login gate modal */}
      {showLoginModal && (
        <LoginPromptModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}