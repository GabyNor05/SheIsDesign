import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Judge.css";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// 🔌 API CONNECTION: replace with real fetches
// e.g. GET /api/judge/events/:eventId/submissions
// e.g. POST /api/judge/events/:eventId/scores
//      body: { scores: [{ submissionId, score, comment }] }
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_EVENTS = {
  1: { title: "Brand Identity Challenge",  category: "Branding",     deadline: "20 Mar 2026" },
  2: { title: "UI/UX Hackathon 2026",      category: "UI/UX",        deadline: "12 Apr 2026" },
  3: { title: "Annual Design Awards 2025", category: "Awards",       deadline: "21 Oct 2025" },
  4: { title: "Illustration Open Brief",   category: "Illustration", deadline: "10 May 2026" },
};

const MOCK_SUBMISSIONS = {
  1: [
    { id: 101, studentName: "Ayasha Dlamini",  studentEmail: "a.dlamini@uct.ac.za",  submissionTitle: "Verde — Sustainable Fashion Identity",  color: "#C41262", existingScore: 92, existingComment: "Excellent concept, strong visual hierarchy." },
    { id: 102, studentName: "Zanele Mokoena",  studentEmail: "z.mokoena@uj.ac.za",   submissionTitle: "Aura Collective Brand System",          color: "#60A5FA", existingScore: 87, existingComment: "" },
    { id: 103, studentName: "Priya Naidoo",    studentEmail: "p.naidoo@ukzn.ac.za",  submissionTitle: "Bloom & Earth — Visual Identity",       color: "#22C55E", existingScore: 83, existingComment: "" },
    { id: 104, studentName: "Amara Diallo",    studentEmail: "a.diallo@nmu.ac.za",   submissionTitle: "Umber Studio Branding Concept",         color: "#FBBF24", existingScore: 79, existingComment: "" },
    { id: 105, studentName: "Nomvula Khumalo", studentEmail: "n.khumalo@wits.ac.za", submissionTitle: "Sol Co. Identity System",               color: "#a78bfa", existingScore: null, existingComment: "" },
    { id: 106, studentName: "Lerato Sithole",  studentEmail: "l.sithole@tut.ac.za",  submissionTitle: "The Form Collective — Brand Mark",      color: "#34d399", existingScore: null, existingComment: "" },
  ],
  2: [
    { id: 201, studentName: "Ayasha Dlamini",  studentEmail: "a.dlamini@uct.ac.za",  submissionTitle: "HealthLink — Community Mobile App",     color: "#C41262", existingScore: null, existingComment: "" },
    { id: 202, studentName: "Lerato Sithole",  studentEmail: "l.sithole@tut.ac.za",  submissionTitle: "CareTrack Patient Dashboard",           color: "#34d399", existingScore: null, existingComment: "" },
    { id: 203, studentName: "Amara Diallo",    studentEmail: "a.diallo@nmu.ac.za",   submissionTitle: "Vitals — Health Monitoring UI",         color: "#FBBF24", existingScore: null, existingComment: "" },
    { id: 204, studentName: "Zanele Mokoena",  studentEmail: "z.mokoena@uj.ac.za",   submissionTitle: "Remedy App — Pharmacy UX Flow",         color: "#60A5FA", existingScore: null, existingComment: "" },
    { id: 205, studentName: "Thandeka Zulu",   studentEmail: "t.zulu@dut.ac.za",     submissionTitle: "MediConnect Booking System",            color: "#f97316", existingScore: null, existingComment: "" },
  ],
  3: [
    { id: 301, studentName: "Priya Naidoo",    studentEmail: "p.naidoo@ukzn.ac.za",  submissionTitle: "Afro-Futurist Packaging Series",        color: "#22C55E", existingScore: 94, existingComment: "Outstanding work." },
    { id: 302, studentName: "Ayasha Dlamini",  studentEmail: "a.dlamini@uct.ac.za",  submissionTitle: "Watershed — Environmental Campaign",    color: "#C41262", existingScore: 91, existingComment: "" },
    { id: 303, studentName: "Nomvula Khumalo", studentEmail: "n.khumalo@wits.ac.za", submissionTitle: "Frequency — Sound Brand Identity",      color: "#a78bfa", existingScore: 85, existingComment: "" },
    { id: 304, studentName: "Amara Diallo",    studentEmail: "a.diallo@nmu.ac.za",   submissionTitle: "Solstice Type Specimen Book",           color: "#FBBF24", existingScore: 81, existingComment: "" },
    { id: 305, studentName: "Zanele Mokoena",  studentEmail: "z.mokoena@uj.ac.za",   submissionTitle: "Ritual Objects — Illustration Set",     color: "#60A5FA", existingScore: 77, existingComment: "" },
    { id: 306, studentName: "Chidi Okonkwo",   studentEmail: "c.okonkwo@cput.ac.za", submissionTitle: "Grid Study — Architectural Type",       color: "#fb7185", existingScore: 70, existingComment: "" },
    { id: 307, studentName: "Lerato Sithole",  studentEmail: "l.sithole@tut.ac.za",  submissionTitle: "Signal — Poster Campaign",              color: "#34d399", existingScore: 65, existingComment: "" },
  ],
  4: [
    { id: 501, studentName: "Ayasha Dlamini",  studentEmail: "a.dlamini@uct.ac.za",  submissionTitle: "Ancestors — Digital Mythology Series",  color: "#C41262", existingScore: null, existingComment: "" },
    { id: 502, studentName: "Zanele Mokoena",  studentEmail: "z.mokoena@uj.ac.za",   submissionTitle: "Ntu — Spirit of Ubuntu Illustrations",  color: "#60A5FA", existingScore: null, existingComment: "" },
    { id: 503, studentName: "Priya Naidoo",    studentEmail: "p.naidoo@ukzn.ac.za",  submissionTitle: "Alchemy — Afrofuturist Figures",        color: "#22C55E", existingScore: null, existingComment: "" },
    { id: 504, studentName: "Thandeka Zulu",   studentEmail: "t.zulu@dut.ac.za",     submissionTitle: "Bloom — Botanical Mythology",           color: "#f97316", existingScore: null, existingComment: "" },
    { id: 505, studentName: "Lerato Sithole",  studentEmail: "l.sithole@tut.ac.za",  submissionTitle: "Current — Water & Memory",              color: "#34d399", existingScore: null, existingComment: "" },
  ],
};

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

  const [event,       setEvent]       = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [scores,      setScores]      = useState({});   // { submissionId: { score, comment } }
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [toast,       setToast]       = useState(null);

  useEffect(() => {
    // 🔌 API CONNECTION: replace with real fetch
    // const res = await fetch(`/api/judge/events/${id}/submissions`)
    // const data = await res.json()
    const ev   = MOCK_EVENTS[id];
    const subs = MOCK_SUBMISSIONS[id] || [];
    setEvent(ev);
    setSubmissions(subs);

    // Pre-fill existing scores
    const initial = {};
    subs.forEach(s => {
      initial[s.id] = {
        score:   s.existingScore ?? "",
        comment: s.existingComment ?? "",
      };
    });
    setScores(initial);
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
    setSubmitting(true);



    // 🔌 API CONNECTION: send scores to backend
    // await fetch(`/api/judge/events/${id}/scores`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //   body: JSON.stringify({ scores: payload }),
    // });

    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));

    setSubmitting(false);
    setSubmitted(true);
    setToast("Scores submitted successfully!");
    setTimeout(() => setToast(null), 3500);
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

      {/* ── Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}