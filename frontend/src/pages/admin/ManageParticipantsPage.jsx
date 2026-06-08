import { useState, useEffect } from "react";
import "./ManageParticipantsPage.css";
import {
  fetchParticipantsForAdmin,
  updateParticipantStatus,
} from "../../services/participantService";

async function fetchParticipants() {
  return fetchParticipantsForAdmin();
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — retained only as a fallback reference in the template.
// The live page now fetches data from the backend through participantService.
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PARTICIPANTS = [
  {
    id: 1,
    type: "student",
    initials: "AD",
    name: "Amara Diailo",
    email: "amara@wits.ac.za",
    institution: "Wits University",
    field: "Graphic Design",
    status: "approved",
    joined: "2 May 2026",
    submissions: 3,
    points: 420,
    color: "#C41262",
  },
  {
    id: 2,
    type: "student",
    initials: "SM",
    name: "Siya Mokoena",
    email: "siya@cput.ac.za",
    institution: "CPUT",
    field: "UX Design",
    status: "approved",
    joined: "1 May 2026",
    submissions: 1,
    points: 200,
    color: "#60A5FA",
  },
  {
    id: 3,
    type: "student",
    initials: "ND",
    name: "Naledi Dlamini",
    email: "naledi@up.ac.za",
    institution: "University of Pretoria",
    field: "Illustration",
    status: "pending",
    joined: "30 Apr 2026",
    submissions: 0,
    points: 0,
    color: "#22C55E",
  },
  {
    id: 4,
    type: "student",
    initials: "TK",
    name: "Thandi Khumalo",
    email: "thandi@uct.ac.za",
    institution: "University of Cape Town",
    field: "Visual Communication",
    status: "pending",
    joined: "28 Apr 2026",
    submissions: 0,
    points: 0,
    color: "#FBBF24",
  },
  {
    id: 5,
    type: "student",
    initials: "ZP",
    name: "Zoë Petersen",
    email: "zoe@uct.ac.za",
    institution: "University of Cape Town",
    field: "Brand Strategy",
    status: "approved",
    joined: "20 Apr 2026",
    submissions: 5,
    points: 870,
    color: "#a78bfa",
  },
  {
    id: 6,
    type: "student",
    initials: "KM",
    name: "Keabetswe Molefe",
    email: "keab@nwu.ac.za",
    institution: "NWU",
    field: "Motion Design",
    status: "approved",
    joined: "15 Apr 2026",
    submissions: 2,
    points: 350,
    color: "#34d399",
  },
  {
    id: 7,
    type: "student",
    initials: "LB",
    name: "Laila Brown",
    email: "laila@uj.ac.za",
    institution: "UJ",
    field: "Photography",
    status: "rejected",
    joined: "10 Apr 2026",
    submissions: 0,
    points: 0,
    color: "#f97316",
  },
  {
    id: 8,
    type: "student",
    initials: "NM",
    name: "Nandi Mahlangu",
    email: "nandi@dut.ac.za",
    institution: "DUT",
    field: "Web Design",
    status: "approved",
    joined: "8 Apr 2026",
    submissions: 4,
    points: 600,
    color: "#fb7185",
  },
  {
    id: 9,
    type: "professional",
    initials: "LN",
    name: "Lerato Nkosi",
    email: "lerato@ogilvy.co.za",
    institution: "Ogilvy SA",
    field: "Creative Director",
    status: "approved",
    joined: "30 Apr 2026",
    submissions: 0,
    points: 0,
    color: "#a78bfa",
  },
  {
    id: 10,
    type: "professional",
    initials: "ZPR",
    name: "Zoe Pretorius",
    email: "zoe@fcb.co.za",
    institution: "FCB Africa",
    field: "Art Direction",
    status: "pending",
    joined: "29 Apr 2026",
    submissions: 0,
    points: 0,
    color: "#34d399",
  },
  {
    id: 11,
    type: "professional",
    initials: "MB",
    name: "Mpho Baloyi",
    email: "mpho@freelance.co.za",
    institution: "Freelance",
    field: "Brand Strategy",
    status: "approved",
    joined: "27 Apr 2026",
    submissions: 0,
    points: 0,
    color: "#f97316",
  },
  {
    id: 12,
    type: "professional",
    initials: "TN",
    name: "Tebogo Nkuna",
    email: "tebogo@king.co.za",
    institution: "King James Group",
    field: "Digital Strategy",
    status: "rejected",
    joined: "22 Apr 2026",
    submissions: 0,
    points: 0,
    color: "#60A5FA",
  },
];

const STATUS_CONFIG = {
  approved: {
    bg: "#052512",
    color: "#22C55E",
    dot: "#22C55E",
    label: "Approved",
  },
  pending: {
    bg: "#1C1200",
    color: "#FBBF24",
    dot: "#FBBF24",
    label: "Pending",
  },
  rejected: {
    bg: "#200B0B",
    color: "#F87171",
    dot: "#F87171",
    label: "Rejected",
  },
};

const PAGE_SIZE = 8;

// ─────────────────────────────────────────────────────────────────────────────
// ICON
// ─────────────────────────────────────────────────────────────────────────────
function Ic({ n, s = 16, c = "currentColor" }) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </>
    ),
    close: (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    check: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
    briefcase: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
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
      {paths[n]}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS PILL
// ─────────────────────────────────────────────────────────────────────────────
function Pill({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className="p-pill"
      style={{ background: s.bg, color: s.color, borderColor: `${s.color}40` }}
    >
      <span className="p-pill__dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTICIPANT DRAWER
// ─────────────────────────────────────────────────────────────────────────────
function ParticipantDrawer({ person, onClose, onApprove, onReject }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="p-drawer-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="p-drawer">
        <div className="p-drawer__header">
          <h3 className="p-drawer__title">Participant Details</h3>
          <button
            className="p-drawer__close"
            onClick={onClose}
            aria-label="Close"
          >
            <Ic n="close" s={13} c="currentColor" />
          </button>
        </div>

        <div className="p-drawer__body">
          {/* Avatar */}
          <div
            className="p-drawer__avatar"
            style={{ background: `${person.color}22`, color: person.color }}
          >
            {person.initials}
          </div>
          <p className="p-drawer__name">{person.name}</p>
          <p className="p-drawer__email">{person.email}</p>
          <div className="p-drawer__pills">
            <Pill status={person.status} />
            <span className="p-field-tag">{person.field}</span>
            <span
              className="p-field-tag"
              style={{ textTransform: "capitalize" }}
            >
              {person.type}
            </span>
          </div>

          {/* Info */}
          <div className="p-drawer__section">
            <p className="p-drawer__section-title">Details</p>
            {[
              { label: "Institution", value: person.institution },
              { label: "Field", value: person.field },
              {
                label: "Type",
                value:
                  person.type === "student"
                    ? "Student"
                    : "Industry Professional",
              },
              { label: "Joined", value: person.joined },
            ].map((r) => (
              <div key={r.label} className="p-drawer__row">
                <span className="p-drawer__row-label">{r.label}</span>
                <span className="p-drawer__row-value">{r.value}</span>
              </div>
            ))}
          </div>

          {/* Activity */}
          {person.type === "student" && (
            <div className="p-drawer__section">
              <p className="p-drawer__section-title">Activity</p>
              {[
                { label: "Submissions", value: person.submissions },
                { label: "Points", value: `${person.points} pts` },
              ].map((r) => (
                <div key={r.label} className="p-drawer__row">
                  <span className="p-drawer__row-label">{r.label}</span>
                  <span className="p-drawer__row-value">{r.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions — only show for pending */}
        {person.status === "pending" && (
          <div className="p-drawer__footer">
            <button
              className="p-drawer__approve-btn"
              onClick={() => onApprove(person.id)}
            >
              Approve
            </button>
            <button
              className="p-drawer__deny-btn"
              onClick={() => onReject(person.id)}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ManageParticipantsPage() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all"); // all | student | professional
  const [statusFilter, setStatusFilter] = useState("all"); // all | approved | pending | rejected
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null); // participant in drawer

  // ── Load participants
  // 🔌 API CONNECTION: fetchParticipants() is where you swap in the real call
  useEffect(() => {
    setLoading(true);
    fetchParticipants()
      .then((data) => setParticipants(data))
      .catch((err) => console.error("Failed to load participants:", err))
      .finally(() => setLoading(false));
  }, []);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [type, statusFilter, search]);

  // ── Status actions
  // 🔌 API CONNECTION: replace setParticipants local update with real API call
  // e.g. await fetch(`/api/participants/${id}/approve`, { method: "POST" })
  const handleApprove = async (id) => {
    try {
      await updateParticipantStatus(id, "approved");
      setParticipants((p) =>
        p.map((x) => (x.id === id ? { ...x, status: "approved" } : x)),
      );
      setSelected((prev) =>
        prev?.id === id ? { ...prev, status: "approved" } : prev,
      );
    } catch (error) {
      console.error("Failed to approve participant:", error);
      alert(error.message || "Unable to approve participant right now.");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateParticipantStatus(id, "rejected");
      setParticipants((p) =>
        p.map((x) => (x.id === id ? { ...x, status: "rejected" } : x)),
      );
      setSelected((prev) =>
        prev?.id === id ? { ...prev, status: "rejected" } : prev,
      );
    } catch (error) {
      console.error("Failed to reject participant:", error);
      alert(error.message || "Unable to reject participant right now.");
    }
  };

  // ── Filtering
  const filtered = participants.filter((p) => {
    const matchType = type === "all" || p.type === type;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.institution.toLowerCase().includes(search.toLowerCase()) ||
      p.field.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Stats
  const students = participants.filter((p) => p.type === "student").length;
  const professionals = participants.filter(
    (p) => p.type === "professional",
  ).length;
  const pending = participants.filter((p) => p.status === "pending").length;
  const totalPts = participants.reduce((a, p) => a + (p.points || 0), 0);

  const STATS = [
    { icon: "users", label: "Total Students", value: students },
    { icon: "briefcase", label: "Professionals", value: professionals },
    { icon: "clock", label: "Pending Approval", value: pending },
    {
      icon: "award",
      label: "Total Points Awarded",
      value: totalPts.toLocaleString(),
    },
  ];

  return (
    <div className="p-root">
      {/* ── Page header */}
      <div className="p-header p-anim" style={{ animationDelay: "0ms" }}>
        <div>
          <p className="p-header__eyebrow">
            <span className="p-header__eyebrow-line" />
            Admin · Participants
          </p>
          <h1 className="p-header__title">Participants</h1>
          <p className="p-header__sub">
            View and manage all students and industry professionals.
          </p>
        </div>
      </div>

      {/* ── Stats */}
      <div className="p-stats p-anim" style={{ animationDelay: "60ms" }}>
        {STATS.map((s) => (
          <div key={s.label} className="p-stat">
            <div className="p-stat__icon">
              <Ic n={s.icon} s={18} c="#FE4081" />
            </div>
            <div>
              <div className="p-stat__value">{s.value}</div>
              <div className="p-stat__label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls */}
      <div className="p-controls p-anim" style={{ animationDelay: "100ms" }}>
        <div className="p-controls__left">
          {/* Type toggle */}
          <div className="p-type-tabs">
            {[
              { key: "all", label: `All (${participants.length})` },
              { key: "student", label: `Students (${students})` },
              {
                key: "professional",
                label: `Professionals (${professionals})`,
              },
            ].map((t) => (
              <button
                key={t.key}
                className={`p-type-tab${type === t.key ? " p-type-tab--active" : ""}`}
                onClick={() => setType(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-controls__right">
          {/* Status filter */}
          <div className="p-filter-wrap">
            <select
              className="p-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Search */}
          <div className="p-search-wrap">
            <span className="p-search-icon">
              <Ic n="search" s={13} c="rgba(255,255,255,0.35)" />
            </span>
            <input
              className="p-search-input"
              placeholder="Search name, institution, field..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search participants"
            />
          </div>
        </div>
      </div>

      {/* ── Table */}
      <div className="p-table-wrap p-anim" style={{ animationDelay: "140ms" }}>
        {loading ? (
          <div className="p-empty">Loading participants...</div>
        ) : paged.length === 0 ? (
          <div className="p-empty">
            No participants found{search ? ` matching "${search}"` : ""}.
          </div>
        ) : (
          <table className="p-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Institution</th>
                <th>Field</th>
                <th>Type</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((person) => (
                <tr key={person.id} onClick={() => setSelected(person)}>
                  <td>
                    <div className="p-avatar-cell">
                      <div
                        className="p-avatar"
                        style={{
                          background: `${person.color}22`,
                          color: person.color,
                        }}
                      >
                        {person.initials}
                      </div>
                      <div>
                        <div className="p-avatar-name">{person.name}</div>
                        <div className="p-avatar-email">{person.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.65)" }}>
                    {person.institution}
                  </td>
                  <td>
                    <span className="p-field-tag">{person.field}</span>
                  </td>
                  <td
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      textTransform: "capitalize",
                      fontSize: 12,
                    }}
                  >
                    {person.type === "student" ? "Student" : "Professional"}
                  </td>
                  <td>
                    <Pill status={person.status} />
                  </td>
                  <td style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                    {person.joined}
                  </td>
                  <td>
                    <div
                      className="p-row-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="p-icon-btn"
                        aria-label="View"
                        onClick={() => setSelected(person)}
                      >
                        <Ic n="eye" s={14} c="currentColor" />
                      </button>
                      {person.status === "pending" && (
                        <>
                          <button
                            className="p-icon-btn"
                            aria-label="Approve"
                            onClick={() => handleApprove(person.id)}
                            style={{ color: "#22C55E" }}
                            title="Approve"
                          >
                            <Ic n="check" s={14} c="currentColor" />
                          </button>
                        </>
                      )}
                      <button
                        className="p-icon-btn p-icon-btn--danger"
                        aria-label="Remove"
                        onClick={() => handleReject(person.id)}
                      >
                        <Ic n="trash" s={14} c="currentColor" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ── Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="p-pagination">
            <span className="p-pagination__info">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="p-pagination__controls">
              <button
                className="p-page-btn"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`p-page-num${n === page ? " p-page-num--active" : ""}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="p-page-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail drawer */}
      {selected && (
        <ParticipantDrawer
          person={selected}
          onClose={() => setSelected(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
