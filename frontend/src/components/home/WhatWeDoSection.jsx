import { FiArrowRight } from "react-icons/fi";
import { MdEvent, MdGridView, MdLeaderboard } from "react-icons/md";

// ============================================================
// STATIC CONTENT — no DB data needed for this section
// The features list is fixed platform marketing copy.
// The titles, descriptions, numbers, and icons are all static
//
// The only future DB connection here would be if you wanted
// to make these features CMS-editable by an admin — in that
// case you could add a Features or Content table to the ERD.
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
// ============================================================

function WhatWeDoSection() {
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
      {/* Background glow  */}
      <div style={{
        position: "absolute", top: "50%", right: "-100px",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(196,18,98,0.08) 0%, transparent 70%)",
        pointerEvents: "none", transform: "translateY(-50%)",
      }} />

      <div className="max-w-[1440px] mx-auto" style={{ position: "relative", zIndex: 1 }}>

        {/* Header — static copy */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500, fontSize: "11px",
            color: "#FE7FAB", letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            Our Platform
          </span>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700, fontSize: "clamp(36px, 4vw, 48px)",
            lineHeight: "1.15", color: "#F8EBED",
            marginTop: "12px", marginBottom: "20px",
          }}>
            What We Do
          </h2>
          {/* Decorative divider  */}
          <div style={{
            width: "48px", height: "3px", margin: "0 auto",
            background: "linear-gradient(90deg, #C41262, #FE4081)",
            borderRadius: "2px",
          }} />
        </div>

        {/* 
          Feature Blocks — static content, no DB data needed
          All titles, descriptions and icons are hardcoded marketing copy.
          If admin needs to edit these in future, consider adding a
          PlatformFeature table to the ERD with fields:
            - FeatureID, order_number, icon_name, title, description
        */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {features.map((feature, i) => (
            <div
              key={feature.number}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "48px",
                paddingTop: "48px",
                paddingBottom: "48px",
                borderBottom: i < features.length - 1
                  ? "1px solid rgba(248,235,237,0.06)"
                  : "none",
              }}
            >
              {/* Step number — static ("01", "02", "03"), no DB data */}
              <div style={{ flexShrink: 0, width: "100px" }}>
                <span style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800, fontSize: "72px",
                  lineHeight: 1, letterSpacing: "-2px",
                  background: "linear-gradient(135deg, rgba(196,18,98,0.3), rgba(196,18,98,0.05))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {feature.number}
                </span>
              </div>

              {/* Icon — static, mapped from feature.icon above, no DB data */}
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: "56px", height: "56px", borderRadius: "14px",
                  background: "rgba(196,18,98,0.12)",
                  border: "1px solid rgba(196,18,98,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#C41262",
                }}>
                  {feature.icon}
                </div>
              </div>

              {/* Content  */}
              <div style={{
                display: "flex", flexDirection: "column",
                gap: "10px", maxWidth: "560px",
              }}>
                <h3 style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700, fontSize: "22px",
                  color: "#F8EBED", lineHeight: "1.3", margin: 0,
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400, fontSize: "15px",
                  color: "rgba(248,235,237,0.5)", lineHeight: "1.8", margin: 0,
                }}>
                  {feature.description}
                </p>
              </div>

              {/* 
                Arrow button 
                TODO: link each feature to its relevant page when built
                  01 → /events   (ERD: Event table)
                  02 → /gallery  (ERD: Post table)
                  03 → /leaderboard (ERD: Submission table)
              */}
              <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  border: "1px solid rgba(196,18,98,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#C41262",
                }}>
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