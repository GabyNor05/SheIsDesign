import { useState, useMemo, useEffect } from "react";
import "./ManageLeaderboardPage.css";
import {
  fetchEvents,
  fetchLeaderboardForEvent,
  updateSubmission,
} from "../../services/leaderboardService";

// The page is now wired to the real backend API through the service layer.

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
function rankSuffix(n) {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

const STATUS_CONFIG = {
  Pending: { bg: "#1C1200", color: "#FBBF24", dot: "#FBBF24" },
  Reviewed: { bg: "#0A1628", color: "#60A5FA", dot: "#60A5FA" },
  Winner: { bg: "rgba(196,18,98,0.12)", color: "#FE4081", dot: "#C41262" },
};

const MOCK_LEADERBOARD_SEEDS = [
  {
    studentName: "Amara Diailo",
    studentEmail: "amara@wits.ac.za",
    submissionTitle: "Creative Brief",
    status: "Winner",
    score: 95,
    rank: 1,
    isWinner: true,
  },
  {
    studentName: "Siya Mokoena",
    studentEmail: "siya@cput.ac.za",
    submissionTitle: "UX Concept Deck",
    status: "Reviewed",
    score: 88,
    rank: 2,
    isWinner: false,
  },
  {
    studentName: "Naledi Dlamini",
    studentEmail: "naledi@up.ac.za",
    submissionTitle: "Illustration Pitch",
    status: "Pending",
    score: 74,
    rank: 3,
    isWinner: false,
  },
];

function getMockLeaderboardForEvent(eventId) {
  return MOCK_LEADERBOARD_SEEDS.map((entry, index) => ({
    id: 9000 + eventId * 10 + index,
    eventId,
    studentName: entry.studentName,
    studentEmail: entry.studentEmail,
    submissionTitle: entry.submissionTitle,
    status: entry.status,
    score: entry.score,
    rank: entry.rank,
    submittedAt: "—",
    isWinner: entry.isWinner,
    color: "#FE4081",
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICON COMPONENT — no emojis, consistent with Events.jsx
// ─────────────────────────────────────────────────────────────────────────────
function Ic({ n, s = 16, c = "currentColor" }) {
  const paths = {
    trophy: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </>
    ),
    check: (
      <>
        <polyline points="20 6 9 17 4 12" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    star: (
      <>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </>
    ),
    bar: (
      <>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </>
    ),
    refresh: (
      <>
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </>
    ),
    cal: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    img: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </>
    ),
    inbox: (
      <>
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </>
    ),
    desc: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </>
    ),
  };
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[n] || null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS PILL
// ─────────────────────────────────────────────────────────────────────────────
function Pill({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  return (
    <span
      className="lb-pill"
      style={{ background: s.bg, color: s.color, borderColor: `${s.color}40` }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.dot,
          display: "inline-block",
        }}
      />
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RANK CELL
// ─────────────────────────────────────────────────────────────────────────────
function RankCell({ rank }) {
  if (rank === null)
    return (
      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>—</span>
    );
  const cls =
    rank === 1
      ? "lb-rank__badge--1"
      : rank === 2
        ? "lb-rank__badge--2"
        : rank === 3
          ? "lb-rank__badge--3"
          : "lb-rank__badge--n";
  return (
    <div className="lb-rank">
      <div className={`lb-rank__badge ${cls}`}>{rank}</div>
      <span className="lb-rank__suffix">
        {rank}
        {rankSuffix(rank)}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE INPUT
// ─────────────────────────────────────────────────────────────────────────────
function ScoreInput({ value, onChange }) {
  return (
    <div className="lb-score-wrap">
      <input
        type="number"
        min={0}
        max={100}
        value={value ?? ""}
        placeholder="—"
        className="lb-score-input"
        onChange={(e) => {
          const v = e.target.value;
          onChange(
            v === "" ? null : Math.min(100, Math.max(0, parseInt(v, 10))),
          );
        }}
      />
      <span className="lb-score-denom">/100</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WINNER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function WinnerModal({ submission, onConfirm, onCancel }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <div
      className="lb-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="lb-modal">
        <div className="lb-modal__body">
          <div className="lb-modal__icon">
            <Ic n="trophy" s={26} c="#FE4081" />
          </div>
          <div>
            <h3 className="lb-modal__title">Confirm Winner Selection?</h3>
            <p className="lb-modal__sub">
              You are about to mark{" "}
              <strong style={{ color: "#F0F0F0" }}>
                {submission.studentName}
              </strong>{" "}
              as the winner for{" "}
              <strong style={{ color: "#F0F0F0" }}>
                "{submission.submissionTitle}"
              </strong>
              . Any existing winner will be replaced.
            </p>
          </div>
        </div>
        <div className="lb-modal__footer">
          <button className="lb-modal__cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="lb-modal__confirm" onClick={onConfirm}>
            <Ic n="trophy" s={14} c="#fff" /> Confirm Winner
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIEW SUBMISSION MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ViewModal({ submission, rank, onClose }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="lb-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="lb-modal lb-modal--wide">
        {/* Header */}
        <div className="lb-view-modal__header">
          <div className="lb-view-modal__student">
            <div
              className="lb-avatar"
              style={{
                background: `${submission.color}22`,
                color: submission.color,
              }}
            >
              {initials(submission.studentName)}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#F0F0F0",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {submission.studentName}
                {submission.isWinner && (
                  <span className="lb-winner-tag">
                    <Ic n="trophy" s={9} c="#fff" /> Winner
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                {submission.studentEmail}
              </div>
            </div>
          </div>
          <button className="lb-view-modal__close" onClick={onClose}>
            <Ic n="close" s={13} c="currentColor" />
          </button>
        </div>

        {/* Body */}
        <div className="lb-view-modal__body">
          <div className="lb-view-card">
            <div className="lb-view-card__label">
              <Ic n="desc" s={11} c="rgba(255,255,255,0.3)" /> Submission Title
            </div>
            <div className="lb-view-card__value">
              {submission.submissionTitle}
            </div>
          </div>

          <div className="lb-view-meta-grid">
            {[
              {
                label: "Score",
                value:
                  submission.score !== null
                    ? `${submission.score} / 100`
                    : "Not scored",
              },
              {
                label: "Current Rank",
                value: rank !== null ? `#${rank}` : "Unranked",
              },
              { label: "Submitted", value: submission.submittedAt },
            ].map((item) => (
              <div key={item.label} className="lb-view-card">
                <div className="lb-view-card__label">{item.label}</div>
                <div className="lb-view-card__value">{item.value}</div>
              </div>
            ))}
          </div>

          <div>
            <div
              className="lb-view-card__label"
              style={{
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Ic n="img" s={11} c="rgba(255,255,255,0.3)" /> Submission Preview
            </div>
            <div className="lb-view-preview">
              <Ic n="img" s={28} c="rgba(255,255,255,0.15)" />
              <span>File preview not available yet</span>
            </div>
          </div>
        </div>

        <div className="lb-view-modal__footer">
          <button
            className="lb-modal__confirm"
            style={{ maxWidth: 120 }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  return (
    <div className="lb-toast">
      <span className="lb-toast__dot" />
      {message}
      <button className="lb-toast__close" onClick={onClose}>
        <Ic n="close" s={13} c="currentColor" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMISSIONS TABLE
// ─────────────────────────────────────────────────────────────────────────────
function SubmissionsTable({
  submissions,
  onScoreChange,
  onView,
  onMarkWinner,
}) {
  const scored = [...submissions]
    .filter((s) => s.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const rankMap = new Map();
  scored.forEach((s, i) => rankMap.set(s.id, i + 1));
  const sorted = [...scored, ...submissions.filter((s) => s.score === null)];

  if (submissions.length === 0) {
    return (
      <div className="lb-table-wrap">
        <div className="lb-empty">
          <div className="lb-empty__icon">
            <Ic n="inbox" s={36} c="rgba(255,255,255,0.15)" />
          </div>
          No submissions yet — they will appear here once the event closes.
        </div>
      </div>
    );
  }

  return (
    <div className="lb-table-wrap">
      <table className="lb-table">
        <thead>
          <tr>
            <th style={{ width: 80 }}>Rank</th>
            <th>Student</th>
            <th>Submission</th>
            <th style={{ width: 130 }}>Score</th>
            <th style={{ width: 110 }}>Status</th>
            <th style={{ width: 190, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((sub) => {
            const rank = rankMap.get(sub.id) ?? null;
            return (
              <tr key={sub.id} className={sub.isWinner ? "lb-row--winner" : ""}>
                {/* Rank */}
                <td>
                  <RankCell rank={rank} isWinner={sub.isWinner} />
                </td>

                {/* Student */}
                <td>
                  <div className="lb-student">
                    <div
                      className="lb-avatar"
                      style={{ background: `${sub.color}22`, color: sub.color }}
                    >
                      {initials(sub.studentName)}
                    </div>
                    <div>
                      <div className="lb-student__name">
                        {sub.studentName}
                        {sub.isWinner && (
                          <span className="lb-winner-tag">
                            <Ic n="trophy" s={9} c="#fff" /> Winner
                          </span>
                        )}
                      </div>
                      <div className="lb-student__email">
                        {sub.studentEmail}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Submission */}
                <td>
                  <div className="lb-sub-title">
                    <div className="lb-sub-title__icon">
                      <Ic n="file" s={13} c="rgba(255,255,255,0.3)" />
                    </div>
                    <span className="lb-sub-title__text">
                      {sub.submissionTitle}
                    </span>
                  </div>
                </td>

                {/* Score */}
                <td>
                  <ScoreInput
                    value={sub.score}
                    onChange={(v) => onScoreChange(sub.id, v)}
                  />
                </td>

                {/* Status */}
                <td>
                  <Pill status={sub.status} />
                </td>

                {/* Actions */}
                <td>
                  <div className="lb-row-actions">
                    <button
                      className="lb-action-btn"
                      onClick={() => onView(sub)}
                    >
                      <Ic n="eye" s={13} c="currentColor" /> View
                    </button>
                    
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ManageLeaderboardPage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [winnerTarget, setWinnerTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [recalcFlash, setRecalcFlash] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const eventData = await fetchEvents();
        if (!isMounted) return;

        const nextEvents =
          Array.isArray(eventData) && eventData.length > 0
            ? eventData
            : [{ id: 1, title: "SheIsDesign Showcase", date: "Live demo" }];

        setEvents(nextEvents);
        setSelectedEventId(nextEvents[0]?.id ?? null);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load events:", err);
        setError(err.message || "Unable to load events from the backend.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedEventId === null) return;

    let isMounted = true;

    async function loadLeaderboard() {
      try {
        setLoading(true);
        const data = await fetchLeaderboardForEvent(selectedEventId);
        if (!isMounted) return;

        const nextData =
          Array.isArray(data) && data.length > 0
            ? data
            : getMockLeaderboardForEvent(selectedEventId);

        setSubmissions(nextData);
        setError("");
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load leaderboard:", err);
        setError(err.message || "Unable to load leaderboard results.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [selectedEventId]);

  const selectedEvent = events.find((e) => e.id === selectedEventId);
  const eventSubs = useMemo(
    () => submissions.filter((s) => s.eventId === selectedEventId),
    [submissions, selectedEventId],
  );

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  // 🔌 API CONNECTION: wire up score update
  // e.g. await fetch(`/api/submissions/${id}/score`, { method: "PATCH", body: JSON.stringify({ score }) })
  async function handleScoreChange(id, score) {
    const current = submissions.find((s) => s.id === id);
    if (!current) return;

    const nextStatus =
      score === null
        ? "Pending"
        : current.status === "Winner"
          ? "Winner"
          : "Reviewed";

    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, score, status: nextStatus } : s)),
    );

    try {
      await updateSubmission(id, {
        title: current.submissionTitle,
        status: nextStatus,
        points: score ?? 0,
        rank: current.rank ?? 0,
      });
      showToast("Score updated successfully.");
    } catch (err) {
      console.error("Failed to update submission score:", err);
      setSubmissions((prev) => prev.map((s) => (s.id === id ? current : s)));
      setError(err.message || "Unable to save the score change.");
    }
  }

  // 🔌 API CONNECTION: wire up winner selection
  // e.g. await fetch(`/api/submissions/${winnerTarget.id}/winner`, { method: "POST" })
  async function confirmWinner() {
    if (!winnerTarget) return;

    try {
      const eventEntries = submissions.filter(
        (s) => s.eventId === selectedEventId,
      );

      await Promise.all(
        eventEntries.map((entry) =>
          updateSubmission(entry.id, {
            title: entry.submissionTitle,
            status:
              entry.id === winnerTarget.id
                ? "Winner"
                : entry.status === "Winner"
                  ? "Reviewed"
                  : entry.status,
            points: entry.score ?? 0,
            rank: entry.rank ?? 0,
          }),
        ),
      );

      setSubmissions((prev) =>
        prev.map((s) =>
          s.eventId === selectedEventId
            ? {
                ...s,
                isWinner: s.id === winnerTarget.id,
                status:
                  s.id === winnerTarget.id
                    ? "Winner"
                    : s.status === "Winner"
                      ? "Reviewed"
                      : s.status,
              }
            : s,
        ),
      );

      showToast(`${winnerTarget.studentName} marked as winner.`);
      setWinnerTarget(null);
      setError("");
    } catch (err) {
      console.error("Failed to update winner selection:", err);
      setError(err.message || "Unable to save the winner selection.");
    }
  }

  function handleRecalculate() {
    setRecalcFlash(true);
    setTimeout(() => setRecalcFlash(false), 800);
    showToast("Rankings recalculated successfully.");
  }

  const rankMap = useMemo(() => {
    const scored = eventSubs
      .filter((s) => s.score !== null)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    const map = new Map();
    scored.forEach((s, i) => map.set(s.id, i + 1));
    return map;
  }, [eventSubs]);

  const reviewed = eventSubs.filter((s) => s.status !== "Pending").length;
  const pending = eventSubs.filter((s) => s.status === "Pending").length;
  const scoredSubs = eventSubs.filter((s) => s.score !== null);
  const avgScore =
    scoredSubs.length > 0
      ? Math.round(
          scoredSubs.reduce((a, s) => a + (s.score ?? 0), 0) /
            scoredSubs.length,
        )
      : null;
  const winner = eventSubs.find((s) => s.isWinner);

  const STATS = [
    { icon: "file", label: "Total Submissions", value: eventSubs.length },
    { icon: "check", label: "Reviewed", value: reviewed },
    { icon: "clock", label: "Pending Review", value: pending },
    {
      icon: "star",
      label: "Avg Score",
      value: avgScore !== null ? avgScore : "—",
    },
  ];

  return (
    <div className="lb-root">
      {/* ── Page header */}
      <div className="lb-header lb-anim" style={{ animationDelay: "0ms" }}>
        <div className="lb-header__left">
          <p className="lb-header__eyebrow">
            <span className="lb-header__eyebrow-line" />
            Admin · Leaderboard
          </p>
          <h1 className="lb-header__title">Leaderboard Management</h1>
          <p className="lb-header__sub">
            Review submissions and assign competition scores.
          </p>
        </div>

        <div className="lb-header__right">
          <div className="lb-event-selector">
            <span className="lb-event-selector__label">Select Event</span>
            <div className="lb-event-selector__wrap">
              <select
                className="lb-event-select"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(Number(e.target.value))}
              >
                {events.map((ev) => (
                  <option
                    key={ev.id}
                    value={ev.id}
                    style={{ background: "#1A1A1A" }}
                  >
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="lb-event-date-pill">
            <Ic n="cal" s={13} c="rgba(255,255,255,0.4)" />
            {selectedEvent?.date ?? "—"}
          </div>
        </div>
      </div>

      {error && (
        <div
          className="lb-winner-banner lb-anim"
          style={{
            animationDelay: "40ms",
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.2)",
          }}
        >
          <div className="lb-winner-banner__icon">
            <Ic n="clock" s={18} c="#F87171" />
          </div>
          <div>
            <div
              className="lb-winner-banner__label"
              style={{ color: "#FCA5A5" }}
            >
              Live data notice
            </div>
            <div style={{ color: "rgba(255,255,255,0.75)" }}>{error}</div>
          </div>
        </div>
      )}

      {/* ── Winner banner */}
      {winner && (
        <div
          className="lb-winner-banner lb-anim"
          style={{ animationDelay: "50ms" }}
        >
          <div className="lb-winner-banner__icon">
            <Ic n="trophy" s={20} c="#fff" />
          </div>
          <div>
            <div className="lb-winner-banner__label">Current Winner</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span className="lb-winner-banner__name">
                {winner.studentName}
              </span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
              <span className="lb-winner-banner__title">
                {winner.submissionTitle}
              </span>
              {winner.score !== null && (
                <>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
                  <span className="lb-winner-banner__score">
                    {winner.score} / 100
                  </span>
                </>
              )}
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Pill status="Winner" />
          </div>
        </div>
      )}

      {/* ── Stats */}
      <div className="lb-stats lb-anim" style={{ animationDelay: "80ms" }}>
        {STATS.map((s) => (
          <div key={s.label} className="lb-stat">
            <div className="lb-stat__icon">
              <Ic n={s.icon} s={18} c="#FE4081" />
            </div>
            <div>
              <div className="lb-stat__value">{s.value}</div>
              <div className="lb-stat__label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table section */}
      <div
        className=" lb-anim w-full"
        style={{ animationDelay: "120ms" }}
      >
        <div className="lb-table-toolbar mt-12 mb-5">
          <div className="lb-table-toolbar__left">
            <Ic n="bar" s={16} c="rgba(255,255,255,0.4)" />
            <span className="lb-table-toolbar__title">Submissions</span>
            <span className="lb-table-toolbar__count">{eventSubs.length}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="lb-table-toolbar__hint">
              Edit scores inline, then press
            </span>
            <button
              className={`lb-recalc-btn${recalcFlash ? " lb-recalc-btn--flash" : ""}`}
              onClick={handleRecalculate}
            >
              <Ic n="refresh" s={14} c="currentColor" /> Recalculate Rankings
            </button>
          </div>
        </div>

        {loading ? (
          <div className="lb-empty">Loading leaderboard data…</div>
        ) : (
          <SubmissionsTable
            submissions={eventSubs}
            onScoreChange={handleScoreChange}
            onView={(s) => setViewTarget(s)}
            onMarkWinner={(s) => setWinnerTarget(s)}
          />
        )}

        <div className="lb-hint-row">
          <span className="lb-hint-row__text">
            Rankings are auto-sorted by score. Click{" "}
            <strong style={{ color: "rgba(255,255,255,0.5)" }}>
              Update Rankings
            </strong>{" "}
            to commit changes.
          </span>
          {scoredSubs.length > 0 && (
            <span className="lb-hint-row__scored">
              {scoredSubs.length} of {eventSubs.length} scored
            </span>
          )}
        </div>
      </div>

      {/* ── Modals */}
      {winnerTarget && (
        <WinnerModal
          submission={winnerTarget}
          onConfirm={confirmWinner}
          onCancel={() => setWinnerTarget(null)}
        />
      )}
      {viewTarget && (
        <ViewModal
          submission={viewTarget}
          rank={rankMap.get(viewTarget.id) ?? null}
          onClose={() => setViewTarget(null)}
        />
      )}

      {/* ── Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
