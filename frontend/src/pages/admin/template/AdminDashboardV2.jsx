import { useState } from "react";
import "./AdminDashboardV2.css";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_NAME  = "Admin";
const ADMIN_EMAIL = "admin@sheisdesign.co.za";
const TODAY       = "Monday, 4 May 2025";
const PAGE_TITLE  = "Overview";
const PAGE_SUB    = "Manage events, participants, and competitions.";

const QUICK_ACTIONS = [
  { id: 1, icon: "plus",  label: "Create Event"        },
  { id: 2, icon: "file",  label: "Review Applications" },
  { id: 3, icon: "award", label: "Invite Judge"        },
  { id: 4, icon: "chart", label: "View Leaderboard"    },
];

const UPCOMING_EVENTS = [
  { id: "evt-001", title: "Brand Identity Challenge", category: "BRAND IDENTITY", status: "OPEN",     dateRange: "1–12 Mar 2026",  entries: 84,  maxEntries: 100 },
  { id: "evt-002", title: "Motion Design Bootcamp",   category: "MOTION DESIGN",  status: "OPEN",     dateRange: "10–20 Mar 2026", entries: 41,  maxEntries: 60  },
  { id: "evt-003", title: "UI/UX Hackathon 2026",     category: "UX DESIGN",      status: "OPEN",     dateRange: "1–5 Apr 2026",   entries: 112, maxEntries: 150 },
  { id: "evt-004", title: "Typography Sprint",        category: "GRAPHIC DESIGN", status: "UPCOMING", dateRange: "12–18 Apr 2026", entries: 29,  maxEntries: 60  },
];

const PENDING_STUDENTS = [
  { id: 1, initials: "AD", name: "Amara Diailo",   uni: "Wits University",         field: "Graphic Design",       date: "2 May 2026",  color: "#C41262" },
  { id: 2, initials: "SM", name: "Siya Mokoena",   uni: "CPUT",                    field: "UX Design",            date: "1 May 2026",  color: "#60A5FA" },
  { id: 3, initials: "ND", name: "Naledi Dlamini", uni: "University of Pretoria",  field: "Illustration",         date: "30 Apr 2026", color: "#22C55E" },
  { id: 4, initials: "TK", name: "Thandi Khumalo", uni: "University of Cape Town", field: "Visual Communication", date: "28 Apr 2026", color: "#FBBF24" },
];

const PENDING_PROFESSIONALS = [
  { id: 5, initials: "LN", name: "Lerato Nkosi", uni: "Ogilvy SA",  field: "Creative Director", date: "30 Apr 2026", color: "#a78bfa" },
  { id: 6, initials: "ZP", name: "Zoe Petersen", uni: "FCB Africa", field: "Art Direction",     date: "29 Apr 2026", color: "#34d399" },
  { id: 7, initials: "MB", name: "Mpho Baloyi",  uni: "Freelance",  field: "Brand Strategy",    date: "27 Apr 2026", color: "#f97316" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "participant", icon: "user",     title: "New student registered",   detail: "Amara Diailo · Wits University",     time: "2 min ago"  },
  { id: 2, type: "event",      icon: "calendar", title: "Event created",            detail: "Brand Identity Challenge 2025",       time: "18 min ago" },
  { id: 3, type: "submission", icon: "file",     title: "Submission uploaded",      detail: "Laila Nkosi · Spring Campaign",       time: "34 min ago" },
  { id: 4, type: "donation",   icon: "heart",    title: "Donation received",        detail: "R 2,500 · Anonymous Donor",           time: "1h ago"     },
  { id: 5, type: "participant",icon: "check",    title: "Student account approved", detail: "Zoë Petersen · UCT",                  time: "2h ago"     },
  { id: 6, type: "event",      icon: "edit",     title: "Event updated",            detail: "Motion Design Bootcamp — date moved", time: "3h ago"     },
];

const PLATFORM_SUMMARY = [
  { icon: "graduation", label: "Total Students",      value: "1,024" },
  { icon: "briefcase",  label: "Total Professionals", value: "223"   },
  { icon: "calendar",   label: "Active Events",       value: "5"     },
  { icon: "file",       label: "Total Submissions",   value: "3,840" },
];

const STATUS_STYLE = {
  OPEN:     { bg: "var(--green-bg)", color: "var(--green)", dot: "var(--green)" },
  UPCOMING: { bg: "var(--blue-bg)",  color: "var(--blue)",  dot: "var(--blue)"  },
  DRAFT:    { bg: "var(--gray-bg)",  color: "var(--gray)",  dot: "var(--gray)"  },
  CLOSED:   { bg: "var(--red-bg)",   color: "var(--red)",   dot: "var(--red)"   },
};

const ACTIVITY_TYPE_STYLE = {
  participant: { bg: "var(--pink-dim)", color: "var(--pink-hot)" },
  event:       { bg: "var(--blue-bg)", color: "var(--blue)"     },
  submission:  { bg: "#161A0E",        color: "var(--amber)"    },
  donation:    { bg: "#200B14",        color: "#f472b6"         },
};

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICON COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function Icon({ name, size = 16, color = "currentColor" }) {
  const icons = {
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    file:       <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    award:      <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    chart:      <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    calendar:   <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
    users:      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    bell:       <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    logout:     <><path d="M9 21H5a2 2 0 0 0-2-2V5a2 2 0 0 0 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    check:      <polyline points="20 6 9 17 4 12"/>,
    x:          <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    user:       <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    heart:      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    edit:       <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    graduation: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>,
    briefcase:  <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>,
    arrow:      <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.DRAFT;
  return (
    <span className="status-badge" style={{ background: s.bg, color: s.color, borderColor: `${s.color}30` }}>
      <span className="status-badge__dot" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function SectionHeader({ icon, title, badge, action, onAction }) {
  return (
    <div className="section-header">
      <div className="section-header__left">
        {icon && (
          <div className="section-header__icon-wrap">
            <Icon name={icon} size={15} color="var(--text-second)" />
          </div>
        )}
        <h2 className="section-header__title">{title}</h2>
        {badge !== undefined && (
          <span className="section-header__badge">{badge}</span>
        )}
      </div>
      {action && (
        <button className="section-header__action-btn" onClick={onAction}>
          {action} <Icon name="arrow" size={12} color="var(--pink-hot)" />
        </button>
      )}
    </div>
  );
}

function Card({ children, style = {}, glow = false }) {
  return (
    <div className={`card${glow ? " card--glow" : ""}`} style={style}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
// function Topbar() {
//   return (
//     <header className="topbar">
//       <span className="topbar__logo">
//         Shels<span>Design</span>
//       </span>
//       <div className="topbar__right">
//         <button className="topbar__notif-btn" aria-label="Notifications">
//           <Icon name="bell" size={18} color="var(--text-second)" />
//           <span className="topbar__notif-dot" />
//         </button>
//         <div className="topbar__user">
//           <div className="topbar__avatar">
//             <span>A</span>
//           </div>
//           <div>
//             <div className="topbar__user-name">{ADMIN_NAME}</div>
//             <div className="topbar__user-email">{ADMIN_EMAIL}</div>
//           </div>
//         </div>
//         <button className="topbar__logout-btn">
//           <Icon name="logout" size={13} color="currentColor" /> Logout
//         </button>
//       </div>
//     </header>
//   );
// }

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HEADER
// ─────────────────────────────────────────────────────────────────────────────
function PageHeader() {
  return (
    <div className="page-header">
      <div>
        <p className="page-header__eyebrow">
          <span className="page-header__eyebrow-line" />
          Admin Dashboard
        </p>
        <h1 className="page-header__title">{PAGE_TITLE}</h1>
        <p className="page-header__sub">{PAGE_SUB}</p>
      </div>
      <div className="page-header__meta">
        <time className="page-header__date">{TODAY}</time>
        <span className="page-header__status">
          <span className="page-header__status-dot" />
          System Online
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK ACTIONS
// ─────────────────────────────────────────────────────────────────────────────
function QuickActions() {
  return (
    <div className="quick-actions">
      {QUICK_ACTIONS.map((action, i) => (
        <button
          key={action.id}
          className={`quick-actions__btn${i === 0 ? " quick-actions__btn--primary" : ""}`}
        >
          <Icon name={action.icon} size={15} color={i === 0 ? "#fff" : "var(--text-second)"} />
          {action.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT CARD
// ─────────────────────────────────────────────────────────────────────────────
function EventCard({ event }) {
  const pct = Math.min(100, Math.round((event.entries / event.maxEntries) * 100));
  return (
    <div className="event-card">
      <div className="event-card__top">
        <div>
          <div className="event-card__title">{event.title}</div>
          <div className="event-card__category">{event.category}</div>
        </div>
        <StatusBadge status={event.status} />
      </div>
      <div className="event-card__date">
        <Icon name="calendar" size={12} color="var(--text-muted)" />
        <span>{event.dateRange}</span>
      </div>
      <div>
        <div className="event-card__entries-label">
          <span className="event-card__entries-text">Entries</span>
          <span className="event-card__entries-count">{event.entries} / {event.maxEntries}</span>
        </div>
        <div className="event-card__bar-track">
          <div
            className={`event-card__bar-fill${pct > 80 ? " event-card__bar-fill--full" : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UPCOMING EVENTS SECTION
// ─────────────────────────────────────────────────────────────────────────────
function UpcomingEventsSection() {
  const openCount = UPCOMING_EVENTS.filter(e => e.status === "OPEN").length;
  return (
    <Card style={{ marginBottom: 20 }}>
      <SectionHeader icon="calendar" title="Upcoming Events" badge={`${openCount} open`} action="View all" />
      <div className="upcoming-events__scroll">
        {UPCOMING_EVENTS.map(ev => <EventCard key={ev.id} event={ev} />)}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICANT ROW
// ─────────────────────────────────────────────────────────────────────────────
function ApplicantRow({ person, isLast }) {
  const [status, setStatus] = useState(null);

  return (
    <div className={`applicant-row${isLast ? " applicant-row--last" : ""}${status ? " applicant-row--actioned" : ""}`}>
      <div
        className="applicant-row__avatar"
        style={{
          background: `${person.color}22`,
          border: `1.5px solid ${person.color}55`,
          color: person.color,
        }}
      >
        {person.initials}
      </div>
      <div className="applicant-row__info">
        <div className="applicant-row__name">{person.name}</div>
        <div className="applicant-row__meta">{person.uni} · {person.field}</div>
      </div>
      <time className="applicant-row__date">{person.date}</time>
      {status === null ? (
        <div className="applicant-row__actions">
          <button className="applicant-row__approve-btn" onClick={() => setStatus("approved")}>
            <Icon name="check" size={12} color="var(--green)" /> Approve
          </button>
          <button className="applicant-row__deny-btn" onClick={() => setStatus("denied")}>
            <Icon name="x" size={12} color="currentColor" /> Deny
          </button>
        </div>
      ) : (
        <span className={`applicant-row__result applicant-row__result--${status}`}>
          {status === "approved" ? "✓ Approved" : "✗ Denied"}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PENDING APPLICATIONS
// ─────────────────────────────────────────────────────────────────────────────
function PendingApplications() {
  const [tab, setTab] = useState("students");
  const total = PENDING_STUDENTS.length + PENDING_PROFESSIONALS.length;
  const list  = tab === "students" ? PENDING_STUDENTS : PENDING_PROFESSIONALS;

  return (
    <Card>
      <SectionHeader icon="users" title="Pending Applications" badge={total} action="View all" />
      <div className="tabs">
        {[
          { key: "students",      label: "Students",              count: PENDING_STUDENTS.length },
          { key: "professionals", label: "Industry Professionals", count: PENDING_PROFESSIONALS.length },
        ].map(t => (
          <button
            key={t.key}
            className={`tabs__btn${tab === t.key ? " tabs__btn--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className={`tabs__count${tab === t.key ? " tabs__count--active" : ""}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>
      {list.map((person, i) => (
        <ApplicantRow key={person.id} person={person} isLast={i === list.length - 1} />
      ))}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY ITEM
// ─────────────────────────────────────────────────────────────────────────────
function ActivityItem({ item, isLast }) {
  const s = ACTIVITY_TYPE_STYLE[item.type] || ACTIVITY_TYPE_STYLE.event;
  return (
    <div className={`activity-item${isLast ? " activity-item--last" : ""}`}>
      <div
        className="activity-item__icon"
        style={{ background: s.bg, borderColor: `${s.color}33` }}
      >
        <Icon name={item.icon} size={13} color={s.color} />
      </div>
      <div className="activity-item__body">
        <div className="activity-item__title">{item.title}</div>
        <div className="activity-item__detail">{item.detail}</div>
      </div>
      <time className="activity-item__time">{item.time}</time>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT ACTIVITY
// ─────────────────────────────────────────────────────────────────────────────
function RecentActivity() {
  return (
    <Card>
      <SectionHeader icon="bell" title="Recent Activity" action="View all" />
      {RECENT_ACTIVITY.map((item, i) => (
        <ActivityItem key={item.id} item={item} isLast={i === RECENT_ACTIVITY.length - 1} />
      ))}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
function PlatformSummary() {
  return (
    <div>
      <p className="platform-summary__label">Platform Summary</p>
      <div className="platform-summary__grid">
        {PLATFORM_SUMMARY.map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="stat-card__icon">
              <Icon name={stat.icon} size={17} color="var(--pink)" />
            </div>
            <div>
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__name">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboardV2() {
  return (
    <div className="dash-root">
      {/* <Topbar /> */}
      <main className="dash-main">
        <div className="dash-section" style={{ animationDelay: "0ms" }}>
          <PageHeader />
        </div>
        <div className="dash-section" style={{ animationDelay: "60ms" }}>
          <QuickActions />
        </div>
        <div className="dash-section" style={{ animationDelay: "120ms" }}>
          <UpcomingEventsSection />
        </div>
        <div className="dash-two-col dash-section" style={{ animationDelay: "180ms" }}>
          <PendingApplications />
          <RecentActivity />
        </div>
        <div className="dash-section" style={{ animationDelay: "240ms" }}>
          <PlatformSummary />
        </div>
      </main>
    </div>
  );
}