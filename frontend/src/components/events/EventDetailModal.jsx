import { CalendarDots, X, Users, Trophy, UploadSimple } from "@phosphor-icons/react";
import "./EventDetailModal.css";

function fmtDate(d) {
  if (!d) return "TBC";
  return new Date(d).toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Ended";
  if (diff === 0) return "Ends today";
  return `${diff} days left`;
}

export default function EventDetailModal({ event, onClose, onApply, onSubmitWork, onViewSubmissions, applied = false, hasSubmitted = false }) {
  if (!event) return null;

  const status   = event.status?.toUpperCase() || "DRAFT";
  const max      = event.max_entry ?? event.max_entries ?? 0;
  const count    = event.entry_count ?? 0;
  const pct      = max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0;
  const isFull   = count >= max && max > 0;
  const isOpen   = status === "OPEN" && !isFull;
  const timeLeft = daysLeft(event.end_date);

  function applyLabel() {
    if (applied)  return "✓ Joined";
    if (isFull)   return "Event Full";
    if (!isOpen)  return "Closed";
    return "Join event";
  }

  return (
    <div className="edm__overlay" onClick={onClose}>
      <div className="edm__box" onClick={e => e.stopPropagation()}>

        <button className="edm__close" onClick={onClose}><X size={18} /></button>

        {/* Image */}
        <div className="edm__image">
          {event.image_link
            ? <img src={event.image_link} alt={event.title} className="edm__img" />
            : <div className="edm__img-placeholder" />
          }
          <div className="edm__image-overlay">
            <span className={`edm__badge edm__badge--${status.toLowerCase()}`}>{status}</span>
            {timeLeft && <span className="edm__time-left">{timeLeft}</span>}
          </div>
        </div>

        {/* Content */}
        <div className="edm__content">
          <p className="edm__category">{event.category || "Event"}</p>
          <h2 className="edm__title">{event.title}</h2>

          <div className="edm__date-row">
            <CalendarDots size={14} color="rgba(255,255,255,0.4)" />
            <span className="edm__date-text">
              {fmtDate(event.start_date)} – {fmtDate(event.end_date)}
            </span>
          </div>

          {event.description && (
            <p className="edm__description">{event.description}</p>
          )}

          <div className="edm__stats">
            <div className="edm__stat">
              <Users size={16} color="#FE4081" />
              <div>
                <div className="edm__stat-value">{count} / {max}</div>
                <div className="edm__stat-label">Entries</div>
              </div>
            </div>
            <div className="edm__stat">
              <Trophy size={16} color="#FE4081" />
              <div>
                <div className="edm__stat-value">{event.points_reward ?? 0}</div>
                <div className="edm__stat-label">Points reward</div>
              </div>
            </div>
          </div>

          <div className="edm__progress-wrap">
            <div className="edm__progress-row">
              <span className="edm__progress-label">{pct}% full</span>
              <span className="edm__progress-label">{max - count} spots left</span>
            </div>
            <div className="edm__progress-track">
              <div className="edm__progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="edm__cta" style={{ flexWrap: "wrap" }}>
            {applied ? (
              <>
                {!hasSubmitted && (
                  <button
                    className="edm__apply-btn"
                    style={{ background: "linear-gradient(135deg, #C41262, #FE4081)", cursor: "pointer", color: "#fff", boxShadow: "0 4px 20px rgba(196,18,98,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}
                    onClick={() => onSubmitWork?.(event)}
                  >
                    <UploadSimple size={15} />
                    Submit Work
                  </button>
                )}
                <button
                  className="edm__close-btn"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}
                  onClick={() => onViewSubmissions?.(event)}
                >
                  My Submissions
                </button>
              </>
            ) : (
              <button
                className={`edm__apply-btn ${!isOpen ? "edm__apply-btn--disabled" : ""}`}
                onClick={() => isOpen && onApply(event)}
                disabled={!isOpen}
              >
                {applyLabel()}
              </button>
            )}
            <button className="edm__close-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}