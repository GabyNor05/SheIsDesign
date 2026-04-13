// ─────────────────────────────────────────────────────────────────────────────
// SignupBasicPage.jsx — SheIsDesign sign up (basic details)
// Left: floating wireframe gallery panel (API-ready, currently wireframe)
// Right: Name / Email / Password signup form
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiImage, FiUser, FiMail } from "react-icons/fi";
import { MdArrowForward, MdPersonAdd } from "react-icons/md";
import { Field, PasswordField, OrDivider, GoogleButton } from "../../../components/ui/Fields/Field/Field";
import "./SignupBasicPage.css";

// ─────────────────────────────────────────────────────────────────────────────
// DUMMY DATA — replace with galleryService.getFeatured()
// ERD Table: Post (joined with Mentee)
// Fields: PostID, title, image_file_link, category, menteeID → Mentee.fullname
// ─────────────────────────────────────────────────────────────────────────────
const galleryItems = [
  { id: 1, title: "Brand Identity — Flourish Co.", designer: "By Designer Name", tall: true },
  { id: 2, title: "UX Case Study — ReLeaf App",    designer: "By Designer Name", tall: false },
  { id: 3, title: "Event Poster — Design Week",    designer: "By Designer Name", tall: false },
  { id: 4, title: "Typography Series",             designer: "By Designer Name", tall: true },
  { id: 5, title: "Logo System — Noire Studio",    designer: "By Designer Name", tall: false },
  { id: 6, title: "Editorial Spread — Zine Vol.2", designer: "By Designer Name", tall: false },
];

// ── Single wireframe gallery card ─────────────────────────────────────────────
function GalleryCard({ title, designer, tall, delay = 0 }) {
  return (
    <div
      className="sgp-card"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Image placeholder — swap for <img src={item.image_file_link} /> */}
      <div className={`sgp-card__image ${tall ? "sgp-card__image--tall" : "sgp-card__image--short"}`}>
        <div className="sgp-card__image-glow" />
        <div className="sgp-card__image-icon">
          <FiImage size={18} color="rgba(196,18,98,0.45)" />
        </div>
        {/* ERD: Post.category */}
        <span className="sgp-card__image-label">Project Image</span>
      </div>

      {/* Meta */}
      <div className="sgp-card__meta">
        {/* ERD: Post.title */}
        <span className="sgp-card__title">{title}</span>
        <div className="sgp-card__designer-row">
          <FiUser size={11} color="rgba(248,235,237,0.25)" />
          {/* ERD: Mentee.fullname via Post.menteeID */}
          <span className="sgp-card__designer">{designer}</span>
        </div>
      </div>
    </div>
  );
}

// ── Left gallery panel ────────────────────────────────────────────────────────
function GalleryPanel() {
  return (
    <div className="sgp-gallery">
      {/* Glow blobs */}
      <div className="sgp-gallery__glow sgp-gallery__glow--1" />
      <div className="sgp-gallery__glow sgp-gallery__glow--2" />

      {/* Dot grid */}
      <div className="sgp-gallery__dots" />


      {/* Headline over the grid */}
      <div className="sgp-gallery__headline">
        <h2 className="sgp-gallery__heading">
          See what our<br />
          <span className="sgp-gallery__heading-gradient">designers create.</span>
        </h2>
        <p className="sgp-gallery__subtext">
          Join 1,200+ women shaping the future of design in South Africa.
        </p>
      </div>

      {/* Masonry grid
          TODO: replace galleryItems with galleryService.getFeatured()
          ERD: SELECT Post.PostID, Post.title, Post.image_file_link,
                      Mentee.fullname FROM Post
               JOIN Mentee ON Post.menteeID = Mentee.MenteeID
               WHERE Post.status = 'featured' LIMIT 6
      */}
      <div className="sgp-masonry">
        <div className="sgp-masonry__col">
          <GalleryCard {...galleryItems[0]} delay={0.05} />
          <GalleryCard {...galleryItems[4]} delay={0.2} />
        </div>
        <div className="sgp-masonry__col">
          <GalleryCard {...galleryItems[1]} delay={0.1} />
          <GalleryCard {...galleryItems[2]} delay={0.25} />
        </div>
        <div className="sgp-masonry__col">
          <GalleryCard {...galleryItems[5]} delay={0.15} />
          <GalleryCard {...galleryItems[3]} delay={0.3} />
        </div>
      </div>

      {/* Bottom fade mask */}
      <div className="sgp-gallery__fade-mask" />

      {/* Bottom glow line */}
      <div className="sgp-gallery__glow-line" />
    </div>
  );
}

// ── Right signup form ─────────────────────────────────────────────────────────
function SignupForm() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");

function handleSubmit(e) {
    e.preventDefault();
    // TODO: POST /api/auth/register → creates User + Mentee records
    // ERD: User { email, password, role } + Mentee { fullname, userID FK }
    navigate("/signup/details", { state: { firstName, email } });
  }

  return (
    <div className="sgp-form-panel">
      <div className="sgp-form-panel__glow" />

      <div className="sgp-form-card">
        <div className="sgp-form-card__glow-line" />

        {/* Header */}
        <div className="sgp-form-card__header">
          <div className="sgp-form-card__eyebrow">
            <div className="sgp-form-card__eyebrow-dot" />
            <span>Create your account</span>
          </div>
          <h1 className="sgp-form-card__heading">Join SheIsDesign</h1>
          {/* <p className="sgp-form-card__subtext">
            It only takes a minute.
          </p> */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="sgp-form-card__form">
          {/* Name row */}
          <div className="sgp-form-card__name-row">
            <Field
              label="First Name"
              name="firstName"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Field
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <Field
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@university.ac.za"
            icon={FiMail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordField
            label="Password"
            placeholder="Create a password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="sgp-form-card__submit">
            <MdPersonAdd size={18} />
            Sign Up
          </button>
        </form>

        <OrDivider />
        <GoogleButton label="Sign up with Google" />

        {/* Login link */}
        <p className="sgp-form-card__switch">
          Already have an account?{" "}
          <Link to="/login" className="sgp-form-card__switch-link">
            Log in
            <MdArrowForward size={13} />
          </Link>
        </p>

        {/* Terms note */}
        <p className="sgp-form-card__terms">
          By signing up you agree to our{" "}
          <a href="/terms" className="sgp-form-card__terms-link">Terms of Service</a>{" "}
          and{" "}
          <a href="/privacy" className="sgp-form-card__terms-link">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────
export default function SignupBasicPage() {
  return (
    <div className="sgp-root">
      <GalleryPanel />
      <SignupForm />
    </div>
  );
}