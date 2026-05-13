import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDots, Lightning, Star, Users } from "@phosphor-icons/react";
import "./EventsSection.css";

//  API 
// ERD Table: Event
// GET /api/Event — returns all events
const API_BASE = "http://localhost:5160/api";

async function fetchEvents() {
  const res = await fetch(`${API_BASE}/Event`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

//  Helpers 
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil(
    (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return null; // past — don't show on home
  if (diff === 0) return "Ends today";
  if (diff === 1) return "1 day left";
  return `${diff} days left`;
}

function getStatusMeta(event) {
  const status = event.status?.toLowerCase();
  const isFull = (event.entry_count ?? 0) >= event.max_entry;
  if (isFull) return { label: "Full", className: "es-badge--full" };
  if (status === "open") return { label: "Open now", className: "es-badge--open" };
  if (status === "upcoming" || status === "coming soon")
    return { label: "Coming Soon", className: "es-badge--soon" };
  return { label: event.status ?? "—", className: "es-badge--default" };
}

//  Featured event card 
function FeaturedCard({ event }) {
  const fillPct =
    event.max_entry > 0
      ? Math.min(100, Math.round(((event.entry_count ?? 0) / event.max_entry) * 100))
      : 0;
  const { label, className } = getStatusMeta(event);
  const timeLeft = daysUntil(event.end_date);

  return (
    <div className="es-featured">
      {/* Glow orb */}
      <div className="es-featured__glow" />

      {/* Image panel */}
      <div className="es-featured__image">
        <span className={`es-badge ${className}`}>{label}</span>
        {event.image_link ? (
          <img src={event.image_link} alt={event.title} className="es-featured__img" />
        ) : (
          <div className="es-featured__img-placeholder">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#FE4081">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
            <span className="es-featured__img-label">Event graphic</span>
          </div>
        )}
      </div>

      {/* Content panel */}
      <div className="es-featured__content">
        <div className="es-featured__meta">
          <span className="es-featured__eyebrow">
            <Star size={12} weight="fill" color="#C41262" />
            Featured event
          </span>
          {event.category && (
            <>
              <span className="es-featured__dot" />
              <span className="es-featured__category">{event.category}</span>
            </>
          )}
          {timeLeft && (
            <>
              <span className="es-featured__dot" />
              <span className="es-featured__timeleft">{timeLeft}</span>
            </>
          )}
        </div>

        <h3 className="es-featured__title">{event.title}</h3>

        <div className="es-featured__date">
          <CalendarDots size={13} color="rgba(255,255,255,0.4)" />
          <span>
            {formatDate(event.start_date)} – {formatDate(event.end_date)}
          </span>
        </div>

        <p className="es-featured__desc">{event.description}</p>

        <div className="es-featured__stats">
          {[
            { icon: <Users size={14} />, value: event.entry_count ?? 0, label: "Entries" },
            { icon: <Lightning size={14} />, value: `${event.points_reward ?? 0} pts`, label: "Reward" },
            { icon: <Users size={14} />, value: event.max_entry, label: "Spots" },
          ].map((s) => (
            <div key={s.label} className="es-featured__stat">
              <span className="es-featured__stat-value">{s.value}</span>
              <span className="es-featured__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="es-featured__progress-wrap">
          <div className="es-featured__progress-track">
            <div className="es-featured__progress-fill" style={{ width: `${fillPct}%` }} />
          </div>
          <span className="es-featured__progress-label">
            {event.entry_count ?? 0} / {event.max_entry} spots filled
          </span>
        </div>

        <div className="es-featured__cta">
          <Link to={`/events/${event.id}`} className="es-btn-primary">
            Apply for this event
            <ArrowRight size={15} weight="bold" />
          </Link>
          <Link to="/events" className="es-btn-ghost">
            View all events
          </Link>
        </div>
      </div>
    </div>
  );
}

//  Small event card 
function EventCard({ event, index }) {
  const { label, className } = getStatusMeta(event);
  const timeLeft = daysUntil(event.end_date);

  return (
    <Link
      to={`/events/${event.id}`}
      className="es-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top strip */}
      <div className="es-card__top">
        {event.image_link ? (
          <img src={event.image_link} alt={event.title} className="es-card__img" />
        ) : (
          <div className="es-card__img-placeholder">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(254,64,129,0.5)">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}
        <span className={`es-badge ${className} es-card__badge`}>{label}</span>
      </div>

      {/* Body */}
      <div className="es-card__body">
        {event.category && (
          <span className="es-card__category">{event.category}</span>
        )}
        <h4 className="es-card__title">{event.title}</h4>
        <p className="es-card__desc">{event.description}</p>

        <div className="es-card__footer">
          <div className="es-card__date">
            <CalendarDots size={12} color="rgba(255,255,255,0.4)" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          {timeLeft && <span className="es-card__timeleft">{timeLeft}</span>}
        </div>
      </div>

      <div className="es-card__hover-line" />
    </Link>
  );
}

//  Skeleton loaders 
function FeaturedSkeleton() {
  return (
    <div className="es-featured es-skeleton">
      <div className="es-skeleton__featured-img" />
      <div className="es-skeleton__featured-body">
        <div className="es-skeleton__line es-skeleton__line--short" />
        <div className="es-skeleton__line es-skeleton__line--title" />
        <div className="es-skeleton__line" />
        <div className="es-skeleton__line es-skeleton__line--short" />
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="es-card es-skeleton">
      <div className="es-skeleton__card-img" />
      <div className="es-skeleton__card-body">
        <div className="es-skeleton__line es-skeleton__line--short" />
        <div className="es-skeleton__line" />
        <div className="es-skeleton__line es-skeleton__line--short" />
      </div>
    </div>
  );
}

//  Main section 
export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        // Sort: open first, then by start_date ascending
        const sorted = [...data].sort((a, b) => {
          const aOpen = a.status?.toLowerCase() === "open" ? 0 : 1;
          const bOpen = b.status?.toLowerCase() === "open" ? 0 : 1;
          if (aOpen !== bOpen) return aOpen - bOpen;
          return new Date(a.start_date) - new Date(b.start_date);
        });
        setEvents(sorted);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Featured = first open event, fallback to first event
  const featured = events.find((e) => e.status?.toLowerCase() === "open") ?? events[0];
  // Grid = next 3 after featured (exclude featured)
  const gridEvents = events.filter((e) => e !== featured).slice(0, 3);

  return (
    <section className="es-section">
      {/* Background glows */}
      <div className="es-section__glow es-section__glow--left" />
      <div className="es-section__glow es-section__glow--right" />

      <div className="es-section__inner">
        {/* Section header */}
        <div className="es-header">
          <div className="es-header__left">
            <div className="es-header__pill">
              <Lightning size={11} weight="fill" color="#FE4081" />
              <span>Competitions & Challenges</span>
            </div>
            <h2 className="es-header__title">
              Enter the arena.{" "}
              <span className="es-header__title--accent">Make your mark.</span>
            </h2>
            <p className="es-header__sub">
              Real briefs. Real skills. Real recognition. Every event is a chance
              to grow your portfolio and connect with the community.
            </p>
          </div>
          <Link to="/events" className="es-header__cta">
            Browse all events
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>

        {/* Featured event */}
        {loading ? (
          <FeaturedSkeleton />
        ) : error ? (
          <div className="es-error">Could not load events. Check your connection.</div>
        ) : featured ? (
          <FeaturedCard event={featured} />
        ) : null}

        {/* Event grid */}
        {!loading && !error && gridEvents.length > 0 && (
          <div className="es-grid">
            {gridEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
            {/* "See more" card */}
            <Link to="/events" className="es-card es-card--more">
              <div className="es-card--more__inner">
                <div className="es-card--more__icon">
                  <ArrowRight size={22} weight="bold" color="#FE4081" />
                </div>
                <span className="es-card--more__label">See all events</span>
                <span className="es-card--more__sub">
                  {events.length} total competitions
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Loading grid skeletons */}
        {loading && (
          <div className="es-grid">
            {[0, 1, 2].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}