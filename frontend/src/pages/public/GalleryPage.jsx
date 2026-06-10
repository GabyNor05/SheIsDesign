import { useState, useMemo, useEffect, useRef } from "react";
import {
  Lightning, Trophy, Heart, BookmarkSimple,
  ArrowSquareOut, Plus, Eye, Tag, ChatCircle, PaperPlaneTilt,
  CaretLeft, CaretRight, X
} from "@phosphor-icons/react";
import { postService } from "../../services/postManagementService";
import { eventService } from "../../services/eventService";
import { fetchParticipantsForAdmin } from "../../services/participantService";
import { useAuth } from "../../context/AuthContext";
import PostToLibraryModal from "../../components/gallery/PostToLibraryModal";
import "./GalleryPage.css";

const CATEGORIES = [
  "All", "Graphic Design", "Illustration", "Brand Identity",
  "UI/UX", "Motion Design", "Photography", "Typography",
  "3D Art", "Product Design", "Packaging", "Editorial",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Most Recent" },
  { value: "az",     label: "A → Z" },
];

const CATEGORY_GRADIENTS = {
  "Graphic Design":   ["#0a0d1a", "#0a1a3d", "#1262C4"],
  "Illustration":     ["#0a1a10", "#0a3d1a", "#12C462"],
  "Brand Identity":   ["#1a0510", "#3d0a24", "#C41262"],
  "UI/UX":            ["#100a1a", "#240a3d", "#6212C4"],
  "Motion Design":    ["#1a100a", "#3d240a", "#C46212"],
  "Photography":      ["#0a1a1a", "#0a3d3d", "#12C4C4"],
  "Typography":       ["#1a1a0a", "#3d3d0a", "#C4C412"],
  "3D Art":           ["#1a0a1a", "#3d0a3d", "#C412C4"],
  "Product Design":   ["#0a0a1a", "#1a1a3d", "#4062C4"],
  "Packaging":        ["#1a100a", "#3d280a", "#C47812"],
  "Editorial":        ["#0f0a1a", "#2a0a3d", "#8012C4"],
};

const PAGE_SIZE = 9;

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseDescription(raw = "") {
  const match = raw.match(/^\[([^\]]*)\]\s*(.*)/s);
  if (match) {
    const tags = match[1].split(",").map(t => t.trim()).filter(Boolean);
    return { tags, description: match[2].trim() };
  }
  return { tags: [], description: raw.trim() };
}

function parseImages(raw = "") {
  if (!raw) return [];
  return raw.split("|||").map(s => s.trim()).filter(Boolean);
}

function normalisePost(p) {
  const rawDescription = p.Description ?? p.description ?? "";
  const { tags, description } = parseDescription(rawDescription);
  const rawImageLink = p.ImageFileLink ?? p.imageFileLink ?? p.image_file_link ?? "";
  const images = parseImages(rawImageLink);

  return {
    id:           p.Id           ?? p.id,
    title:        p.Title        ?? p.title        ?? "",
    description,
    tags,
    images,
    imageUrl:     images[0] || null,
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

// ── localStorage comment store (replace with API later) ───────────────────────
function getComments(postId) {
  try { return JSON.parse(localStorage.getItem(`comments_${postId}`) || "[]"); }
  catch { return []; }
}
function saveComments(postId, comments) {
  localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
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

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ post, onClick, index }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 45);
    return () => clearTimeout(timer);
  }, [index]);

  const gradient = CATEGORY_GRADIENTS[post.category] || ["#1a0510", "#2d0a1e", "#C41262"];
  const hasImage = !!post.imageUrl;
  const name     = post.studentName?.trim() || "Designer";
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

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
        style={{ background: hasImage ? undefined : `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})` }}
      >
        {hasImage
          ? <img src={post.imageUrl} alt={post.title} className="bcard__img" />
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
            <div className="bcard__overlay-stat"><Eye size={13} weight="fill" /><span>View</span></div>
            {post.images.length > 1 && (
              <div className="bcard__overlay-stat"><span>{post.images.length} photos</span></div>
            )}
          </div>
        </div>

        {post.rank === 1 && <div className="bcard__top-badge">✦ Top Entry</div>}
        <div className="bcard__cat-pill">{post.category}</div>
        {post.images.length > 1 && (
          <div className="bcard__multi-badge">{post.images.length}</div>
        )}
      </div>

      {/* Title first, then author below */}
      <div className="bcard__title">{post.title}</div>

      <div className="bcard__meta">
        <div className="bcard__author">
          <div className="bcard__avatar">{initials}</div>
          <span className="bcard__author-name">{name}</span>
        </div>
      </div>
    </div>
  );
}

// ── Image carousel ────────────────────────────────────────────────────────────
function ImageCarousel({ images, alt }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;

  const prev = e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };

  return (
    <div className="gallery-carousel">
      <img src={images[idx]} alt={alt} className="gallery-carousel__img" />
      {images.length > 1 && (
        <>
          <button className="gallery-carousel__btn gallery-carousel__btn--prev" onClick={prev}>
            <CaretLeft size={18} weight="bold" />
          </button>
          <button className="gallery-carousel__btn gallery-carousel__btn--next" onClick={next}>
            <CaretRight size={18} weight="bold" />
          </button>
          <div className="gallery-carousel__dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`gallery-carousel__dot ${i === idx ? "gallery-carousel__dot--active" : ""}`}
                onClick={e => { e.stopPropagation(); setIdx(i); }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Comment section ───────────────────────────────────────────────────────────
function CommentSection({ postId, user }) {
  const [comments, setComments] = useState(() => getComments(postId));
  const [text, setText]         = useState("");
  const inputRef                = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const newComment = {
      id:        Date.now(),
      author:    user?.fullname || user?.email || "Anonymous",
      initials:  (user?.fullname || user?.email || "A").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      text:      text.trim(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...comments, newComment];
    setComments(updated);
    saveComments(postId, updated);
    setText("");
  }

  const isPending = user?.status === "Pending" && user?.role?.toLowerCase() !== "admin";

  function renderCommentFooter() {
    if (!user) {
      return (
        <p className="gallery-comments__login-prompt">
          <a href="/login" className="gallery-comments__login-link">Log in</a> to leave a comment.
        </p>
      );
    }
    if (isPending) {
      return (
        <p className="gallery-comments__login-prompt">
          Once an admin verifies your account you can comment.
        </p>
      );
    }
    return (
      <form className="gallery-comments__form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="gallery-comments__input"
          placeholder="Add a comment…"
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={300}
        />
        <button type="submit" className="gallery-comments__submit" disabled={!text.trim()}>
          <PaperPlaneTilt size={14} weight="fill" />
        </button>
      </form>
    );
  }

  return (
    <div className="gallery-comments">
      <div className="gallery-comments__header">
        <ChatCircle size={14} weight="fill" color="#C41262" />
        <span>Comments {comments.length > 0 && `(${comments.length})`}</span>
      </div>

      {comments.length === 0 && (
        <p className="gallery-comments__empty">No comments yet. Be the first!</p>
      )}

      <div className="gallery-comments__list">
        {comments.map(c => (
          <div key={c.id} className="gallery-comment">
            <div className="gallery-comment__avatar">{c.initials}</div>
            <div className="gallery-comment__body">
              <div className="gallery-comment__author">{c.author}</div>
              <div className="gallery-comment__text">{c.text}</div>
              <div className="gallery-comment__time">
                {new Date(c.timestamp).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderCommentFooter()}
    </div>
  );
}

// ── PostModal ─────────────────────────────────────────────────────────────────
function PostModal({ post, onClose, user }) {
  const [liked,  setLiked]  = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard.writeText(`${window.location.origin}/gallery/${post.id}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const gradient  = CATEGORY_GRADIENTS[post.category] || ["#1a0510", "#2d0a1e", "#C41262"];
  const hasImages = post.images && post.images.length > 0;
  const name      = post.studentName?.trim() || "Designer";
  const initials  = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="gallery-modal__backdrop" onClick={onClose}>
      <div className="gallery-modal" onClick={e => e.stopPropagation()}>

        {/* Image panel */}
        <div
          className="gallery-modal__image-panel"
          style={{ background: hasImages ? "#0a0a0a" : `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})` }}
        >
          {hasImages
            ? <ImageCarousel images={post.images} alt={post.title} />
            : (
              <div className="gallery-modal__img-placeholder">
                <svg width="56" height="56" viewBox="0 0 24 24" fill={gradient[2] + "44"}>
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <span>no image uploaded</span>
              </div>
            )
          }
          {post.rank === 1 && <div className="gallery-modal__top-badge">✦ Top Entry</div>}
          <div className="gallery-modal__cat-pill">{post.category}</div>
        </div>

        {/* Info panel */}
        <div className="gallery-modal__panel">
          <button className="gallery-modal__close" onClick={onClose}><X size={14} /></button>
          <div className="gallery-modal__panel-scroll">

            <h2 className="gallery-modal__title">{post.title}</h2>

            <div className="gallery-modal__author-row">
              <div className="gallery-modal__avatar">{initials}</div>
              <div>
                <div className="gallery-modal__author-name">{name}</div>
                {post.eventName && <div className="gallery-modal__author-event">{post.eventName}</div>}
              </div>
            </div>

            {post.description && (
              <p className="gallery-modal__description">{post.description}</p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="gallery-modal__tags">
                <Tag size={12} color="rgba(255,255,255,0.35)" />
                {post.tags.map(tag => (
                  <span key={tag} className="gallery-modal__tag">{tag}</span>
                ))}
              </div>
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
                Posted {new Date(post.timeStamp).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}

            <CommentSection postId={post.id} user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── GalleryPage ───────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const { user } = useAuth();
  const studentId = user?.studentId ?? (Number(sessionStorage.getItem("StudentID")) || null);

  const [posts,          setPosts]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [fetchError,     setFetchError]     = useState(null);
  const [userCount,      setUserCount]      = useState(null);
  const [eventCount,     setEventCount]     = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy,         setSortBy]         = useState("newest");
  const [search,         setSearch]         = useState("");
  const [selectedPost,   setSelectedPost]   = useState(null);
  const [heroVisible,    setHeroVisible]    = useState(false);
  const [showPostModal,  setShowPostModal]  = useState(false);
  const [page,           setPage]           = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setFetchError(null);
      try {
        const [data, events, participants] = await Promise.allSettled([
          postService.getAllPosts(),
          eventService.getAllEvents(),
          fetchParticipantsForAdmin(),
        ]);
        const all = Array.isArray(data.value) ? data.value : [];
        setPosts(all.map(normalisePost));
        if (events.status === "fulfilled") setEventCount(events.value.length);
        if (participants.status === "fulfilled") setUserCount(participants.value.length);
      } catch (err) {
        setFetchError(err?.message || "Failed to load gallery.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeCategory, search, sortBy]);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (activeCategory !== "All") result = result.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleNewPost(newPost) {
    setPosts(prev => [normalisePost(newPost), ...prev]);
    setPage(1);
  }

  return (
    <div className="gallery-page">

      {/* Hero */}
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
              { value: loading ? "…" : `${posts.length}+`,                    label: "Posts" },
              { value: userCount  == null ? "…" : `${userCount}+`,  label: "Designers" },
              { value: eventCount == null ? "…" : `${eventCount}`,  label: "Events" },
            ].map(s => (
              <div key={s.label} className="gallery-hero__stat">
                <span className="gallery-hero__stat-value">{s.value}</span>
                <span className="gallery-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
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
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="gallery-search__clear" onClick={() => setSearch("")}>✕</button>}
          </div>
          <div className="gallery-filters">
            {CATEGORIES.map(cat => (
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
            <select className="gallery-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
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
            <>
              <div className="behance-grid">
                {paged.map((post, i) => (
                  <PostCard key={post.id} post={post} onClick={setSelectedPost} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="gallery-pagination">
                  <button
                    className="gallery-pagination__btn"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                  >
                    ← Prev
                  </button>
                  <div className="gallery-pagination__pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={`gallery-pagination__page ${p === page ? "gallery-pagination__page--active" : ""}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    className="gallery-pagination__btn"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FAB — hidden for pending users */}
      {!(user?.status === "Pending" && user?.role?.toLowerCase() !== "admin") && (
        <button className="gallery-fab" onClick={() => setShowPostModal(true)} title="Post to Library">
          <Plus size={24} weight="bold" />
        </button>
      )}

      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} user={user} />
      )}

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