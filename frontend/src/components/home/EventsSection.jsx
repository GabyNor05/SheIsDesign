import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiExternalLink, FiImage } from "react-icons/fi";
import "./EventsSection.css";

// ============================================================
// DUMMY DATA — replace with eventService.getUpcoming()
// ERD Table: Event
// Fields: EventID, name, start_date, end_date, description, status, image_link
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

// ERD: Event.status → badge CSS modifier class
const badgeClassMap = {
  Open: "event-badge--open",
  "Coming Soon": "event-badge--coming-soon",
  Upcoming: "event-badge--upcoming",
};

function EventsSection() {
  return (
    <section className="events-section w-full px-8 md:px-16 py-28">

      {/* Background glow */}
      <div className="events-glow" />

      <div className="events-inner max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="events-header">
          <div>
            <span className="events-eyebrow">What's On</span>
            <h2 className="events-heading">Upcoming Events</h2>
          </div>

          {/* DaisyUI: btn-ghost base for outlined link button */}
          <Link to="/events" className="btn btn-ghost events-view-all">
            View All Events
            <FiArrowRight size={14} />
          </Link>
        </div>

        {/*
          Event Cards
          TODO: replace `events` with eventService.getUpcoming()
          ERD: SELECT EventID, name, start_date, end_date, description,
                      status, image_link FROM Event
               WHERE status IN ('open','upcoming')
               ORDER BY start_date ASC LIMIT 3
        */}
        <div className="events-grid">
          {events.map((event) => (
            // DaisyUI: card as structural base
            <div key={event.id} className="event-card card">

              {/*
                Image placeholder — replace with:
                <img src={event.image_link} alt={event.title} />
                ERD: Event.image_link
              */}
              <div className="event-card-image">
                <div className="event-card-image-icon">
                  <FiImage size={20} color="rgba(196,18,98,0.5)" />
                </div>
                <span className="event-card-image-label">Event Graphic</span>
              </div>

              <div className="event-card-content">

                {/* ERD: Event.status → badge label + class */}
                {/* DaisyUI: badge base */}
                <div className={`event-badge badge ${badgeClassMap[event.badge]}`}>
                  <span>{event.badge}</span>
                </div>

                {/* ERD: Event.name */}
                <h3 className="event-card-title">{event.title}</h3>

                {/* ERD: Event.start_date + Event.end_date */}
                <div className="event-card-date">
                  <FiCalendar size={13} color="rgba(248,235,237,0.3)" />
                  <span>{event.date}</span>
                </div>

                {/* ERD: Event.description */}
                <p className="event-card-description">{event.description}</p>

                {/* TODO: update to /events/{event.id} when detail page is built */}
                {/* DaisyUI: btn base, gradient via CSS */}
                <Link to="/events" className="btn event-card-btn">
                  <FiExternalLink size={14} />
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll dots — TODO: make functional for mobile carousel */}
        <div className="events-dots">
          <div className="events-dot-active" />
          <div className="events-dot-inactive" />
          <div className="events-dot-inactive" />
        </div>
      </div>
    </section>
  );
}

export default EventsSection;