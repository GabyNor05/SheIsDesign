import "../events/CommunityImpact.css";

export default function CommunityImpact({ events = [] }) {
  const totalEntries = events.reduce((sum, e) => sum + (e.entry_count ?? 0), 0);
  const totalEvents = events.length;
  const totalPoints = events.reduce((sum, e) => sum + (e.points_reward ?? 0), 0);
  const openEvents = events.filter((e) => e.status?.toLowerCase() === "open").length;

  const stats = [
    { value: totalEntries > 0 ? `${totalEntries.toLocaleString()}+` : "—", label: "Total submissions", sub: "Across all events" },
    { value: totalEvents > 0 ? totalEvents : "—", label: "Events hosted", sub: "Since launch" },
    { value: openEvents > 0 ? openEvents : "—", label: "Open right now", sub: "Enter before they close" },
    { value: totalPoints > 0 ? totalPoints.toLocaleString() : "—", label: "Points available", sub: "Across active events" },
  ];

  return (
    <section className="community-impact">
      <div className="community-impact__inner">
        <div className="community-impact__label">
          <div className="community-impact__label-line" />
          <span className="community-impact__label-text">Community impact</span>
        </div>

        <h2 className="community-impact__heading">She Is Design by the numbers</h2>

        <div className="community-impact__grid">
          {stats.map((s) => (
            <div key={s.label} className="community-impact__card">
              <div className="community-impact__value">{s.value}</div>
              <div className="community-impact__stat-label">{s.label}</div>
              <div className="community-impact__stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}