import { CalendarDots, Star } from "@phosphor-icons/react";
import "../events/FeaturedEvent.css";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Ended";
  if (diff === 0) return "Ends today";
  if (diff === 1) return "1 day left";
  return `${diff} days left`;
}

export default function FeaturedEvent({ event, onApply, onViewDetails }) {
  if (!event) return null;

  const fillPct = event.max_entry > 0
    ? Math.min(100, Math.round(((event.entry_count ?? 0) / event.max_entry) * 100))
    : 0;

  const timeLeft = daysUntil(event.end_date);
  const isFull = (event.entry_count ?? 0) >= event.max_entry;
  const isOpen = event.status?.toLowerCase() === "open";

  return (
    <section className="featured-event">
      <div className="featured-event__inner">
        <div className="featured-event__label">
          <Star size={14} color="#C41262" weight="fill" />
          <span className="featured-event__label-text">Featured event</span>
        </div>

        <div className="featured-event__card">
          {/* Left image */}
          <div className="featured-event__image">
            <div className={`featured-event__status-badge ${isOpen && !isFull ? "featured-event__status-badge--open" : "featured-event__status-badge--closed"}`}>
              {isFull ? "Full" : isOpen ? "Open now" : event.status}
            </div>

            {event.image_link ? (
              <img src={event.image_link} alt={event.title} className="featured-event__img" />
            ) : (
              <>
                <div className="featured-event__img-placeholder">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="#FE4081">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                <span className="featured-event__img-label">Event graphic</span>
              </>
            )}
          </div>

          {/* Right content */}
          <div className="featured-event__content">
            <div>
              <div className="featured-event__meta">
                <span className="featured-event__category">{event.category}</span>
                {timeLeft && (
                  <>
                    <span className="featured-event__meta-divider" />
                    <span className="featured-event__time-left">{timeLeft}</span>
                  </>
                )}
              </div>

              <h2 className="featured-event__title">{event.title}</h2>

              <div className="featured-event__date">
                <CalendarDots size={13} color="rgba(255,255,255,0.3)" />
                <span className="featured-event__date-text">
                  {formatDate(event.start_date)} – {formatDate(event.end_date)}
                </span>
              </div>

              <p className="featured-event__description">{event.description}</p>

              <div className="featured-event__stats">
                {[
                  { value: event.entry_count ?? 0, label: "Entries" },
                  { value: event.max_entry, label: "Max spots" },
                  { value: `${event.points_reward} pts`, label: "Reward" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="featured-event__stat-value">{s.value}</div>
                    <div className="featured-event__stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="featured-event__progress-wrap">
                <div className="featured-event__progress-track">
                  <div
                    className="featured-event__progress-fill"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                <div className="featured-event__progress-label">
                  {event.entry_count ?? 0} / {event.max_entry} spots filled
                </div>
              </div>
            </div>

            <div className="featured-event__cta">
              <button
                onClick={isFull ? undefined : onApply}
                disabled={isFull}
                className={`featured-event__btn-primary${isFull ? " featured-event__btn-primary--disabled" : ""}`}
              >
                {isFull ? "Event full" : "Apply for this event"}
              </button>
              <button className="featured-event__btn-secondary" onClick={onViewDetails}>
  View full brief
</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}