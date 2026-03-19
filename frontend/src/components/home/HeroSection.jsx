import { Link } from "react-router-dom";
import { FiPlay, FiArrowRight } from "react-icons/fi";
import { HiTrophy, HiUser } from "react-icons/hi2";
import { MdRocketLaunch } from "react-icons/md";
import "./HeroSection.css";
 
// ============================================================
// DUMMY DATA — replace with API calls when DB is connected
//
// Stats bar — derived from aggregate DB queries:
//   - "1,200+"  → SELECT COUNT(*) FROM Mentee
//   - "48"      → SELECT COUNT(*) FROM Event
//   - "320+"    → SELECT COUNT(*) FROM Post
// ============================================================
const stats = [
  { number: "1,200+", label: "Designers" },
  { number: "48", label: "Events Hosted" },
  { number: "320+", label: "Projects Shared" },
];
 
function HeroSection() {
  return (
    <section className="hero-section w-full px-8 md:px-16 pt-24 pb-28">
 
      {/* Gradient mesh background */}
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />
      <div className="hero-glow-3" />
 
      <div className="hero-inner max-w-[1440px] mx-auto grid grid-cols-12 gap-8 items-center">
 
        {/* Left Column */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-8 pr-0 md:pr-8">
 
          {/* Eyebrow pill — DaisyUI badge base, extended with custom class */}
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" />
            <span className="hero-eyebrow-text">A Community for Designers</span>
          </div>
 
          {/* H1 */}
          <h1 className="hero-heading">
            Where Creativity<br />
            Meets<br />
            <span className="hero-heading-gradient">Mentorship.</span>
          </h1>
 
          {/* Body */}
          <p className="hero-body">
            SheisDesign is a platform built to celebrate, challenge, and elevate
            female students in design. Join events, showcase your work, and climb
            the leaderboard.
          </p>
 
          {/* CTA Buttons */}
          {/* DaisyUI: btn class used as base, extended with gradient via CSS */}
          <div className="flex gap-3 items-center flex-wrap">
            {/* Route: /register */}
            <Link to="/register" className="btn hero-btn-primary">
              <MdRocketLaunch size={16} />
              Get Started
            </Link>
            {/* Route: /events */}
            <Link to="/events" className="btn hero-btn-secondary">
              <FiPlay size={14} />
              See How It Works
            </Link>
          </div>
 
          {/*
            Stats bar
            TODO: replace with API aggregate calls
            studentService.getCount(), eventService.getCount(), galleryService.getCount()
          */}
          <div className="hero-stats-bar">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="hero-stat-number">{stat.number}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Right Column */}
        <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
 
          {/*
            Main image block — replace <div> with real hero image/illustration
            ERD: no image field on Mentee yet — suggest adding profile_image_url
          */}
          <div className="hero-image-main">
            <div className="hero-image-glow-line" />
 
            {/*
              Top right badge
              TODO: replace with real top designer data
              ERD: SELECT Mentee.fullname, Submission.rank FROM Submission
                   JOIN Mentee ON Submission.menteeID = Mentee.MenteeID
                   WHERE Submission.rank = 1 LIMIT 1
            */}
            {/* DaisyUI: badge used for status-style labels */}
            <div className="hero-badge-top">
              <HiTrophy size={14} color="#FE7FAB" />
              <span>Top Designer Badge</span>
            </div>
 
            {/* Centre placeholder — replace with <img> */}
            <div className="hero-image-placeholder-inner">
              <div className="hero-image-icon-wrap">
                <FiArrowRight size={24} color="rgba(248,235,237,0.3)" />
              </div>
              <span className="hero-image-placeholder-label">
                Hero Illustration / Photography
              </span>
            </div>
 
            {/*
              Bottom floating designer card
              TODO: replace with real #1 leaderboard student
              ERD: SELECT Mentee.fullname, Submission.rank, Submission.points
                   FROM Submission JOIN Mentee ON Submission.menteeID = Mentee.MenteeID
                   ORDER BY Submission.points DESC LIMIT 1
            */}
            {/* DaisyUI: card pattern used here as floating chip */}
            <div className="hero-designer-card">
              <div className="hero-designer-avatar">
                {/* ERD: Mentee.profile_image_url — not yet in schema */}
                <HiUser size={16} color="white" />
              </div>
              <div>
                {/* ERD: Mentee.fullname */}
                <div className="hero-designer-name">Designer Name</div>
                {/* ERD: Submission.rank */}
                <div className="hero-designer-rank">#1 Leaderboard</div>
              </div>
            </div>
          </div>
 
          {/*
            Two small image blocks
            TODO: replace with real featured Post images
            ERD: SELECT Post.image_file_link, Post.title, Post.category
                 FROM Post WHERE Post.status = 'featured'
                 ORDER BY Post.like_count DESC LIMIT 2
          */}
          <div className="hero-image-grid">
            {["Event Graphic", "Portfolio Work"].map((label) => (
              <div key={label} className="hero-image-small">
                <FiArrowRight size={20} color="rgba(248,235,237,0.2)" />
                {/* ERD: Post.category */}
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
 
export default HeroSection;