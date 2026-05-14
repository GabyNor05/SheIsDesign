import EventCard from '../../Cards/EventCard/EventCard'
import "./EventsGrid.css";

export default function EventsGrid({ events, activeFilter, onApply }) {
  const filtered = events.filter((e) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "open") return e.status?.toLowerCase() === "open" && (e.entry_count ?? 0) < e.max_entry;
    if (activeFilter === "coming soon") return e.status?.toLowerCase() === "drafted";
    return e.category?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section className="events-grid">
      <div className="events-grid__inner">
        <div className="events-grid__header">
          <div className="events-grid__label">
            <div className="events-grid__label-line" />
            <span className="events-grid__label-text">All events</span>
          </div>
          <h2 className="events-grid__heading">Browse &amp; Enter</h2>
        </div>

        {filtered.length === 0 ? (
          <div className="events-grid__empty">No events match this filter right now.</div>
        ) : (
          <div className="events-grid__cards">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} onApply={onApply} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}