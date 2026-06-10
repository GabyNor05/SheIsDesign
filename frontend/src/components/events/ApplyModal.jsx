import { X, CalendarDots, Trophy, CheckCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import "./ApplyModal.css";

function fmtDate(d) {
  if (!d) return "TBC";
  return new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

export default function ApplyModal({ event, onClose, onConfirm }) {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  function handleConfirm() {
    setSuccess(true);
    onConfirm(event);
    setTimeout(onClose, 1800);
  }

  if (!event) return null;

  return (
    <div className="apply-modal__backdrop" onClick={onClose}>
      <div className="apply-modal" onClick={e => e.stopPropagation()}>
        <div className="apply-modal__glow-line" />

        {/* Success overlay */}
        {success && (
          <div className="apply-modal__success">
            <CheckCircle size={52} weight="fill" color="#10e266" />
            <p className="apply-modal__success-title">Application Submitted!</p>
            <p className="apply-modal__success-sub">Good luck with <strong>{event.title}</strong>.</p>
          </div>
        )}

        {/* Header */}
        <div className="apply-modal__header">
          <div className="apply-modal__header-left">
            <span className="apply-modal__eyebrow">Confirm Application</span>
            <h2 className="apply-modal__title">Apply for Event</h2>
          </div>
          <button className="apply-modal__close" onClick={onClose}><X size={15} /></button>
        </div>

        {/* Event summary */}
        <div className="apply-modal__body">
          {event.image_link && (
            <div className="apply-modal__img-wrap">
              <img src={event.image_link} alt={event.title} className="apply-modal__img" />
              <div className="apply-modal__img-overlay" />
            </div>
          )}

          <div className="apply-modal__event-info">
            <span className="apply-modal__category">{event.category}</span>
            <h3 className="apply-modal__event-title">{event.title}</h3>

            <div className="apply-modal__meta">
              <div className="apply-modal__meta-item">
                <CalendarDots size={13} color="rgba(255,255,255,0.4)" />
                <span>{fmtDate(event.start_date)} — {fmtDate(event.end_date)}</span>
              </div>
              <div className="apply-modal__meta-item">
                <Trophy size={13} color="#FE4081" />
                <span>{event.points_reward ?? 0} pts reward</span>
              </div>
            </div>
          </div>

          <p className="apply-modal__confirm-text">
            Are you sure you want to apply for this event? Once submitted your application will be reviewed.
          </p>

          <div className="apply-modal__actions">
            <button className="apply-modal__btn-ghost" onClick={onClose}>Cancel</button>
            <button className="apply-modal__btn-primary" onClick={handleConfirm}>
              Confirm Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}