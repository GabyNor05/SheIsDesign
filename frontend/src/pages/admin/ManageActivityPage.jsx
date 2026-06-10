import { useState, useEffect } from "react";
import "./template/AdminDashboardV2.css";
import { recentActivityService } from "../../services/recentActivityService";

const ACTIVITY_TYPE_MAP = {
  NewAccount:      { type: "participant", icon: "user"     },
  Event:           { type: "event",       icon: "calendar" },
  Post:            { type: "submission",  icon: "file"     },
  Donation:        { type: "donation",    icon: "heart"    },
  JudgeMarkScheme: { type: "submission",  icon: "check"    },
};

const ACTIVITY_TYPE_STYLE = {
  participant: { bg: "var(--pink-dim)", color: "var(--pink-hot)" },
  event:       { bg: "var(--blue-bg)", color: "var(--blue)"     },
  submission:  { bg: "#161A0E",        color: "var(--amber)"    },
  donation:    { bg: "#200B14",        color: "#f472b6"         },
};

const ICONS = {
  user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  file:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  heart:    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  check:    <polyline points="20 6 9 17 4 12"/>,
};

function SvgIcon({ name, size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name] || null}
    </svg>
  );
}

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function ActivityRow({ item, isLast }) {
  const s = ACTIVITY_TYPE_STYLE[item.type] || ACTIVITY_TYPE_STYLE.event;
  return (
    <div className={`activity-item${isLast ? " activity-item--last" : ""}`}>
      <div className="activity-item__icon" style={{ background: s.bg, borderColor: s.color }}>
        <SvgIcon name={item.icon} size={13} color={s.color} />
      </div>
      <div className="activity-item__body">
        <div className="activity-item__title">{item.title}</div>
        <div className="activity-item__detail">{item.detail}</div>
      </div>
      <time className="activity-item__time">{item.time}</time>
    </div>
  );
}

export default function ManageActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recentActivityService.getRecentActivity(50)
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
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-root">
      <main className="dash-main">
        <div className="dash-section page-header" style={{ animationDelay: "0ms" }}>
          <div>
            <p className="page-header__eyebrow">
              <span className="page-header__eyebrow-line" />
              Admin Dashboard
            </p>
            <h1 className="page-header__title">Activity Feed</h1>
            <p className="page-header__sub">All recent actions across the platform.</p>
          </div>
        </div>

        <div className="dash-section card" style={{ animationDelay: "60ms" }}>
          {loading ? (
            <p className="activity-empty">Loading…</p>
          ) : activities.length === 0 ? (
            <p className="activity-empty">No recent activity.</p>
          ) : (
            activities.map((item, i) => (
              <ActivityRow key={item.id} item={item} isLast={i === activities.length - 1} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
