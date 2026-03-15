import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiExternalLink, FiImage } from "react-icons/fi";

// ============================================================
// DUMMY DATA — replace with API call to fetch upcoming events
// ERD Table: Event
// Service: eventService.getUpcoming() → GET /api/events?status=open&limit=3
//
// Fields mapped from ERD:
//   - id          → Event.EventID
//   - title       → Event.name
//   - date        → Event.start_date + Event.end_date (formatted as range)
//   - description → Event.description
//   - badge       → Event.status (map "open" → "Open", "upcoming" → "Upcoming" etc.)
//   - image       → Event.image_link (used in image placeholder below)
// ============================================================
const events = [
  {
    id: 1,
    title: "Brand Identity Challenge",
    date: "March 15 – March 22, 2026",
    description:
      "Design a complete brand identity for a fictional wellness startup. Logo, palette, and typography system included.",
    badge: "Open",
  },
  {
    id: 2,
    title: "UX Redesign Sprint",
    date: "April 3 – April 10, 2026",
    description:
      "Reimagine the user experience of a real-world app. Focus on accessibility, flow, and visual clarity.",
    badge: "Coming Soon",
  },
  {
    id: 3,
    title: "Poster Design Open",
    date: "April 28 – May 5, 2026",
    description:
      "Create a typographic poster on the theme of 'Resilience'. Print-ready files required.",
    badge: "Upcoming",
  },
];
// ============================================================

// Badge status mapping — ERD: Event.status
// "open"     → "Open"       (currently accepting entries)
// "upcoming" → "Coming Soon" or "Upcoming"
// "closed"   → hide or show as "Closed"
const badgeStyles = {
  Open: {
    background: "rgba(196,18,98,0.15)",
    border: "1px solid rgba(196,18,98,0.3)",
    color: "#FE4081",
  },
  "Coming Soon": {
    background: "rgba(254,127,171,0.1)",
    border: "1px solid rgba(254,127,171,0.2)",
    color: "#FE7FAB",
  },
  Upcoming: {
    background: "rgba(248,235,237,0.06)",
    border: "1px solid rgba(248,235,237,0.12)",
    color: "rgba(248,235,237,0.5)",
  },
};

function EventsSection() {
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
      {/* Background glow */}
      <div style={{
        position: "absolute", bottom: "-100px", left: "-100px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(196,18,98,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="max-w-[1440px] mx-auto" style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", marginBottom: "56px",
          flexWrap: "wrap", gap: "16px",
        }}>
          <div>
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500, fontSize: "11px",
              color: "#FE7FAB", letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              What's On
            </span>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: "clamp(36px, 4vw, 48px)",
              lineHeight: "1.15", color: "#F8EBED",
              marginTop: "8px", marginBottom: 0,
            }}>
              Upcoming Events
            </h2>
          </div>

          <Link
            to="/events"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "13px",
              color: "rgba(248,235,237,0.6)",
              border: "1px solid rgba(248,235,237,0.1)",
              padding: "10px 20px", borderRadius: "12px",
              textDecoration: "none",
            }}
          >
            View All Events
            <FiArrowRight size={14} />
          </Link>
        </div>

        {/* 
          Event Cards
          TODO: replace `events` with fetched data
          API call: eventService.getUpcoming()
          ERD: SELECT Event.EventID, Event.name, Event.start_date, Event.end_date,
                      Event.description, Event.status, Event.image_link,
                      Event.points_reward, Event.max_entry, Event.entry_count
               FROM Event
               WHERE Event.status IN ('open', 'upcoming')
               ORDER BY Event.start_date ASC
               LIMIT 3
        */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}
          className="grid-cols-1 md:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id} // ERD: Event.EventID
              style={{
                display: "flex", flexDirection: "column",
                borderRadius: "20px",
                background: "linear-gradient(145deg, rgba(196,18,98,0.07) 0%, rgba(13,6,8,0.9) 100%)",
                border: "1px solid rgba(196,18,98,0.15)",
                overflow: "hidden",
              }}
            >
              {/* 
                Event image placeholder
                Replace <div> with:
                <img src={event.image_link} alt={event.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                ERD: Event.image_link
              */}
              <div style={{
                width: "100%", height: "180px",
                background: "rgba(196,18,98,0.06)",
                borderBottom: "1px solid rgba(196,18,98,0.1)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "8px",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: "rgba(196,18,98,0.12)",
                  border: "1px solid rgba(196,18,98,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <FiImage size={20} color="rgba(196,18,98,0.5)" />
                </div>
                <span style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px", color: "rgba(248,235,237,0.2)",
                }}>
                  Event Graphic
                </span>
              </div>

              {/* Content */}
              <div style={{
                display: "flex", flexDirection: "column",
                gap: "14px", padding: "28px", flex: 1,
              }}>

                {/* ERD: Event.status — mapped to badge label + style */}
                <div style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "4px 12px", borderRadius: "100px",
                  width: "fit-content",
                  ...badgeStyles[event.badge],
                }}>
                  <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600, fontSize: "10px",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>
                    {event.badge}
                  </span>
                </div>

                {/* ERD: Event.name */}
                <h3 style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700, fontSize: "20px",
                  color: "#F8EBED", lineHeight: "1.3", margin: 0,
                }}>
                  {event.title}
                </h3>

                {/* ERD: Event.start_date + Event.end_date — format as "Mar 15 – Mar 22, 2026" */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <FiCalendar size={13} color="rgba(248,235,237,0.3)" />
                  <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500, fontSize: "12px",
                    color: "rgba(248,235,237,0.4)",
                  }}>
                    {event.date}
                  </span>
                </div>

                {/* ERD: Event.description */}
                <p style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400, fontSize: "14px",
                  color: "rgba(248,235,237,0.5)", lineHeight: "1.7",
                  margin: 0, flex: 1,
                }}>
                  {event.description}
                </p>

                {/* Links to full event detail page — ERD: Event.EventID used in route */}
                {/* TODO: update route to /events/{event.id} when event detail page is built */}
                <Link
                  to={`/events`}
                  style={{
                    display: "inline-flex", alignItems: "center",
                    justifyContent: "center", gap: "8px",
                    marginTop: "8px", padding: "14px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #C41262, #FE4081)",
                    color: "white", textDecoration: "none",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600, fontSize: "13px",
                  }}
                >
                  <FiExternalLink size={14} />
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll dots — TODO: make functional when adding mobile carousel */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "40px" }}>
          <div style={{ width: "32px", height: "6px", borderRadius: "3px", background: "#C41262" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(248,235,237,0.15)" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(248,235,237,0.15)" }} />
        </div>
      </div>
    </section>
  );
}

export default EventsSection;