import { HiUsers } from "react-icons/hi2";
import { MdEvent, MdCollections } from "react-icons/md";
import "./ImpactSection.css";

// ============================================================
// DUMMY DATA — replace with studentService.getStats()
// ERD Tables: Mentee, Event, Post
// Queries:
//   "1,200+" → SELECT COUNT(*) FROM Mentee
//   "48"     → SELECT COUNT(*) FROM Event
//   "320+"   → SELECT COUNT(*) FROM Post WHERE status = 'published'
// ============================================================
const stats = [
  { number: "1,200+", label: "Active Designers",     icon: <HiUsers size={22} /> },
  { number: "48",     label: "Events Hosted",        icon: <MdEvent size={22} /> },
  { number: "320+",   label: "Projects Submitted",   icon: <MdCollections size={22} /> },
];

function ImpactSection() {
  return (
    <section className="impact-section w-full px-8 md:px-16 py-28">

      {/* Background glows */}
      <div className="impact-glow-1" />
      <div className="impact-glow-2" />

      <div className="impact-inner max-w-[1440px] mx-auto flex flex-col items-center gap-16">

        {/* Statement heading */}
        <div className="impact-heading-block">
          <span className="impact-eyebrow">Our Impact</span>
          <h2 className="impact-heading">
            A community built to
            <br />
            <span className="impact-heading-gradient">amplify women in design.</span>
          </h2>
        </div>

        {/* Decorative divider */}
        <div className="impact-divider" />

        {/*
          Stats Row
          TODO: replace hardcoded numbers with studentService.getStats()
          ERD:
            Mentee COUNT → SELECT COUNT(*) FROM Mentee
            Event COUNT  → SELECT COUNT(*) FROM Event WHERE status = 'closed'
            Post COUNT   → SELECT COUNT(*) FROM Post WHERE status = 'published'
        */}
        <div className="impact-stats-grid">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`impact-stat ${i < stats.length - 1 ? "impact-stat--bordered" : ""}`}
            >
              {/* DaisyUI: no native equivalent — custom styled icon box */}
              <div className="impact-stat-icon">{stat.icon}</div>

              {/* ERD: aggregate count — DUMMY DATA */}
              <span className="impact-stat-number">{stat.number}</span>

              {/* Static label */}
              <span className="impact-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactSection;