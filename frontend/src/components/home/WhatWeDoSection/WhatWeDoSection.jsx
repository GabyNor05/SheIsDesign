import { Link } from "react-router-dom";
import { CalendarDots, GridFour, Trophy } from "@phosphor-icons/react";
import { FiArrowRight } from "react-icons/fi";
import "./WhatWeDoSection.css";

const features = [
  {
    number: "01",
    icon: <CalendarDots size={26} weight="duotone" />,
    title: "Compete in Design Events",
    description:
      "Participate in monthly themed design challenges with real briefs. Push your skills, get peer feedback, and earn recognition across the community.",
    link: "/events",
  },
  {
    number: "02",
    icon: <GridFour size={26} weight="duotone" />,
    title: "Showcase Your Portfolio",
    description:
      "Upload and display your best design work in a curated gallery. Let your projects speak — and gain visibility with other designers and industry eyes.",
    link: "/gallery",
  },
  {
    number: "03",
    icon: <Trophy size={26} weight="duotone" />,
    title: "Climb the Leaderboard",
    description:
      "Earn points through event participation, community engagement, and peer votes. Track your progress and see where you stand in the community.",
    link: "/leaderboard",
  },
];

function WhatWeDoSection() {
  return (
    <section className="whatwedo-section w-full px-8 md:px-16 py-28">

      <div className="whatwedo-glow" />

      <div className="whatwedo-inner w-full">

        {/* Header */}
        <div className="whatwedo-header">
          <span className="whatwedo-eyebrow">Our Platform</span>
          <h2 className="whatwedo-heading">What We Do</h2>
          <div className="whatwedo-divider" />
        </div>

        {/* Feature rows */}
        <div className="whatwedo-list">
          {features.map((feature, i) => (
            <div
              key={feature.number}
              className={`whatwedo-row ${i < features.length - 1 ? "whatwedo-row--bordered" : ""}`}
            >
              <div className="whatwedo-number">
                <span>{feature.number}</span>
              </div>

              <div className="whatwedo-icon">
                <div className="whatwedo-icon-box">{feature.icon}</div>
              </div>

              <div className="whatwedo-content">
                <h3 className="whatwedo-feature-title">{feature.title}</h3>
                <p className="whatwedo-feature-description">{feature.description}</p>
              </div>

              <div className="whatwedo-arrow">
                <Link to={feature.link} className="btn btn-circle btn-ghost whatwedo-arrow-btn" aria-label={`Go to ${feature.title}`}>
                  <FiArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeDoSection;