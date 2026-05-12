import { useState, useMemo, useEffect, useRef } from "react";
import { Lightning, Trophy, CheckCircle, Heart, BookmarkSimple, ArrowSquareOut } from "@phosphor-icons/react";
import "./GalleryPage.css";

// ─── Mock Data ────────────────────────────────────────────────────────────────
// TODO: replace with → fetch("http://localhost:5160/api/Submission/gallery")
// Expected shape once backend adds fields:
// { id, title, description, image_url, category, studentName, eventName, status, points, rank, timeStamp }

const MOCK_SUBMISSIONS = [
  { id: 1, title: "Bloom — Wellness Brand Identity", description: "A complete brand identity system for a fictional wellness startup — logo mark, colour palette, typography system, and stationery. The concept draws on organic forms to communicate calm, clarity, and vitality.", category: "Brand Identity", studentName: "Maya Osei", eventName: "Brand Identity Challenge 2026", status: "Approved", points: 94, rank: 1, timeStamp: "2026-04-12", imageHeight: 380 },
  { id: 2, title: "Resilience — Typographic Poster", description: "A print-ready typographic poster exploring resilience through bold, expressive type and deliberate negative space.", category: "Graphic Design", studentName: "Laila Nkosi", eventName: "Poster Design Open", status: "Approved", points: 87, rank: 2, timeStamp: "2026-04-10", imageHeight: 500 },
  { id: 3, title: "Flow — App UX Case Study", description: "End-to-end UX redesign of a mental health journalling app — user research, wireframes, and high-fidelity mockups with emphasis on accessibility.", category: "UX Design", studentName: "Priya Shankar", eventName: "UX Redesign Sprint", status: "Approved", points: 91, rank: 1, timeStamp: "2026-04-08", imageHeight: 320 },
  { id: 4, title: "Pulse — Motion Brand Intro", description: "A 10-second brand intro sequence for a fictional music streaming platform. Kinetic typography and rhythmic transitions built in After Effects.", category: "Motion Design", studentName: "Amara Diallo", eventName: "Motion & Animation Challenge", status: "Approved", points: 83, rank: 3, timeStamp: "2026-04-05", imageHeight: 440 },
  { id: 5, title: "Terra — Packaging System", description: "A sustainable packaging system for an eco-conscious tea brand. Hand-drawn botanical illustrations paired with a minimal typographic system.", category: "Print & Packaging", studentName: "Zoe Müller", eventName: "Packaging Design Brief", status: "Approved", points: 89, rank: 2, timeStamp: "2026-04-03", imageHeight: 360 },
  { id: 6, title: "Signal — App Icon Suite", description: "A cohesive icon suite for a productivity app ecosystem — 12 icons on a 1024px grid with unified weight, corner radius, and visual language.", category: "UI Design", studentName: "Chidi Eze", eventName: "App Icon Design Challenge", status: "Approved", points: 76, rank: 4, timeStamp: "2026-03-30", imageHeight: 280 },
  { id: 7, title: "Archive — Social Media Kit", description: "A modular social media kit for a fictional creative studio — Stories, Feed, and Carousel templates in Figma with auto-layout components.", category: "Brand Identity", studentName: "Nina Ferreira", eventName: "Social Media Kit Open", status: "Approved", points: 82, rank: 3, timeStamp: "2026-03-28", imageHeight: 420 },
  { id: 8, title: "Grid — Layout Exploration", description: "Six editorial spreads exploring the relationship between typographic grid and photographic composition. Inspired by Swiss design systems.", category: "Graphic Design", studentName: "Sasha Kim", eventName: "Typography & Layout Sprint", status: "Approved", points: 79, rank: 4, timeStamp: "2026-03-25", imageHeight: 350 },
  { id: 9, title: "Verse — Editorial Concept", description: "A single-story editorial layout for a fictional design magazine — bold typographic pull quotes and full-bleed imagery.", category: "UX Design", studentName: "Fatima Al-Hassan", eventName: "Typography & Layout Sprint", status: "Approved", points: 96, rank: 1, timeStamp: "2026-03-22", imageHeight: 300 },
  { id: 10, title: "Dusk — Brand Campaign", description: "A full campaign identity for a fictional sustainable fashion label — art direction, copywriting, and visual system across digital and print.", category: "Brand Identity", studentName: "Aisha Conteh", eventName: "Brand Identity Challenge 2026", status: "Approved", points: 88, rank: 2, timeStamp: "2026-03-20", imageHeight: 460 },
  { id: 11, title: "Neon — Dashboard UI", description: "A dark-mode analytics dashboard for a creative agency — data visualisation, micro-interactions, and a cohesive component library.", category: "UI Design", studentName: "Lerato Dlamini", eventName: "UX Redesign Sprint", status: "Approved", points: 85, rank: 2, timeStamp: "2026-03-18", imageHeight: 390 },
  { id: 12, title: "Echo — Sound Branding", description: "Visual identity for a podcast network — logo animation, cover art system, and promotional materials across 6 shows.", category: "Motion Design", studentName: "Yemi Adeyemi", eventName: "Motion & Animation Challenge", status: "Approved", points: 81, rank: 3, timeStamp: "2026-03-15", imageHeight: 310 },
];

const CATEGORIES = ["All", "Brand Identity", "Graphic Design", "UX Design", "Motion Design", "UI Design", "Print & Packaging"];

const SORT_OPTIONS = [
  { value: "newest", label: "Most Recent" },
  { value: "points", label: "Top Scoring" },
  { value: "rank", label: "Highest Ranked" },
];

// Gradient palettes per category for placeholder images
const CATEGORY_GRADIENTS = {
  "Brand Identity": ["#1a0510", "#3d0a24", "#C41262"],
  "Graphic Design": ["#0a0d1a", "#0a1a3d", "#1262C4"],
  "UX Design": ["#0a1a10", "#0a3d1a", "#12C462"],
  "Motion Design": ["#1a100a", "#3d240a", "#C46212"],
  "UI Design": ["#100a1a", "#240a3d", "#6212C4"],
  "Print & Packaging": ["#1a1a0a", "#3d3d0a", "#C4C412"],
};

// ─── Submission Card ──────────────────────────────────────────────────────────
function SubmissionCard({ submission, onClick, index }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 60);
    return () => clearTimeout(timer);
  }, [index]);

  const gradient = CATEGORY_GRADIENTS[submission.category] || ["#1a0510", "#2d0a1e", "#C41262"];

  return (
    <div
      ref={ref}
      className={`gallery-card ${visible ? "gallery-card--visible" : ""}`}
      onClick={() => onClick(submission)}
      style={{ "--card-index": index }}
    >
      {/* Image area */}
      <div
        className="gallery-card__image"
        style={{
          height: submission.imageHeight,
          background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
        }}
      >
        {/* Placeholder icon */}
        <div className="gallery-card__placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill={gradient[2] + "66"}>
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <span className="gallery-card__placeholder-text">
            {/* TODO: replace with <img src={submission.image_url} /> */}
            image coming soon
          </span>
        </div>

        {/* Hover overlay — removed, click card to open */}

        {/* Rank badge */}
        {submission.rank === 1 && (
          <div className="gallery-card__badge gallery-card__badge--top">
            ✦ Top Entry
          </div>
        )}

        {/* Category pill */}
        <div className="gallery-card__category-pill">
          {submission.category}
        </div>
      </div>

      {/* Body */}
      <div className="gallery-card__body">
        <h3 className="gallery-card__title">{submission.title}</h3>
        <div className="gallery-card__meta">
          <div className="gallery-card__author">
            <div className="gallery-card__avatar">
              {submission.studentName.charAt(0)}
            </div>
            <span>{submission.studentName}</span>
          </div>
          <div className="gallery-card__points">
            <span className="gallery-card__points-value">{submission.points}</span>
            <span className="gallery-card__points-label">pts</span>
          </div>
        </div>
        <div className="gallery-card__event">{submission.eventName}</div>
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function GalleryModal({ submission, onClose }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const url = `${window.location.origin}/gallery/${submission.id}`;
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

  const gradient = CATEGORY_GRADIENTS[submission.category] || ["#1a0510", "#2d0a1e", "#C41262"];

  return (
    <div className="gallery-modal__backdrop" onClick={onClose}>
      <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Left: full image ── */}
        <div
          className="gallery-modal__image-panel"
          style={{ background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})` }}
        >
          <div className="gallery-modal__img-placeholder">
            <svg width="56" height="56" viewBox="0 0 24 24" fill={gradient[2] + "44"}>
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <span>image coming soon</span>
          </div>
          {submission.rank === 1 && (
            <div className="gallery-modal__top-badge">✦ Top Entry</div>
          )}
          <div className="gallery-modal__cat-pill">{submission.category}</div>
        </div>

        {/* ── Right: details panel ── */}
        <div className="gallery-modal__panel">
          <button className="gallery-modal__close" onClick={onClose}>✕</button>
          <div className="gallery-modal__panel-scroll">

            <h2 className="gallery-modal__title">{submission.title}</h2>

            <div className="gallery-modal__author-row">
              <div className="gallery-modal__avatar">
                {submission.studentName.charAt(0)}
              </div>
              <div>
                <div className="gallery-modal__author-name">{submission.studentName}</div>
                <div className="gallery-modal__author-event">{submission.eventName}</div>
              </div>
            </div>

            <p className="gallery-modal__description">{submission.description}</p>

            {/* Stat widgets */}
            <div className="gallery-modal__widgets">
              <div className="gallery-modal__widget gallery-modal__widget--points">
                <div className="gallery-modal__widget-icon">
                  <Lightning size={18} weight="fill" color="#FE4081" />
                </div>
                <div className="gallery-modal__widget-text">
                  <span className="gallery-modal__widget-value">{submission.points}</span>
                  <span className="gallery-modal__widget-label">Points Earned</span>
                </div>
              </div>
              <div className="gallery-modal__widget gallery-modal__widget--rank">
                <div className="gallery-modal__widget-icon">
                  <Trophy size={18} weight="fill" color="#FFB800" />
                </div>
                <div className="gallery-modal__widget-text">
                  <span className="gallery-modal__widget-value">#{submission.rank}</span>
                  <span className="gallery-modal__widget-label">Event Rank</span>
                </div>
              </div>
              <div className="gallery-modal__widget gallery-modal__widget--status">
                <div className="gallery-modal__widget-icon">
                  <CheckCircle size={18} weight="fill" color="#10e266" />
                </div>
                <div className="gallery-modal__widget-text">
                  <span className="gallery-modal__widget-value">{submission.status}</span>
                  <span className="gallery-modal__widget-label">Review Status</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="gallery-modal__actions">
              <button
                className={`gallery-modal__action-btn gallery-modal__action-btn--like ${liked ? "gallery-modal__action-btn--active" : ""}`}
                onClick={() => setLiked(!liked)}
              >
                <Heart size={14} weight={liked ? "fill" : "regular"} />
                {liked ? "Liked" : "Like"}
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

            {/* Copied toast */}
            {copied && (
              <div className="gallery-modal__toast">
                Link copied to clipboard ✓
              </div>
            )}

            <div className="gallery-modal__date">
              Submitted {new Date(submission.timeStamp).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Gallery Page ────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [submissions] = useState(MOCK_SUBMISSIONS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let result = [...submissions];

    if (activeCategory !== "All") {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.studentName.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.eventName.toLowerCase().includes(q)
      );
    }

    if (sortBy === "newest") result.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
    if (sortBy === "points") result.sort((a, b) => b.points - a.points);
    if (sortBy === "rank") result.sort((a, b) => a.rank - b.rank);

    return result;
  }, [submissions, activeCategory, sortBy, search]);

  // Split into 3 columns for masonry
  const columns = [[], [], []];
  filtered.forEach((item, i) => columns[i % 3].push(item));

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
              { value: `${submissions.length}+`, label: "Submissions" },
              { value: "320+", label: "Designers" },
              { value: "48", label: "Events" },
            ].map((s) => (
              <div key={s.label} className="gallery-hero__stat">
                <span className="gallery-hero__stat-value">{s.value}</span>
                <span className="gallery-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

      <div className="gallery-hero__bg-gradient" />
      <div className="gallery-hero__orb" />
      </section>

      {/* ── Filters + Search ── */}
      <div className="gallery-controls">
        <div className="gallery-controls__inner">

          {/* Search */}
          <div className="gallery-search">
            <svg className="gallery-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="gallery-search__input"
              type="text"
              placeholder="Search by title, designer, event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="gallery-search__clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          {/* Category filters */}
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

          {/* Sort + count */}
          <div className="gallery-controls__right">
            <span className="gallery-count">
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </span>
            <select
              className="gallery-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Masonry Grid ── */}
      <div className="gallery-grid">
        <div className="gallery-grid__inner">
          {filtered.length === 0 ? (
            <div className="gallery-empty">
              <div className="gallery-empty__icon">◎</div>
              <p className="gallery-empty__text">No projects match your search.</p>
              <button className="gallery-empty__reset" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="gallery-masonry">
              {columns.map((col, colIdx) => (
                <div key={colIdx} className="gallery-masonry__col">
                  {col.map((submission, cardIdx) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      onClick={setSelectedSubmission}
                      index={colIdx + cardIdx * 3}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {selectedSubmission && (
        <GalleryModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}