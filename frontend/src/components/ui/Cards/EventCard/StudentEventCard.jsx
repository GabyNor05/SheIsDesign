import { useState } from "react";
import "./StudentEventCard.css";

function fmtDate(d) {
  if (!d) return "TBC";
  return new Date(d).toLocaleDateString("en-ZA", { day: "2-digit", month: "short" });
}

function calcPct(count, max) {
  if (!max || max <= 0) return 0;
  return Math.min(100, Math.round(((count ?? 0) / max) * 100));
}

export default function StudentEventCard({ event, onApply, onViewDetails, applied = false }) {
  const [hov, setHov] = useState(false);

  const status = event.status?.toUpperCase() || "DRAFT";
  const pct = calcPct(event.entry_count, event.max_entry ?? event.max_entries);
  const isFull = pct >= 100;
  const isOpen = status === "OPEN" && !isFull;

  return (
    <div
      className={`sec ${hov ? "sec--hov" : ""}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Image — clicking opens detail modal */}
      <div className="sec__image" onClick={() => onViewDetails(event)} style={{ cursor: "pointer" }}>
        {event.image_link
          ? <img src={event.image_link} alt={event.title} className="sec__img" />
          : <div className="sec__img-placeholder" />
        }
        <span className={`sec__badge sec__badge--${status.toLowerCase()}`}>{status}</span>
      </div>

      {/* Body — clicking opens detail modal */}
      <div className="sec__body" onClick={() => onViewDetails(event)} style={{ cursor: "pointer" }}>
        <p className="sec__category">{event.category || "Event"}</p>
        <h3 className="sec__title">{event.title}</h3>
        <p className="sec__dates">{fmtDate(event.start_date)} — {fmtDate(event.end_date)}</p>

        <div className="sec__progress-row">
          <span className="sec__progress-label">
            {event.entry_count ?? 0} / {event.max_entry ?? event.max_entries ?? "?"} entries
          </span>
          <span className="sec__progress-pct" style={{ color: pct >= 80 ? "#FE4081" : "rgba(255,255,255,0.4)" }}>
            {pct}%
          </span>
        </div>
        <div className="sec__progress-track">
          <div className="sec__progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="sec__pts">{event.points_reward ?? 0} pts reward</p>
      </div>

      {/* Footer — two buttons */}
      <div className="sec__footer sec__footer--split">
        <button
          className="sec__view-btn"
          onClick={() => onViewDetails(event)}
        >
          View details
        </button>
<button
  className={`sec__apply-btn ${applied ? "sec__apply-btn--applied" : !isOpen ? "sec__apply-btn--disabled" : ""}`}
  onClick={() => !applied && isOpen && onApply(event)}
  disabled={applied || !isOpen}
>
  {applied ? "✓ Joined" : isFull ? "Full" : !isOpen ? "Closed" : "Join"}
</button>
      </div>
    </div>
  );
}