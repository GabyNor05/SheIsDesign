import { CalendarDots, UsersThree, HandHeart, Paperclip } from "@phosphor-icons/react";

const T = {
  // Backgrounds
  bg:        "#0D0D0D",   // page background
  surface:   "#1A1A1A",   // card / sidebar background
  surfaceHi: "#242424",   // elevated card, hover surface
  border:    "#2E2E2E",   // subtle dividers
  // Brand
  pink:      "#FF2D78",   // primary CTA / active state
  pinkDim:   "#3D0F22",   // pink tint background (accessible)
  // Text — all WCAG AA on #1A1A1A
  textPrimary:  "#F0F0F0",  // 15.3:1 on surface
  textSecond:   "#A0A0A0",  // 5.9:1 on surface — AA large
  textMuted:    "#6B6B6B",  // decorative only
  // Status
  activeGreen:  "#22C55E",
  activeBg:     "#052512",
  upBlue:       "#60A5FA",
  upBg:         "#0A1628",
  draftGray:    "#A0A0A0",
  draftBg:      "#222222",
  closedRed:    "#F87171",
  closedBg:     "#200B0B",
};

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
      <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 30, color: T.textPrimary, marginBottom: 4 }}>
        {stat.value}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: T.textSecond, marginBottom: 6 }}>
        {stat.label}
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.pink, fontWeight: 500 }}>
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