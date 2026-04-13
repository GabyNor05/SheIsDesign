import { Link } from "react-router-dom";
import { FiArrowRight, FiImage, FiUser } from "react-icons/fi";
import "./FeaturedWorkSection.css";

// ============================================================
// DUMMY DATA — replace with galleryService.getFeatured()
// ERD Table: Post (joined with Mentee)
// Fields: PostID, title, image_file_link, category, menteeID → Mentee.fullname
// ============================================================
const works = [
  { id: 1, title: "Brand Identity — Flourish Co.", designer: "By Designer Name", tall: true },
  { id: 2, title: "UX Case Study — ReLeaf App", designer: "By Designer Name", tall: false },
  { id: 3, title: "Event Poster — Design Week", designer: "By Designer Name", tall: false },
  { id: 4, title: "Typography Series", designer: "By Designer Name", tall: true },
  { id: 5, title: "Logo System — Noire Studio", designer: "By Designer Name", tall: false },
  { id: 6, title: "Editorial Spread — Zine Vol. 2", designer: "By Designer Name", tall: false },
];

function WorkCard({ title, designer, tall = false }) {
  return (
    <div className="work-card">

      {/*
        Image placeholder — replace with:
        <img src={imageUrl} alt={title} className={`work-card-image ${tall ? "work-card-image--tall" : "work-card-image--short"}`} style={{ objectFit: "cover" }} />
        ERD: Post.image_file_link
      */}
      <div className={`work-card-image ${tall ? "work-card-image--tall" : "work-card-image--short"}`}>
        <div className="work-card-image-glow" />
        <div className="work-card-image-icon">
          <FiImage size={20} color="rgba(196,18,98,0.4)" />
        </div>
        <span className="work-card-image-label">Project Image</span>
      </div>

      {/* Meta */}
      <div className="work-card-meta">
        {/* ERD: Post.title */}
        <span className="work-card-title">{title}</span>
        <div className="work-card-designer-row">
          <FiUser size={12} color="rgba(248,235,237,0.25)" />
          {/* ERD: Mentee.fullname via Post.menteeID → Mentee.MenteeID */}
          <span className="work-card-designer">{designer}</span>
        </div>
      </div>
    </div>
  );
}

function FeaturedWorkSection() {
  return (
    <section className="featured-section w-full px-8 md:px-16 py-28">

      {/* Background glow */}
      <div className="featured-glow" />

      <div className="featured-inner max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="featured-header">
          <div>
            <span className="featured-eyebrow">Gallery Highlights</span>
            <h2 className="featured-heading">Featured Work</h2>
          </div>
          {/* DaisyUI: btn-ghost base for outlined link button */}
          <Link to="/gallery" className="btn btn-ghost featured-view-all">
            View Full Gallery
            <FiArrowRight size={14} />
          </Link>
        </div>

        {/*
          Masonry Grid
          TODO: replace `works` with galleryService.getFeatured()
          ERD: SELECT Post.PostID, Post.title, Post.image_file_link,
                      Post.category, Mentee.fullname
               FROM Post JOIN Mentee ON Post.menteeID = Mentee.MenteeID
               WHERE Post.status = 'featured' LIMIT 6
        */}
        <div className="featured-grid">
          <div className="featured-col">
            <WorkCard {...works[0]} />
            <WorkCard {...works[4]} />
          </div>
          <div className="featured-col">
            <WorkCard {...works[1]} />
            <WorkCard {...works[2]} />
          </div>
          <div className="featured-col">
            <WorkCard {...works[5]} />
            <WorkCard {...works[3]} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorkSection;