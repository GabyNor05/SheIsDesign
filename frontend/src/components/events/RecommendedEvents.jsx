import EventCard from "../ui/Cards/EventCard/EventCard";
import "../events/RecommendedEvents.css";

export default function RecommendedEvents({ events, user, onApply }) {
  if (!user || !events || events.length === 0) return null;

  const fieldLabel = user.field_of_study || "your degree";

  return (
    <section className="recommended-events">
      <div className="recommended-events__inner">
        <div className="recommended-events__label">
          <div className="recommended-events__label-line" />
          <span className="recommended-events__label-text">Recommended for you</span>
        </div>

        <h2 className="recommended-events__heading">Based on your degree</h2>
        <p className="recommended-events__sub">
          Showing events related to{" "}
          <span className="recommended-events__sub-highlight">{fieldLabel}</span>
        </p>

        <div className="recommended-events__grid">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} onApply={onApply} />
          ))}

          {events.length < 3 &&
            Array.from({ length: 3 - events.length }).map((_, i) => (
              <div key={`placeholder-${i}`} className="recommended-events__placeholder">
                <span className="recommended-events__placeholder-text">
                  More recommendations<br />coming soon
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}