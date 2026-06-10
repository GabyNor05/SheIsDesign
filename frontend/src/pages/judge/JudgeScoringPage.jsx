import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { eventService } from "../../services/eventService";
import { postService } from "../../services/postManagementService";
import { judgeMarkSchemeService } from "../../services/judgeMarkService";
import "./Judge.css";

const POST_COLORS = ["#C41262","#60A5FA","#22C55E","#FBBF24","#a78bfa","#34d399","#f97316","#fb7185"];
function postColor(index) { return POST_COLORS[index % POST_COLORS.length]; }

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function initials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

function Ic({ n, s = 16, c = "currentColor" }) {
  const paths = {
    left:   <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    cal:    <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    clock:  <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    check:  <polyline points="20 6 9 17 4 12"/>,
    send:   <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    file:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    close:  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    eye:    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[n] || null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  return (
    <div className="j-toast">
      <span className="j-toast__dot" />
      {message}
      <button className="j-toast__close" onClick={onClose}>
        <Ic n="close" s={13} c="currentColor" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function JudgeScoringPage() {
  const navigate          = useNavigate();
  const { eventId }       = useParams();
  const id                = Number(eventId);

  const [event,        setEvent]        = useState(null);
  const [submissions,  setSubmissions]  = useState([]);
  const [scores,       setScores]       = useState({});
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [toast,        setToast]        = useState(null);
  const [lightboxSrc,  setLightboxSrc]  = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    Promise.all([
      eventService.getEventById(id),
      postService.getPostsByEvent(id),
      judgeMarkSchemeService.getMarkSchemesByEvent(id),
    ]).then(([eventData, posts, markSchemes]) => {
      setEvent({
        title:    eventData.title ?? eventData.Title,
        category: eventData.category ?? eventData.Category,
        deadline: new Date(eventData.end_date ?? eventData.End_date)
          .toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }),
      });

      setSubmissions(posts.map((p, i) => ({
        id:              p.id,
        studentName:     p.studentName,
        studentEmail:    "",
        submissionTitle: p.title,
        imageLink:       p.imageFileLink,
        color:           postColor(i),
      })));

      const initial = {};
      posts.forEach(p => {
        const existing = markSchemes.find(m => m.postId === p.id);
        initial[p.id] = {
          score:        existing?.score ?? "",
          comment:      existing?.comment ?? "",
          markSchemeId: existing?.id ?? null,
        };
      });
      setScores(initial);
    }).catch(err => console.error("Failed to load scoring data:", err));
  }, [id]);

  function setScore(subId, value) {
    setScores(prev => ({ ...prev, [subId]: { ...prev[subId], score: value } }));
  }

  function setComment(subId, value) {
    setScores(prev => ({ ...prev, [subId]: { ...prev[subId], comment: value } }));
  }

  const scoredCount = submissions.filter(s => {
    const v = scores[s.id]?.score;
    return v !== "" && v !== null && v !== undefined;
  }).length;

  const pct         = submissions.length > 0 ? Math.round((scoredCount / submissions.length) * 100) : 0;
  const allScored   = scoredCount === submissions.length && submissions.length > 0;
  const isReadOnly  = submitted;

  async function handleSubmit() {
    if (!allScored) return;
    const judgeId = user?.judgeId;
    if (!judgeId) { setToast("Judge ID not found — please log in again."); return; }

    setSubmitting(true);
    try {
      await Promise.all(submissions.map(sub => {
        const { score, comment, markSchemeId } = scores[sub.id];
        const payload = { postId: sub.id, judgeId, score: Number(score), comment: comment ?? "" };
        if (markSchemeId) {
          return judgeMarkSchemeService.updateMarkScheme(markSchemeId, payload);
        }
        return judgeMarkSchemeService.createMarkScheme(payload);
      }));
      setSubmitted(true);
      setToast("Scores submitted successfully!");
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      console.error("Failed to save scores:", err);
      setToast("Failed to save scores. Please try again.");
      setTimeout(() => setToast(null), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  if (!event) return <div className="j-root" style={{ color: "rgba(255,255,255,0.4)", padding: 40 }}>Loading...</div>;

  return (
    <div className="j-root">

      {/* ── Back */}
      <button className="j-back-btn j-anim" onClick={() => navigate("/judge/events")}>
        <Ic n="left" s={14} c="currentColor" /> Back to Events
      </button>

      {/* ── Event banner */}
      <div className="js-event-banner j-anim" style={{ animationDelay: "0ms" }}>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            {event.category}
          </div>
          <h1 className="js-event-banner__title">{event.title}</h1>
          <div className="js-event-banner__meta" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Ic n="clock" s={12} c="rgba(255,255,255,0.4)" /> Score by {event.deadline}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Ic n="file" s={12} c="rgba(255,255,255,0.4)" /> {submissions.length} submissions
            </span>
          </div>
        </div>
        {submitted && (
          <span className="j-pill" style={{ background: "#052512", color: "#22C55E", borderColor: "rgba(34,197,94,0.3)", alignSelf: "flex-start" }}>
            <span className="j-pill__dot" style={{ background: "#22C55E" }} />
            Scores Submitted
          </span>
        )}
      </div>

      {/* ── Progress bar */}
      <div className="js-progress-wrap j-anim" style={{ animationDelay: "50ms" }}>
        <span className="js-progress-text">{scoredCount} of {submissions.length} scored</span>
        <div className="js-progress-bar">
          <div className="js-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="js-progress-pct">{pct}%</span>
      </div>

      {/* ── Submission cards */}
      <div className="j-anim" style={{ animationDelay: "80ms" }}>
        <div className="j-section-header" style={{ marginBottom: 12 }}>
          <div className="j-section-title">
            <Ic n="file" s={15} c="rgba(255,255,255,0.4)" />
            Submissions
            <span className="j-section-count">{submissions.length}</span>
          </div>
          {!isReadOnly && (
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
              Score each submission out of 100
            </span>
          )}
        </div>

        {submissions.map((sub, i) => {
          const val     = scores[sub.id]?.score;
          const comment = scores[sub.id]?.comment ?? "";
          const isScored= val !== "" && val !== null && val !== undefined;

          return (
            <div
              key={sub.id}
              className={`js-sub-card${isScored ? " js-sub-card--scored" : ""}`}
            >
              {/* Rank number */}
              <div className={`js-sub-card__rank${isScored ? " js-sub-card__rank--scored" : ""}`}>
                {i + 1}
              </div>

              {/* Avatar */}
              <div
                className="js-sub-card__avatar"
                style={{ background: `${sub.color}22`, color: sub.color }}
              >
                {initials(sub.studentName)}
              </div>

              {/* View image button */}
              {sub.imageLink && (
                <button
                  className="js-view-img-btn"
                  onClick={() => setLightboxSrc({ src: sub.imageLink, title: sub.submissionTitle, student: sub.studentName })}
                  title="View submission image"
                >
                  <Ic n="eye" s={14} c="currentColor" />
                  View
                </button>
              )}

              {/* Info */}
              <div className="js-sub-card__info">
                <div className="js-sub-card__name">{sub.studentName}</div>
                <div className="js-sub-card__submission">
                  <Ic n="file" s={11} c="rgba(255,255,255,0.3)" />
                  {sub.submissionTitle}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                  {sub.studentEmail}
                </div>
              </div>

              {/* Comment (optional) */}
              <div className="js-sub-card__comment">
                <textarea
                  className="js-comment-input"
                  rows={2}
                  placeholder="Optional comment..."
                  value={comment}
                  disabled={isReadOnly}
                  onChange={e => setComment(sub.id, e.target.value)}
                />
              </div>

              {/* Score input */}
              <div className="js-score-wrap">
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="—"
                  disabled={isReadOnly}
                  value={val ?? ""}
                  className={`js-score-input${isScored ? " js-score-input--filled" : ""}`}
                  onChange={e => {
                    const v = e.target.value;
                    setScore(sub.id, v === "" ? "" : Math.min(100, Math.max(0, parseInt(v, 10))));
                  }}
                />
                <span className="js-score-denom">/100</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Sticky submit bar */}
      {!isReadOnly && (
        <div className="js-submit-bar">
          <div className="js-submit-bar__info">
            {allScored ? (
              <>All submissions scored — ready to submit!</>
            ) : (
              <><strong>{submissions.length - scoredCount}</strong> submission{submissions.length - scoredCount !== 1 ? "s" : ""} still need a score.</>
            )}
          </div>
          <button
            className="js-submit-btn"
            disabled={!allScored || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              "Submitting..."
            ) : (
              <><Ic n="send" s={14} c="#fff" /> Submit All Scores</>
            )}
          </button>
        </div>
      )}

      {/* ── Image lightbox */}
      {lightboxSrc && (
        <dialog
          className="js-lightbox"
          open
          aria-label="Submission image"
          onCancel={() => setLightboxSrc(null)}
        >
          <button className="js-lightbox__backdrop" onClick={() => setLightboxSrc(null)} tabIndex={-1} />
          <div className="js-lightbox__panel">
            <div className="js-lightbox__header">
              <div>
                <div className="js-lightbox__student">{lightboxSrc.student}</div>
                <div className="js-lightbox__title">{lightboxSrc.title}</div>
              </div>
              <button className="js-lightbox__close" onClick={() => setLightboxSrc(null)}>
                <Ic n="close" s={16} c="currentColor" />
              </button>
            </div>
            <div className="js-lightbox__img-wrap">
              <img src={lightboxSrc.src} alt={lightboxSrc.title} className="js-lightbox__img" />
            </div>
          </div>
        </dialog>
      )}

      {/* ── Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}