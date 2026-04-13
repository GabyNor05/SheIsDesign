import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import { HiTrophy, HiStar, HiUser } from "react-icons/hi2";
import { MdMilitaryTech, MdGrade, MdLeaderboard } from "react-icons/md";
import "./LeaderboardSection.css";

// ============================================================
// DUMMY DATA — replace with studentService.getTopLeaders()
// ERD Tables: Submission, Mentee, User
// Query:
//   SELECT Submission.rank, Submission.points, Mentee.fullname, User.email
//   FROM Submission
//   JOIN Mentee ON Submission.menteeID = Mentee.MenteeID
//   JOIN User ON Mentee.userID = User.UserID
//   ORDER BY Submission.points DESC LIMIT 3
// NOTE: no username field in current ERD — suggest adding to User or Mentee
// ============================================================
const leaders = [
  {
    rank: 1,
    name: "Designer Name A",
    handle: "@username_a",
    points: "4,820 pts",
    medal: <HiTrophy size={18} />,
    medalColor: "#C41262",
    medalBg: "rgba(196,18,98,0.15)",
    medalBorder: "rgba(196,18,98,0.3)",
  },
  {
    rank: 2,
    name: "Designer Name B",
    handle: "@username_b",
    points: "3,910 pts",
    medal: <MdMilitaryTech size={20} />,
    medalColor: "#FE4081",
    medalBg: "rgba(254,64,129,0.1)",
    medalBorder: "rgba(254,64,129,0.2)",
  },
  {
    rank: 3,
    name: "Designer Name C",
    handle: "@username_c",
    points: "3,340 pts",
    medal: <MdGrade size={18} />,
    medalColor: "#FE7FAB",
    medalBg: "rgba(254,127,171,0.1)",
    medalBorder: "rgba(254,127,171,0.15)",
  },
];

function LeaderboardSection() {
  return (
    <section className="leaderboard-section w-full px-8 md:px-16 py-28">

      {/* Background glow */}
      <div className="leaderboard-glow" />

      <div className="leaderboard-inner max-w-[1440px] mx-auto flex flex-col items-center">

        {/* Header */}
        <div className="leaderboard-header">
          <span className="leaderboard-eyebrow">Rankings</span>
          <h2 className="leaderboard-heading">Leaderboard</h2>
          <p className="leaderboard-subtext">
            Our top performing designers this season, ranked by community points.
          </p>
        </div>

        {/* DaisyUI: card used as structural base */}
        <div className="leaderboard-card card">

          {/* Card header bar */}
          <div className="leaderboard-card-header">
            <div className="leaderboard-card-header-left">
              <MdLeaderboard size={18} color="rgba(248,235,237,0.3)" />
              <span className="leaderboard-card-header-label">Season Rankings — 2026</span>
            </div>
            {/* DaisyUI: decorative dots — no equivalent, custom */}
            <div className="leaderboard-card-dots">
              {[0, 1, 2].map((i) => <div key={i} className="leaderboard-card-dot" />)}
            </div>
          </div>

          {/*
            Rankings list
            TODO: replace `leaders` with studentService.getTopLeaders()
          */}
          <div className="leaderboard-list">
            {leaders.map((leader, i) => (
              <div
                key={leader.rank}
                className={`leaderboard-row ${i < leaders.length - 1 ? "leaderboard-row--bordered" : ""}`}
              >
                {/* ERD: Submission.rank */}
                <div className={`leaderboard-rank ${leader.rank === 1 ? "leaderboard-rank--first" : "leaderboard-rank--other"}`}>
                  {leader.rank}
                </div>

                {/* Medal icon — derived from rank, not a DB field */}
                <div
                  className="leaderboard-medal"
                  style={{
                    background: leader.medalBg,
                    border: `1px solid ${leader.medalBorder}`,
                    color: leader.medalColor,
                  }}
                >
                  {leader.medal}
                </div>

                {/*
                  Avatar placeholder
                  TODO: replace with <img src={mentee.profile_image_url} />
                  NOTE: profile_image_url not yet in ERD — suggest adding to Mentee
                */}
                {/* DaisyUI: avatar component wraps this */}
                <div className="leaderboard-avatar">
                  <HiUser size={20} color="rgba(196,18,98,0.5)" />
                </div>

                {/* Name + handle */}
                <div className="leaderboard-identity">
                  {/* ERD: Mentee.fullname */}
                  <span className="leaderboard-name">{leader.name}</span>
                  {/* ERD: no username field — suggest adding to User or Mentee */}
                  <span className="leaderboard-handle">{leader.handle}</span>
                </div>

                {/* ERD: Submission.points */}
                <div className="leaderboard-points">
                  <HiStar size={14} color={leader.medalColor} />
                  <span className={`leaderboard-points-value ${leader.rank === 1 ? "leaderboard-points-value--first" : "leaderboard-points-value--other"}`}>
                    {leader.points}
                  </span>
                </div>

                {/* Decorative chevron — TODO: wrap in <Link to={`/students/${menteeID}`}> when profile page is built */}
                <FiChevronRight size={18} color="rgba(248,235,237,0.15)" />
              </div>
            ))}
          </div>

          {/* Card footer */}
          <div className="leaderboard-card-footer">
            {/*
              TODO: replace "1,200+" with live count
              ERD: SELECT COUNT(*) FROM Mentee
            */}
            <span className="leaderboard-footer-count">
              Showing top 3 of 1,200+ designers
            </span>
            {/* DaisyUI: btn base, gradient via CSS */}
            <Link to="/leaderboard" className="btn leaderboard-footer-btn">
              View Full Leaderboard
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeaderboardSection;