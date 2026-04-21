import { FiArrowRight } from "react-icons/fi";
import { MdEvent, MdGridView, MdLeaderboard } from "react-icons/md";
import "./WhatWeDoSection.css";

// ============================================================
// STATIC CONTENT — no DB data needed
// All text and icons are fixed platform marketing copy.
// ============================================================
const features = [
  {
    number: "01",
    icon: <MdEvent size={26} />,
    title: "Compete in Design Events",
    description:
      "Participate in monthly themed design challenges with real briefs. Push your skills, get peer feedback, and earn recognition across the community.",
  },
  {
    number: "02",
    icon: <MdGridView size={26} />,
    title: "Showcase Your Portfolio",
    description:
      "Upload and display your best design work in a curated gallery. Let your projects speak — and gain visibility with other designers and industry eyes.",
  },
  {
    number: "03",
    icon: <MdLeaderboard size={26} />,
    title: "Climb the Leaderboard",
    description:
      "Earn points through event participation, community engagement, and peer votes. Track your progress and see where you stand in the community.",
  },
];

function WhatWeDoSection() {
  return (
    <section className="whatwedo-section w-full px-8 md:px-16 py-28">

      {/* Background glow */}
      <div className="whatwedo-glow" />

      <div className="whatwedo-inner max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="whatwedo-header">
          <span className="whatwedo-eyebrow">Our Platform</span>
          <h2 className="whatwedo-heading">What We Do</h2>
          <div className="whatwedo-divider" />
        </div>

        {/*
          Feature rows — static content
          TODO: if admin needs to edit these, consider adding a
          PlatformFeature table (FeatureID, order_number, icon_name, title, description)
        */}
        <div className="whatwedo-list">
          {features.map((feature, i) => (
            <div
              key={feature.number}
              className={`whatwedo-row ${i < features.length - 1 ? "whatwedo-row--bordered" : ""}`}
            >
              {/* Step number — static */}
              <div className="whatwedo-number">
                <span>{feature.number}</span>
              </div>

              {/* Icon */}
              {/* DaisyUI: no btn-square equivalent — custom box */}
              <div className="whatwedo-icon">
                <div className="whatwedo-icon-box">{feature.icon}</div>
              </div>

              {/* Text content */}
              <div className="whatwedo-content">
                <h3 className="whatwedo-feature-title">{feature.title}</h3>
                <p className="whatwedo-feature-description">{feature.description}</p>
              </div>

              {/*
                Arrow button — decorative
                TODO: link to relevant page when built:
                  01 → /events       (ERD: Event)
                  02 → /gallery      (ERD: Post)
                  03 → /leaderboard  (ERD: Submission)
              */}
              {/* DaisyUI: btn btn-circle btn-ghost as base */}
              <div className="whatwedo-arrow">
                <div className="btn btn-circle btn-ghost whatwedo-arrow-btn">
                  <FiArrowRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeDoSection;