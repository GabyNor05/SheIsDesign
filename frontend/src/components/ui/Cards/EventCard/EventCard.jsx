import { CalendarDots } from "@phosphor-icons/react";
import "./EventCard.css";

function formatDateShort(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

function getStatusConfig(event) {
  const status = event.status?.toLowerCase();
  const isFull = (event.entry_count ?? 0) >= event.max_entry;

  if (isFull || status === "closed") {
    return { label: "Full", btnText: "Event full", variant: "full", disabled: true };
  }
  if (status === "open") {
    return { label: "Open", btnText: "Apply now", variant: "open", disabled: false };
  }
  return { label: "Coming soon", btnText: "Notify me", variant: "soon", disabled: false };
}

export default function EventCard({ event, onApply }) {
  const config = getStatusConfig(event);
  const fillPct = event.max_entry > 0
    ? Math.min(100, Math.round(((event.entry_count ?? 0) / event.max_entry) * 100))
    : 0;

  return (
    <div className={`event-card${config.disabled ? " event-card--disabled" : ""}`}>
      {/* Image */}
      <div className={`event-card__image${config.disabled ? " event-card__image--disabled" : " event-card__image--open"}`}>
        {event.image_link ? (
          <img src={event.image_link} alt={event.title} className="event-card__img" />
        ) : (
          <div className={`event-card__img-placeholder${config.disabled ? " event-card__img-placeholder--disabled" : " event-card__img-placeholder--open"}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={config.disabled ? "rgba(255,255,255,0.12)" : "#FE4081"}>
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        )}
        <div className={`event-card__status-badge event-card__status-badge--${config.variant}`}>
          {config.label}
        </div>
      </div>

      {/* Body */}
      <div className="event-card__body">
        <div className="event-card__category">{event.category}</div>
        <h3 className="event-card__title">{event.title}</h3>

        <div className="event-card__date">
          <CalendarDots size={11} color="rgba(255,255,255,0.3)" />
          <span className="event-card__date-text">
            {formatDateShort(event.start_date)} – {formatDateShort(event.end_date)}
          </span>
        </div>

        <div className="event-card__progress-track">
          <div
            className={`event-card__progress-fill${config.disabled ? " event-card__progress-fill--disabled" : ""}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>

        <div className="event-card__entries">
          <span>{event.entry_count ?? 0} / {event.max_entry} entries</span>
          <span>{fillPct}%</span>
        </div>

        <div className="event-card__points">{event.points_reward} pts reward</div>

        <button
          disabled={config.disabled}
          onClick={() => !config.disabled && onApply(event)}
          className={`event-card__btn event-card__btn--${config.variant}`}
        >
          {config.btnText}
        </button>
      </div>
    </div>
  );
}