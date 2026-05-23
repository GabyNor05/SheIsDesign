import "../events/EventsHero.css";

export default function EventsHero({ activeFilter, onFilterChange, stats, categories }) {
  const staticFilters = ["all", "open", "coming soon"];
  const allFilters = [
    ...staticFilters,
    ...categories.filter((c) => !staticFilters.includes(c.toLowerCase())),
  ];

  function getLabel(f) {
    if (f === "all") return "All";
    if (f === "open") return "Open Now";
    if (f === "coming soon") return "Coming Soon";
    return f;
  }

  return (
    <section className="events-hero">
      <div className="events-hero__glow-top" />
      <div className="events-hero__glow-bottom" />

      <div className="events-hero__inner">
        <p className="events-hero__eyebrow">Competitions &amp; Challenges</p>

        <h1 className="events-hero__headline">
          Compete.<br />
          <span className="events-hero__headline-accent">Create.</span><br />
          Get Seen.
        </h1>

        <p className="events-hero__subtext">
          Enter design challenges built for women in the industry. Build your
          portfolio, earn points, and get noticed by professionals.
        </p>

        <div className="events-hero__filters">
          {allFilters.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`events-hero__pill${activeFilter === f ? " events-hero__pill--active" : ""}`}
            >
              {getLabel(f)}
            </button>
          ))}
        </div>

        <div className="events-hero__stats">
          {[
            { value: stats?.totalEvents ?? "—", label: "Active events" },
            {
              value: stats?.totalEntries != null
                ? `${stats.totalEntries.toLocaleString()}+`
                : "—",
              label: "Total entries",
            },
            {
              value: stats?.totalPoints != null
                ? stats.totalPoints.toLocaleString()
                : "—",
              label: "Points awarded",
            },
          ].map((s) => (
            <div key={s.label}>
              <div className="events-hero__stat-value">{s.value}</div>
              <div className="events-hero__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}