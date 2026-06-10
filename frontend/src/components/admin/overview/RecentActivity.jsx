import { useState, useEffect } from "react";
import { User, CalendarDots, Paperclip, HandHeart, ClockClockwise } from "@phosphor-icons/react";
import SectionHeader from "../SectionHeader";
import Card from "./Card";
import { T } from "../theme";
import { recentActivityService } from "../../../services/recentActivityService";

const ACTIVITY_ICONS = {
  participant: <User size={14} />,
  event: <CalendarDots size={14} />,
  submission: <Paperclip size={14} />,
  donation: <HandHeart size={14} />,
};

const TYPE_MAP = {
  NewAccount: "participant",
  Event: "event",
  Post: "submission",
  Donation: "donation",
  JudgeMarkScheme: "submission",
};

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function ActivityRow({ item, isLast }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "13px 0",
      borderBottom: isLast ? "none" : `1px solid ${T.border}`,
    }}>
      <div
        aria-hidden="true"
        style={{
          width: 36, height: 36, borderRadius: "50%", background: T.surfaceHi,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, flexShrink: 0,
        }}
      >
        {ACTIVITY_ICONS[item.type] ?? <Paperclip size={14} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 500, color: T.textPrimary }}>
          {item.title}
        </div>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12.5, color: T.textSecond, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.detail}
        </div>
      </div>
      <time style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: T.textMuted, flexShrink: 0 }}>
        {item.time}
      </time>
    </div>
  );
}

function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    recentActivityService.getRecentActivity()
      .then((data) => {
        const mapped = data.map((item) => ({
          id: `${item.activityType}-${item.id}`,
          type: TYPE_MAP[item.activityType] ?? "submission",
          title: item.title,
          detail: item.actorName ?? "",
          time: timeAgo(item.timestamp),
        }));
        setActivities(mapped);
      })
      .catch(() => setActivities([]));
  }, []);

  return (
    <Card>
      <SectionHeader
        icon={<ClockClockwise size={16} />}
        title="Recent Activities"
        action="View all"
      />
      {activities.length === 0 ? (
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, color: T.textMuted, padding: "16px 0" }}>
          No recent activity.
        </div>
      ) : (
        activities.map((item, i) => (
          <ActivityRow key={item.id} item={item} isLast={i === activities.length - 1} />
        ))
      )}
    </Card>
  );
}

export default RecentActivity;
