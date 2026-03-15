import { HiUsers } from "react-icons/hi2";
import { MdEvent, MdCollections } from "react-icons/md";

// ============================================================
// DUMMY DATA — replace with API aggregate calls when DB is connected
// ERD Tables: Mentee, Event, Post
// Service: studentService.getStats() → GET /api/stats
//
// Fields mapped from ERD:
//   - "1,200+"  Active Designers → SELECT COUNT(*) FROM Mentee
//               ERD: Mentee table
//
//   - "48"      Events Hosted    → SELECT COUNT(*) FROM Event
//               ERD: Event table
//               (optionally filter: WHERE Event.status = 'closed'
//               if "hosted" means completed events only)
//
//   - "320+"    Projects Submitted → SELECT COUNT(*) FROM Post
//               ERD: Post table
//               (optionally filter: WHERE Post.status = 'published'
//               to exclude drafts)
// ============================================================
const stats = [
  {
    number: "1,200+",
    label: "Active Designers",
    icon: <HiUsers size={22} />,
  },
  {
    number: "48",
    label: "Events Hosted",
    icon: <MdEvent size={22} />,
  },
  {
    number: "320+",
    label: "Projects Submitted",
    icon: <MdCollections size={22} />,
  },
];
// ============================================================

function ImpactSection() {
  return (
    <section
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#0D0608",
        borderTop: "1px solid rgba(248,235,237,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
      className="w-full px-8 md:px-16 py-28"
    >
      {/* Background glows */}
      <div style={{
        position: "absolute", top: "-100px", left: "50%",
        transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(circle, rgba(196,18,98,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-100px", left: "-100px",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(254,64,129,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div
        className="max-w-[1440px] mx-auto flex flex-col items-center"
        style={{ gap: "64px", position: "relative", zIndex: 1 }}
      >

        {/* 
          Statement heading 
          "amplify women in design" is brand copy
        */}
        <div style={{ textAlign: "center", maxWidth: "760px" }}>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500, fontSize: "11px",
            color: "#FE7FAB", letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            Our Impact
          </span>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: "1.1",
            color: "#F8EBED",
            letterSpacing: "-1px",
            marginTop: "16px", marginBottom: 0,
          }}>
            A community built to
            <br />
            <span style={{
              background: "linear-gradient(135deg, #C41262 0%, #FE4081 50%, #FE7FAB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              amplify women in design.
            </span>
          </h2>
        </div>

        {/* Decorative divider */}
        <div style={{
          width: "64px", height: "2px",
          background: "linear-gradient(90deg, #C41262, #FE4081)",
          borderRadius: "2px",
        }} />

        {/* 
          Stats Row
          TODO: replace hardcoded numbers with live API aggregate calls
          API call: studentService.getStats() → GET /api/stats
          ERD queries:
            - Mentee COUNT  → SELECT COUNT(*) FROM Mentee
            - Event COUNT   → SELECT COUNT(*) FROM Event WHERE status = 'closed'
            - Post COUNT    → SELECT COUNT(*) FROM Post WHERE status = 'published'
        */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          width: "100%",
          maxWidth: "860px",
        }}>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "16px",
                padding: "32px 0",
                borderRight: i < stats.length - 1
                  ? "1px solid rgba(248,235,237,0.06)"
                  : "none",
              }}
            >
              {/* Icon  */}
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: "rgba(196,18,98,0.12)",
                border: "1px solid rgba(196,18,98,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#C41262",
              }}>
                {stat.icon}
              </div>

              {/* 
                Stat number — DUMMY DATA
                TODO: replace with live count from API
                ERD references per stat:
                  "1,200+" → SELECT COUNT(*) FROM Mentee
                  "48"     → SELECT COUNT(*) FROM Event
                  "320+"   → SELECT COUNT(*) FROM Post
              */}
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(40px, 4vw, 52px)",
                color: "#F8EBED",
                lineHeight: 1,
                letterSpacing: "-1px",
              }}>
                {stat.number}
              </span>

              {/* Stat label — static copy */}
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400, fontSize: "13px",
                color: "rgba(248,235,237,0.4)",
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ImpactSection;