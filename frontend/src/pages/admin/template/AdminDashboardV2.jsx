import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { recentActivityService } from "../../../services/recentActivityService";
import QuickActions from "../../../components/admin/overview/QuickActions";
import PendingApplications from "../../../components/admin/overview/PendingApplications";
import UpcomingEvents from "../../../components/admin/overview/UpcomingEvents";
import "./AdminDashboardV2.css";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TODAY = new Date().toLocaleDateString("en-ZA", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const PAGE_TITLE  = "Overview";
const PAGE_SUB    = "Manage events, participants, and competitions.";


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

const ACTIVITY_TYPE_MAP = {
  NewAccount:      { type: "participant", icon: "user"     },
  Event:           { type: "event",       icon: "calendar" },
  Post:            { type: "submission",  icon: "file"     },
  Donation:        { type: "donation",    icon: "heart"    },
  JudgeMarkScheme: { type: "submission",  icon: "check"    },
};

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}


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
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    recentActivityService.getRecentActivity()
      .then((data) => {
        setActivities(data.map((item) => {
          const { type, icon } = ACTIVITY_TYPE_MAP[item.activityType] ?? { type: "submission", icon: "file" };
          return {
            id: `${item.activityType}-${item.id}`,
            type,
            icon,
            title: item.title,
            detail: item.actorName ?? "",
            time: timeAgo(item.timestamp),
          };
        }));
      })
      .catch(() => setActivities([]));
  }, []);

  return (
    <Card>
      <SectionHeader icon="bell" title="Recent Activity" action="View all" onAction={() => navigate("/admin/activity")} />
      {activities.length === 0 ? (
        <p className="activity-empty">No recent activity.</p>
      ) : (
        activities.map((item, i) => (
          <ActivityItem key={item.id} item={item} isLast={i === activities.length - 1} />
        ))
      )}
    </Card>
  );
}

export default function AdminDashboardV2() {
  return (
    <div className="dash-root">
      <main className="dash-main">
        <div className="dash-section" style={{ animationDelay: "0ms" }}>
          <PageHeader />
        </div>
        <div className="" style={{ animationDelay: "60ms" }}>
          <QuickActions />
        </div>
        <div className="dash-section" style={{ animationDelay: "120ms" }}>
          <UpcomingEvents />
        </div>
        <div className="dash-two-col dash-section" style={{ animationDelay: "180ms" }}>
          <PendingApplications />
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}