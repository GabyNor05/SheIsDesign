import { Link } from "react-router-dom";
import { MdPersonAdd, MdBrush, MdPalette, MdAutoAwesome } from "react-icons/md";
import { FiStar } from "react-icons/fi";
import "./CTASection.css";
 
// ============================================================
// STATIC CONTENT
// CTA button links to /register — creates User + Mentee record on submit
// ERD Tables: User, Mentee
// Fields:
//   User:   email, password, role
//   Mentee: fullname, university, student_number,
//           year_of_study, field_of_study, userID (FK)
// ============================================================
 
function CTASection() {
  return (
    <section className="cta-section w-full px-8 md:px-16 py-28">
 
      {/* Background glow */}
      <div className="cta-glow" />
 
      <div className="cta-inner max-w-[1440px] mx-auto">
 
        {/* DaisyUI: card used as base container */}
        <div className="cta-card card">
 
          {/* Top glow line */}
          <div className="cta-card-glow-line" />
 
          {/* Corner decorations */}
          <div className="cta-corner cta-corner-tl">
            <div className="cta-corner-icon"><MdBrush size={16} /></div>
          </div>
          <div className="cta-corner cta-corner-tr">
            <div className="cta-corner-icon"><FiStar size={16} /></div>
          </div>
          <div className="cta-corner cta-corner-bl">
            <div className="cta-corner-icon"><MdPalette size={16} /></div>
          </div>
          <div className="cta-corner cta-corner-br">
            <div className="cta-corner-icon"><MdAutoAwesome size={16} /></div>
          </div>
 
          {/* Eyebrow label */}
          <span className="cta-label">Ready to Begin?</span>
 
          {/* Headline */}
          <h2 className="cta-heading">
            <span className="cta-heading-light">Your design story</span>
            <br />
            <span className="cta-heading-gradient">starts here.</span>
          </h2>
 
          {/* Subtext */}
          <p className="cta-subtext">
            Join a growing community of talented women designers.
            Compete, create, and be celebrated.
          </p>
 
          {/*
            CTA Button
            TODO: on click → navigate to /register
            ERD: creates User record (email, password, role='mentee')
                 + Mentee record (fullname, university, student_number,
                                  year_of_study, field_of_study, userID FK)
          */}
          {/* DaisyUI: btn as base, gradient override via cta-btn */}
          <Link to="/register" className="btn cta-btn">
            <MdPersonAdd size={20} />
            Create Your Free Account
          </Link>
 
          {/* Sub hint */}
          <span className="cta-hint">No credit card required · Free to join</span>
 
        </div>
      </div>
    </section>
  );
}
 
export default CTASection;