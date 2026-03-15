import { Link } from "react-router-dom";
import { MdPersonAdd, MdBrush, MdPalette, MdAutoAwesome } from "react-icons/md";
import { FiStar } from "react-icons/fi";

// ============================================================
// STATIC CONTENT 
// This is a pure marketing/conversion CTA section.
//
// The only DB connection is the CTA button:
//   "Create Your Free Account" → links to /register
//   ERD: creates User record + Mentee record on form submit
//   Tables: User, Mentee
//   Fields:
//     User:   email, password, role
//     Mentee: fullname, university, student_number,
//             year_of_study, field_of_study, userID (FK)
// ============================================================

function CTASection() {
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
        width: "700px", height: "500px",
        background: "radial-gradient(circle, rgba(196,18,98,0.18) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="max-w-[1440px] mx-auto" style={{ position: "relative", zIndex: 1 }}>

        {/* Full-width CTA block */}
        <div style={{
          width: "100%",
          borderRadius: "28px",
          background: "linear-gradient(145deg, rgba(196,18,98,0.1) 0%, rgba(13,6,8,0.98) 60%, rgba(254,64,129,0.06) 100%)",
          border: "1px solid rgba(196,18,98,0.2)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "32px",
          padding: "96px 64px",
          position: "relative", overflow: "hidden",
        }}>

          {/* Top glow line*/}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(196,18,98,0.6), transparent)",
          }} />

          {/* Corner decorations  */}
          <div style={{ position: "absolute", top: "28px", left: "28px", opacity: 0.3 }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              border: "1px solid rgba(196,18,98,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#C41262",
            }}>
              <MdBrush size={16} />
            </div>
          </div>
          <div style={{ position: "absolute", top: "28px", right: "28px", opacity: 0.3 }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              border: "1px solid rgba(196,18,98,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#C41262",
            }}>
              <FiStar size={16} />
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "28px", left: "28px", opacity: 0.3 }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              border: "1px solid rgba(196,18,98,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#C41262",
            }}>
              <MdPalette size={16} />
            </div>
          </div>
          <div style={{ position: "absolute", bottom: "28px", right: "28px", opacity: 0.3 }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "8px",
              border: "1px solid rgba(196,18,98,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#C41262",
            }}>
              <MdAutoAwesome size={16} />
            </div>
          </div>

          {/* Label */}
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500, fontSize: "11px",
            color: "#FE7FAB", letterSpacing: "0.15em",
            textTransform: "uppercase",
            position: "relative", zIndex: 1,
          }}>
            Ready to Begin?
          </span>

          {/* Headline  */}
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(40px, 5vw, 64px)",
            lineHeight: "1.1",
            textAlign: "center",
            letterSpacing: "-1.5px",
            margin: 0,
            position: "relative", zIndex: 1,
            maxWidth: "700px",
          }}>
            <span style={{ color: "#F8EBED" }}>Your design story</span>
            <br />
            <span style={{
              background: "linear-gradient(135deg, #C41262 0%, #FE4081 50%, #FE7FAB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              starts here.
            </span>
          </h2>

          {/* Subtext */}
          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400, fontSize: "16px",
            color: "rgba(248,235,237,0.5)", lineHeight: "1.7",
            textAlign: "center", maxWidth: "480px",
            margin: 0, position: "relative", zIndex: 1,
          }}>
            Join a growing community of talented women designers.
            Compete, create, and be celebrated.
          </p>

          {/* 
            CTA Button
            TODO: on click → navigate to /register
            ERD: form submit creates:
              1. User record:   email, password, role = 'mentee'
              2. Mentee record: fullname, university, student_number,
                                year_of_study, field_of_study, userID (FK → User.UserID)
          */}
          <Link
            to="/register"
            style={{
              display: "inline-flex", alignItems: "center", gap: "12px",
              padding: "18px 40px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #C41262, #FE4081)",
              color: "white", textDecoration: "none",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: "15px",
              marginTop: "8px",
              position: "relative", zIndex: 1,
            }}
          >
            <MdPersonAdd size={20} />
            Create Your Free Account
          </Link>

          {/* Sub hint  */}
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400, fontSize: "12px",
            color: "rgba(248,235,237,0.25)",
            position: "relative", zIndex: 1,
          }}>
            No credit card required · Free to join
          </span>
        </div>
      </div>
    </section>
  );
}

export default CTASection;