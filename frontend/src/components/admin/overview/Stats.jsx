import { CalendarDots, UsersThree, HandHeart, Paperclip } from "@phosphor-icons/react";

import { T } from "../theme";

const STATS = [
  { id: 1, value: "1,247", label: "Total Participants", sub: "↑ 12% this month",  icon: <UsersThree size={24} /> },
  { id: 2, value: "5",     label: "Upcoming Events",    sub: "Next: 14 Sep 2025", icon: <CalendarDots size={24} /> },
  { id: 3, value: "3,840", label: "Total Submissions",  sub: "↑ 8% this week",    icon: <Paperclip size={24} /> },
  { id: 4, value: "R 48 K", label: "Total Donations",    sub: "↑ 14% all-time",    icon: <HandHeart size={24} /> },
];

function StatCard({ stat }) {
  return (
    <article style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
      padding: "22px 24px", flex: "1 1 160px",
      transition: "border-color 0.2s",
      opacity: 0.95,
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = T.pink}
    onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
    >
      <div className="text-2xl mb-2 bg-slate-400/20 border-slate-600 border  w-fit p-2 rounded" aria-hidden="true">{stat.icon}</div>
      <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 30, color: T.textPrimary, marginBottom: 4 }}>
        {stat.value}
      </div>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13.5, color: T.textSecond, marginBottom: 6 }}>
        {stat.label}
      </div>
      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: T.pink, fontWeight: 500 }}>
        {stat.sub}
      </div>
    </article>
  );
}

function Stats() {
  return (
    <section style={{ display: "flex", gap: 20, flexWrap: "wrap" }} aria-label="Key statistics overview">
      {STATS.map(stat => <StatCard key={stat.id} stat={stat} />)}
    </section>
  );
}

export default Stats;