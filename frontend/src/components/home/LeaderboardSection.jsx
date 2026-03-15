import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";
import { HiTrophy, HiStar } from "react-icons/hi2";
import { MdMilitaryTech, MdGrade, MdLeaderboard } from "react-icons/md";
import { HiUser } from "react-icons/hi2";

// ============================================================
// DUMMY DATA — replace with API call to fetch top 3 leaders
// ERD Tables: Submission, Mentee, User
// Service: studentService.getTopLeaders() → GET /api/submissions/leaderboard?limit=3
//
// Fields mapped from ERD:
//   - rank     → Submission.rank
//   - name     → Mentee.fullname (via Submission.menteeID → Mentee.MenteeID)
//   - handle   → User.email or a username field
//              NOTE: No username/handle field in current ERD —
//              suggest adding a username field to User or Mentee table
//   - points   → Submission.points (formatted as "4,820 pts")
//
// Full query:
//   SELECT Submission.rank, Submission.points,
//          Mentee.fullname, User.email
//   FROM Submission
//   JOIN Mentee ON Submission.menteeID = Mentee.MenteeID
//   JOIN User ON Mentee.userID = User.UserID
//   ORDER BY Submission.points DESC
//   LIMIT 3
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
// ============================================================

function LeaderboardSection() {
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
        position: "absolute", top: "-80px", right: "20%",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(196,18,98,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div
        className="max-w-[1440px] mx-auto flex flex-col items-center"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Header  */}
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500, fontSize: "11px",
            color: "#FE7FAB", letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            Rankings
          </span>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700, fontSize: "clamp(36px, 4vw, 48px)",
            lineHeight: "1.15", color: "#F8EBED",
            marginTop: "12px", marginBottom: "16px",
          }}>
            Leaderboard
          </h2>
          <p style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400, fontSize: "15px",
            color: "rgba(248,235,237,0.5)",
            maxWidth: "360px", margin: "0 auto",
          }}>
            Our top performing designers this season, ranked by community points.
          </p>
        </div>

        {/* Leaderboard Card */}
        <div style={{
          width: "100%", maxWidth: "760px",
          borderRadius: "24px",
          background: "linear-gradient(145deg, rgba(196,18,98,0.08) 0%, rgba(13,6,8,0.95) 100%)",
          border: "1px solid rgba(196,18,98,0.2)",
          overflow: "hidden",
        }}>

          {/* Card Header  */}
          <div style={{
            padding: "20px 40px",
            borderBottom: "1px solid rgba(248,235,237,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <MdLeaderboard size={18} color="rgba(248,235,237,0.3)" />
              <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600, fontSize: "14px",
                color: "rgba(248,235,237,0.6)",
              }}>
                Season Rankings — 2026
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "rgba(248,235,237,0.1)",
                }} />
              ))}
            </div>
          </div>

          {/* 
            Rankings list
            TODO: replace `leaders` with fetched data
            API call: studentService.getTopLeaders()
            ERD:
              SELECT Submission.rank, Submission.points,
                     Mentee.fullname, User.email
              FROM Submission
              JOIN Mentee ON Submission.menteeID = Mentee.MenteeID
              JOIN User ON Mentee.userID = User.UserID
              ORDER BY Submission.points DESC
              LIMIT 3
          */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {leaders.map((leader, i) => (
              <div
                key={leader.rank} // ERD: Submission.rank
                style={{
                  display: "flex", alignItems: "center", gap: "24px",
                  padding: "20px 40px",
                  borderBottom: i < leaders.length - 1
                    ? "1px solid rgba(248,235,237,0.04)"
                    : "none",
                }}
              >
                {/* ERD: Submission.rank */}
                <div style={{ flexShrink: 0, width: "40px", textAlign: "center" }}>
                  <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 800,
                    fontSize: leader.rank === 1 ? "34px" : "26px",
                    color: leader.rank === 1 ? "#C41262" : "rgba(248,235,237,0.2)",
                    lineHeight: 1,
                  }}>
                    {leader.rank}
                  </span>
                </div>

                {/* Medal icon — derived from Submission.rank, not a DB field */}
                <div style={{
                  flexShrink: 0, width: "38px", height: "38px",
                  borderRadius: "50%",
                  background: leader.medalBg,
                  border: `1px solid ${leader.medalBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: leader.medalColor,
                }}>
                  {leader.medal}
                </div>

                {/* 
                  Avatar placeholder
                  TODO: replace with <img src={mentee.profile_image_url} />
                  NOTE: profile_image_url not in current ERD —
                  suggest adding profile_image_url to Mentee table
                */}
                <div style={{
                  flexShrink: 0, width: "44px", height: "44px",
                  borderRadius: "50%",
                  background: "rgba(196,18,98,0.12)",
                  border: "1px solid rgba(196,18,98,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <HiUser size={20} color="rgba(196,18,98,0.5)" />
                </div>

                {/* Name & Handle */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
                  {/* ERD: Mentee.fullname */}
                  <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700, fontSize: "15px", color: "#F8EBED",
                  }}>
                    {leader.name}
                  </span>
                  {/* 
                    ERD: No username/handle field in current schema
                    Currently using User.email as fallback
                    Suggest adding username to User or Mentee table
                  */}
                  <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 400, fontSize: "12px",
                    color: "rgba(248,235,237,0.35)",
                  }}>
                    {leader.handle}
                  </span>
                </div>

                {/* ERD: Submission.points — formatted as "X,XXX pts" */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <HiStar size={14} color={leader.medalColor} />
                  <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700, fontSize: "15px",
                    color: leader.rank === 1 ? "#C41262" : "rgba(248,235,237,0.6)",
                  }}>
                    {leader.points}
                  </span>
                </div>

                {/* Chevron — decorative, links to individual student profile in future */}
                {/* TODO: wrap row in <Link to={`/students/${mentee.MenteeID}`}> when profile page is built */}
                <FiChevronRight size={18} color="rgba(248,235,237,0.15)" />
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div style={{
            padding: "20px 40px",
            borderTop: "1px solid rgba(248,235,237,0.06)",
            background: "rgba(196,18,98,0.04)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {/* 
              "Showing top 3 of X designers"
              TODO: replace 1,200+ with live count
              ERD: SELECT COUNT(*) FROM Mentee
            */}
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400, fontSize: "13px",
              color: "rgba(248,235,237,0.3)",
            }}>
              Showing top 3 of 1,200+ designers
            </span>
            <Link
              to="/leaderboard"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 24px", borderRadius: "12px",
                background: "linear-gradient(135deg, #C41262, #FE4081)",
                color: "white", textDecoration: "none",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600, fontSize: "13px",
              }}
            >
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