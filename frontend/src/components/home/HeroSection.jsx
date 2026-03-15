import { Link } from "react-router-dom";
import { FiPlay, FiArrowRight } from "react-icons/fi";
import { HiTrophy, HiUser } from "react-icons/hi2";
import { MdRocketLaunch } from "react-icons/md";

const stats = [
  { number: "1,200+", label: "Designers" },
  { number: "48", label: "Events Hosted" },
  { number: "320+", label: "Projects Shared" },
];

function HeroSection() {
  return (
    <section
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#0D0608",
        position: "relative",
        overflow: "hidden",
      }}
      className="w-full px-8 md:px-16 pt-24 pb-28"
    >
      {/* Gradient mesh background */}
      <div style={{
        position: "absolute", top: "-100px", left: "-100px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(196,18,98,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "50px", right: "-50px",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(254,64,129,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-50px", left: "30%",
        width: "300px", height: "300px",
        background: "radial-gradient(circle, rgba(254,127,171,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 items-center" style={{ position: "relative", zIndex: 1 }}>

        {/* Left Column */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-8 pr-0 md:pr-8">

          {/* Eyebrow pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(196,18,98,0.15)",
            border: "1px solid rgba(196,18,98,0.3)",
            borderRadius: "100px", padding: "6px 16px", width: "fit-content",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C41262" }} />
            <span style={{ fontSize: "11px", fontWeight: 500, color: "#FE7FAB", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              A Community for Designers
            </span>
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(42px, 5vw, 58px)",
            lineHeight: "1.06",
            letterSpacing: "-2px",
            color: "#F8EBED",
            margin: 0,
          }}>
            Where Creativity<br />
            Meets<br />
            <span style={{
              background: "linear-gradient(135deg, #C41262 0%, #FE4081 50%, #FE7FAB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Mentorship.
            </span>
          </h1>

          {/* Body */}
          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400, fontSize: "15px", lineHeight: "1.8",
            color: "rgba(248,235,237,0.6)", maxWidth: "420px", margin: 0,
          }}>
            SheisDesign is a platform built to celebrate, challenge, and elevate
            female students in design. Join events, showcase your work, and climb
            the leaderboard.
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <Link
              to="/register"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 28px", borderRadius: "12px",
                background: "linear-gradient(135deg, #C41262, #FE4081)",
                color: "white", textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "14px",
              }}
            >
              <MdRocketLaunch size={16} />
              Get Started
            </Link>
            <Link
              to="/events"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 28px", borderRadius: "12px",
                background: "transparent",
                border: "1px solid rgba(248,235,237,0.15)",
                color: "rgba(248,235,237,0.8)", textDecoration: "none",
                fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "14px",
              }}
            >
              <FiPlay size={14} />
              See How It Works
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "32px", paddingTop: "24px",
            borderTop: "1px solid rgba(248,235,237,0.08)", flexWrap: "wrap",
          }}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "24px", fontWeight: 700, color: "#C41262" }}>
                  {stat.number}
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "rgba(248,235,237,0.4)", marginTop: "2px" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-4">

          {/* Main image block */}
          <div style={{
            height: "380px", borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(196,18,98,0.12) 0%, rgba(13,6,8,0.8) 100%)",
            border: "1px solid rgba(196,18,98,0.2)",
            position: "relative", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Top glow line */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(196,18,98,0.5), transparent)",
            }} />

            {/* Top badge */}
            <div style={{
              position: "absolute", top: "16px", right: "16px",
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(13,6,8,0.8)",
              border: "1px solid rgba(196,18,98,0.3)",
              borderRadius: "10px", padding: "8px 14px",
            }}>
              <HiTrophy size={14} color="#FE7FAB" />
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: 600, color: "#FE7FAB" }}>
                Top Designer Badge
              </span>
            </div>

            {/* Centre placeholder */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "rgba(196,18,98,0.2)",
                border: "1px solid rgba(196,18,98,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FiArrowRight size={24} color="rgba(248,235,237,0.3)" />
              </div>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 500, color: "rgba(248,235,237,0.3)" }}>
                Hero Illustration / Photography
              </span>
            </div>

            {/* Bottom floating card */}
            <div style={{
              position: "absolute", bottom: "16px", left: "16px",
              display: "flex", alignItems: "center", gap: "10px",
              background: "rgba(13,6,8,0.85)",
              border: "1px solid rgba(248,235,237,0.08)",
              borderRadius: "12px", padding: "10px 14px",
            }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "linear-gradient(135deg, #C41262, #FE4081)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <HiUser size={16} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: 600, color: "#F8EBED" }}>
                  Designer Name
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "#FE7FAB" }}>
                  #1 Leaderboard
                </div>
              </div>
            </div>
          </div>

          {/* Two small blocks */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {["Event Graphic", "Portfolio Work"].map((label) => (
              <div key={label} style={{
                height: "110px", borderRadius: "14px",
                background: "linear-gradient(135deg, rgba(196,18,98,0.08), rgba(13,6,8,0.6))",
                border: "1px solid rgba(196,18,98,0.15)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "8px",
              }}>
                <FiArrowRight size={20} color="rgba(248,235,237,0.2)" />
                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "rgba(248,235,237,0.3)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;