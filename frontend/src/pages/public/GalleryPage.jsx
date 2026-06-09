import { useState, useMemo, useEffect } from "react";
import { Lightning, Trophy, CheckCircle, Heart, BookmarkSimple, ArrowSquareOut, Plus, Eye } from "@phosphor-icons/react";
import { postService } from "../../services/postManagementService";
import { useAuth } from "../../context/AuthContext";
import PostToLibraryModal from "../../components/gallery/PostToLibraryModal";
import "./GalleryPage.css";

const CATEGORIES = ["All", "Brand Identity", "Graphic Design", "UX Design", "Motion Design", "UI Design", "Print & Packaging"];

const SORT_OPTIONS = [
  { value: "newest", label: "Most Recent" },
  { value: "az",     label: "A → Z" },
];

const CATEGORY_GRADIENTS = {
  "Brand Identity":    ["#1a0510", "#3d0a24", "#C41262"],
  "Graphic Design":    ["#0a0d1a", "#0a1a3d", "#1262C4"],
  "UX Design":         ["#0a1a10", "#0a3d1a", "#12C462"],
  "Motion Design":     ["#1a100a", "#3d240a", "#C46212"],
  "UI Design":         ["#100a1a", "#240a3d", "#6212C4"],
  "Print & Packaging": ["#1a1a0a", "#3d3d0a", "#C4C412"],
};

function normalisePost(p) {
  return {
    id:           p.Id           ?? p.id,
    title:        p.Title        ?? p.title        ?? "",
    description:  p.Description  ?? p.description  ?? "",
    imageUrl:     p.ImageFileLink ?? p.imageFileLink ?? p.image_file_link ?? null,
    category:     p.Category     ?? p.category     ?? "Graphic Design",
    studentId:    p.StudentId    ?? p.studentId    ?? null,
    studentName:  p.StudentName  ?? p.studentName  ?? "",
    eventId:      p.EventId      ?? p.eventId      ?? null,
    eventName:    p.EventName    ?? p.eventName    ?? "",
    status:       p.Status       ?? p.status       ?? "",
    points:       p.Points       ?? p.points       ?? null,
    rank:         p.Rank         ?? p.rank         ?? null,
    timeStamp:    p.PostDate     ?? p.postDate     ?? p.TimeStamp ?? p.timeStamp ?? null,
    linkCount:    p.LinkCount    ?? p.linkCount    ?? 0,
    commentCount: p.CommentCount ?? p.commentCount ?? 0,
  };
}

function SkeletonCard() {
  return (
    <div className="gallery-skeleton">
      <div className="gallery-skeleton__image" />
      <div className="gallery-skeleton__body">
        <div className="gallery-skeleton__line gallery-skeleton__line--title" />
        <div className="gallery-skeleton__line gallery-skeleton__line--meta" />
      </div>
    </div>
  );
}

function PostCard({ post, onClick, index }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 45);
    return () => clearTimeout(timer);
  }, [index]);

  const gradient = CATEGORY_GRADIENTS[post.category] || ["#1a0510", "#2d0a1e", "#C41262"];
  const hasImage = !!post.imageFileLink;
  const initials = (post.studentName || "D").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      className={`bcard ${visible ? "bcard--visible" : ""}`}
      onClick={() => onClick(post)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ "--card-index": index }}
    >
      <div
        className="bcard__thumb"
        style={{
          background: hasImage ? undefined : `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
        }}
      >
        {hasImage
          ? <img src={post.imageFileLink} alt={post.title} className="bcard__img" />
          : (
            <div className="bcard__placeholder">
              <svg width="28" height="28" viewBox="0 0 24 24" fill={gradient[2] + "55"}>
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          )
        }

        <div className={`bcard__overlay ${hovered ? "bcard__overlay--visible" : ""}`}>
          <div className="bcard__overlay-actions">
            <div className="bcard__overlay-stat">
              <Eye size={13} weight="fill" />
              <span>View</span>
            </div>
            {post.points != null && (
              <div className="bcard__overlay-stat">
                <Lightning size={13} weight="fill" color="#FE4081" />
                <span>{post.points}</span>
              </div>
            )}
          </div>
        </div>

        {post.rank === 1 && (
          <div className="bcard__top-badge">✦ Top Entry</div>
        )}
        <div className="bcard__cat-pill">{post.category}</div>
      </div>

      <div className="bcard__meta">
        <div className="bcard__author">
          <div className="bcard__avatar">{initials}</div>
          <div className="bcard__author-info">
            <span className="bcard__author-name">{post.studentName || "Designer"}</span>
            {post.eventName && (
              <span className="bcard__author-event">{post.eventName}</span>
            )}
          </div>
        </div>
        <div className="bcard__appreciation">
          <Heart size={13} />
          <span>{post.linkCount ?? 0}</span>
        </div>
      </div>

      <div className="bcard__title">{post.title}</div>
    </div>
  );
}

function PostModal({ post, onClose }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const url = `${window.location.origin}/gallery/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const gradient = CATEGORY_GRADIENTS[post.category] || ["#1a0510", "#2d0a1e", "#C41262"];
  const hasImage = !!post.imageUrl;
  const initials = (post.studentName || "D").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="gallery-modal__backdrop" onClick={onClose}>
      <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>

        <div
          className="gallery-modal__image-panel"
          style={{ background: hasImage ? "#0a0a0a" : `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})` }}
        >
          {hasImage
            ? <img src={post.imageUrl} alt={post.title} className="gallery-modal__img" />
            : (
              <div className="gallery-modal__img-placeholder">
                <svg width="56" height="56" viewBox="0 0 24 24" fill={gradient[2] + "44"}>
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <span>image coming soon</span>
              </div>
            )
          }
          {post.rank === 1 && <div className="gallery-modal__top-badge">✦ Top Entry</div>}
          <div className="gallery-modal__cat-pill">{post.category}</div>
        </div>

        <div className="gallery-modal__panel">
          <button className="gallery-modal__close" onClick={onClose}>✕</button>
          <div className="gallery-modal__panel-scroll">

            <h2 className="gallery-modal__title">{post.title}</h2>

            <div className="gallery-modal__author-row">
              <div className="gallery-modal__avatar">{initials}</div>
              <div>
                <div className="gallery-modal__author-name">{post.studentName || "Designer"}</div>
                {post.eventName && <div className="gallery-modal__author-event">{post.eventName}</div>}
              </div>
            </div>

            {post.description && (
              <p className="gallery-modal__description">{post.description}</p>
            )}

            <div className="gallery-modal__widgets">
              {post.points != null && (
                <div className="gallery-modal__widget gallery-modal__widget--points">
                  <div className="gallery-modal__widget-icon"><Lightning size={18} weight="fill" color="#FE4081" /></div>
                  <div className="gallery-modal__widget-text">
                    <span className="gallery-modal__widget-value">{post.points}</span>
                    <span className="gallery-modal__widget-label">Points Earned</span>
                  </div>
                </div>
              )}
              {post.rank != null && (
                <div className="gallery-modal__widget gallery-modal__widget--rank">
                  <div className="gallery-modal__widget-icon"><Trophy size={18} weight="fill" color="#FFB800" /></div>
                  <div className="gallery-modal__widget-text">
                    <span className="gallery-modal__widget-value">#{post.rank}</span>
                    <span className="gallery-modal__widget-label">Event Rank</span>
                  </div>
                </div>
              )}
              {post.status && (
                <div className="gallery-modal__widget gallery-modal__widget--status">
                  <div className="gallery-modal__widget-icon"><CheckCircle size={18} weight="fill" color="#10e266" /></div>
                  <div className="gallery-modal__widget-text">
                    <span className="gallery-modal__widget-value">{post.status}</span>
                    <span className="gallery-modal__widget-label">Review Status</span>
                  </div>
                </div>
              )}
            </div>

            <div className="gallery-modal__actions">
              <button
                className={`gallery-modal__action-btn gallery-modal__action-btn--like ${liked ? "gallery-modal__action-btn--active" : ""}`}
                onClick={() => setLiked(!liked)}
              >
                <Heart size={14} weight={liked ? "fill" : "regular"} />
                {liked ? "Liked" : "Appreciate"}
              </button>
              <button
                className={`gallery-modal__action-btn gallery-modal__action-btn--save ${saved ? "gallery-modal__action-btn--active" : ""}`}
                onClick={() => setSaved(!saved)}
              >
                <BookmarkSimple size={14} weight={saved ? "fill" : "regular"} />
                {saved ? "Saved" : "Save"}
              </button>
              <button className="gallery-modal__action-btn gallery-modal__action-btn--share" onClick={handleShare}>
                <ArrowSquareOut size={14} />
                {copied ? "Copied!" : "Share"}
              </button>
            </div>

            {copied && <div className="gallery-modal__toast">Link copied to clipboard ✓</div>}

            {post.timeStamp && (
              <div className="gallery-modal__date">
                Posted {new Date(post.timeStamp).toLocaleDateString("en-ZA", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const { user } = useAuth();

  const studentId = sessionStorage.getItem("StudentID");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setFetchError(null);
      try {
        const data = await postService.getAllPosts();
        const all = Array.isArray(data) ? data : [];
        const approved = all.map(normalisePost).filter((p) => p.status === "Approved");
        setPosts(all);
      } catch (err) {
        setFetchError(err?.message || "Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (activeCategory !== "All") result = result.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.studentName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.eventName.toLowerCase().includes(q)
      );
    }
    if (sortBy === "newest") result.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    if (sortBy === "az")     result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [posts, activeCategory, sortBy, search]);

  function handleNewPost(newPost) {
    setPosts((prev) => [normalisePost(newPost), ...prev]);
  }

  return (
    <div className="gallery-page">

      {/* ── Hero ── */}
      <section className={`gallery-hero ${heroVisible ? "gallery-hero--visible" : ""}`}>
        <div className="gallery-hero__bg-gradient" />
        <div className="gallery-hero__orb" />

        <div className="gallery-hero__inner">
          <div className="gallery-hero__eyebrow">
            <div className="gallery-hero__eyebrow-line" />
            <span>Student Work</span>
          </div>

          <h1 className="gallery-hero__heading">
            <span className="gallery-hero__heading-light">Design</span>
            <span className="gallery-hero__heading-gradient"> Gallery</span>
          </h1>

          <p className="gallery-hero__subtext">
            Explore creative work from SheIsDesign participants across our events.<br />
            Browse, get inspired, and celebrate the community.
          </p>

          <div className="gallery-hero__stats">
            {[
              { value: loading ? "…" : `${posts.length}+`, label: "Posts" },
              { value: "320+", label: "Designers" },
              { value: "48",   label: "Events" },
            ].map((s) => (
              <div key={s.label} className="gallery-hero__stat">
                <span className="gallery-hero__stat-value">{s.value}</span>
                <span className="gallery-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Controls ── */}
      <div className="gallery-controls">
        <div className="gallery-controls__inner">
          <div className="gallery-search">
            <svg className="gallery-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="gallery-search__input"
              type="text"
              placeholder="Search by title, designer, event…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button className="gallery-search__clear" onClick={() => setSearch("")}>✕</button>}
          </div>

          <div className="gallery-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`gallery-filter-pill ${activeCategory === cat ? "gallery-filter-pill--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="gallery-controls__right">
            <span className="gallery-count">
              {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "post" : "posts"}`}
            </span>
            <select className="gallery-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="gallery-grid">
        <div className="gallery-grid__inner">

          {loading && (
            <div className="behance-grid">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {!loading && fetchError && (
            <div className="gallery-empty">
              <div className="gallery-empty__icon">⚠</div>
              <p className="gallery-empty__text">{fetchError}</p>
              <button className="gallery-empty__reset" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!loading && !fetchError && filtered.length === 0 && (
            <div className="gallery-empty">
              <div className="gallery-empty__icon">◎</div>
              <p className="gallery-empty__text">
                {posts.length === 0 ? "No posts in the gallery yet." : "No posts match your search."}
              </p>
              {posts.length > 0 && (
                <button className="gallery-empty__reset" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
                  Clear filters
                </button>
              )}
            </div>
          )}

          {!loading && !fetchError && filtered.length > 0 && (
            <div className="behance-grid">
              {filtered.map((post, i) => (
                <PostCard key={post.id} post={post} onClick={setSelectedPost} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Floating action button ── */}
      <button
        className="gallery-fab"
        onClick={() => setShowPostModal(true)}
        title="Post to Library"
      >
        <Plus size={24} weight="bold" />
      </button>

      {/* ── Post detail modal ── */}
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      {/* ── Post to library modal ── */}
      {showPostModal && (
        <PostToLibraryModal
          onClose={() => setShowPostModal(false)}
          onSuccess={handleNewPost}
          studentId={studentId}
        />
      )}
    </div>
  );
}