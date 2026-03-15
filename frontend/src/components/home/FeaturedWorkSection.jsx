import { Link } from "react-router-dom";
import { FiArrowRight, FiImage, FiUser } from "react-icons/fi";

// ============================================================
// DUMMY DATA — replace with API call to fetch featured posts
// ERD Table: Post
// Service: galleryService.getFeatured() → GET /api/posts?status=featured
//
// Fields mapped from ERD:
//   - id          → Post.PostID
//   - title       → Post.title
//   - designer    → Mentee.fullname (via Post.menteeID → Mentee.MenteeID)
//   - image_url   → Post.image_file_link
//   - tall        → derive from Post.category or image aspect ratio
// ============================================================
const works = [
  { id: 1, title: "Brand Identity — Flourish Co.", designer: "By Designer Name", tall: true },
  { id: 2, title: "UX Case Study — ReLeaf App", designer: "By Designer Name", tall: false },
  { id: 3, title: "Event Poster — Design Week", designer: "By Designer Name", tall: false },
  { id: 4, title: "Typography Series", designer: "By Designer Name", tall: true },
  { id: 5, title: "Logo System — Noire Studio", designer: "By Designer Name", tall: false },
  { id: 6, title: "Editorial Spread — Zine Vol. 2", designer: "By Designer Name", tall: false },
];
// ============================================================

function WorkCard({ title, designer, imageUrl, tall = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* 
        Image placeholder
        Replace this <div> with:
        <img src={imageUrl} alt={title} style={{ width: "100%", height: tall ? "340px" : "220px", objectFit: "cover", borderRadius: "16px" }} />
        ERD: Post.image_file_link
      */}
      <div style={{
        width: "100%",
        height: tall ? "340px" : "220px",
        borderRadius: "16px",
        background: "linear-gradient(145deg, rgba(196,18,98,0.08) 0%, rgba(13,6,8,0.9) 100%)",
        border: "1px solid rgba(196,18,98,0.12)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "10px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(196,18,98,0.3), transparent)",
        }} />
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: "rgba(196,18,98,0.12)",
          border: "1px solid rgba(196,18,98,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <FiImage size={20} color="rgba(196,18,98,0.4)" />
        </div>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "rgba(248,235,237,0.2)" }}>
          Project Image
        </span>
      </div>

      {/* Meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 4px" }}>
        {/* ERD: Post.title */}
        <span style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 600, fontSize: "14px", color: "#F8EBED",
        }}>
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FiUser size={12} color="rgba(248,235,237,0.25)" />
          {/* ERD: Mentee.fullname (joined via Post.menteeID → Mentee.MenteeID) */}
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400, fontSize: "12px",
            color: "rgba(248,235,237,0.35)",
          }}>
            {designer}
          </span>
        </div>
      </div>
    </div>
  );
}

function FeaturedWorkSection() {
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
      <div style={{
        position: "absolute", bottom: "-100px", right: "-100px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(196,18,98,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="max-w-[1440px] mx-auto" style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", marginBottom: "56px",
          flexWrap: "wrap", gap: "16px",
        }}>
          <div>
            <span style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500, fontSize: "11px",
              color: "#FE7FAB", letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}>
              Gallery Highlights
            </span>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700, fontSize: "clamp(36px, 4vw, 48px)",
              lineHeight: "1.15", color: "#F8EBED",
              marginTop: "8px", marginBottom: 0,
            }}>
              Featured Work
            </h2>
          </div>
          <Link
            to="/gallery"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "'Poppins', sans-serif", fontWeight: 500, fontSize: "13px",
              color: "rgba(248,235,237,0.6)",
              border: "1px solid rgba(248,235,237,0.1)",
              padding: "10px 20px", borderRadius: "12px",
              textDecoration: "none",
            }}
          >
            View Full Gallery
            <FiArrowRight size={14} />
          </Link>
        </div>

        {/* 
          Masonry Grid
          TODO: replace `works` with fetched data
          API call: galleryService.getFeatured()
          ERD: SELECT Post.PostID, Post.title, Post.image_file_link, Post.category,
                      Mentee.fullname
               FROM Post
               JOIN Mentee ON Post.menteeID = Mentee.MenteeID
               WHERE Post.status = 'featured'
               LIMIT 6
        */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <WorkCard {...works[0]} />
            <WorkCard {...works[4]} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <WorkCard {...works[1]} />
            <WorkCard {...works[2]} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <WorkCard {...works[5]} />
            <WorkCard {...works[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorkSection;