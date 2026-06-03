import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getParticipantProfile } from "../../../services/participantService";
import "./ProfilePage.css";

const ROLE_CONFIG = {
  student: {
    label: "Student",
    color: "#C41262",
    bg: "rgba(196,18,98,0.12)",
    border: "rgba(196,18,98,0.3)",
    description: "Design participant",
  },
  judge: {
    label: "Judge",
    color: "#FFB800",
    bg: "rgba(255,184,0,0.1)",
    border: "rgba(255,184,0,0.3)",
    description: "Industry professional",
  },
  admin: {
    label: "Admin",
    color: "#10e266",
    bg: "rgba(16,226,102,0.1)",
    border: "rgba(16,226,102,0.3)",
    description: "Platform administrator",
  },
};

const INFO_ICONS = {
  email: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  university: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  role: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  event: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  date: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
};

function StatCard({ value, label, accent }) {
  return (
    <div className="profile-stat" style={{ "--accent": accent }}>
      <span className="profile-stat__value">{value ?? "—"}</span>
      <span className="profile-stat__label">{label}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="profile-info-row">
      <span className="profile-info-row__icon">{icon}</span>
      <div className="profile-info-row__text">
        <span className="profile-info-row__label">{label}</span>
        <span className="profile-info-row__value">{value}</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [photo, setPhoto] = useState(user?.profileImageUrl || null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef(null);

  const role = user?.role?.toLowerCase() || "student";
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const userId = user?.id ?? user?.userId ?? user?.user_id ?? null;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    if (role === "student") {
      getParticipantProfile(userId)
        .then(setProfile)
        .catch((err) => console.warn("Profile fetch failed:", err.message))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId, role]);

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setPhotoLoading(true);
    try {
      const { CloudinaryService } = await import("../../../services/CloudinaryService");
      const url = await CloudinaryService.uploadImage(file, "profile_photos");
      if (url) {
        setPhoto(url);
        login({ ...user, profileImageUrl: url });
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setPhotoLoading(false);
    }
  }

  const displayName =
    profile?.name || user?.fullname || user?.name ||
    user?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user?.email || "—";
  const university = profile?.university || user?.university || null;
  const totalEvents = profile?.totalEventsJoined ?? null;
  const totalScore = profile?.totalScore ?? null;
  const recentEvent = profile?.mostRecentEventTitle || null;
  const recentDate = profile?.mostRecentEventDate
    ? new Date(profile.mostRecentEventDate).toLocaleDateString("en-ZA", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`profile-page ${visible ? "profile-page--visible" : ""}`}>
      <div className="profile-page__bg" />
      <div className="profile-page__orb" />

      <div className="profile-page__inner">

        {/* Header card */}
        <div className="profile-card profile-card--header">
          <div className="profile-card__accent-line" style={{ background: roleConfig.color }} />

          <div className="profile-header">
            {/* Avatar */}
            <div className="profile-avatar">
              {photo ? (
                <img src={photo} alt={displayName} className="profile-avatar__photo" />
              ) : (
                <span className="profile-avatar__initials">{initials}</span>
              )}
              <div className="profile-avatar__ring" />
              <button
                className="profile-avatar__upload-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Change profile photo"
                disabled={photoLoading}
              >
                {photoLoading ? (
                  <div className="profile-avatar__upload-spinner" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </div>

            {/* Name + role */}
            <div className="profile-header__info">
              <h1 className="profile-header__name">{displayName}</h1>
              <p className="profile-header__email">{displayEmail}</p>
              <div
                className="profile-role-badge"
                style={{
                  color: roleConfig.color,
                  background: roleConfig.bg,
                  borderColor: roleConfig.border,
                }}
              >
                <span>{roleConfig.label}</span>
                <span className="profile-role-badge__dot" />
                <span>{roleConfig.description}</span>
              </div>
            </div>
          </div>

          {/* Stats — students only */}
          {role === "student" && (
            <div className="profile-stats">
              <StatCard value={totalEvents} label="Events Joined" accent="#C41262" />
              <StatCard value={totalScore} label="Total Score" accent="#FE4081" />
              <StatCard
                value={recentEvent ? recentEvent.split(" ").slice(0, 3).join(" ") + "…" : null}
                label="Most Recent Event"
                accent="#FE7FAB"
              />
            </div>
          )}
        </div>

        {/* Details card */}
        <div className="profile-card">
          <h2 className="profile-card__title">Account Details</h2>
          {loading ? (
            <div className="profile-loading">
              <div className="profile-loading__spinner" />
              <span>Loading profile...</span>
            </div>
          ) : (
            <div className="profile-info-list">
              <InfoRow icon={INFO_ICONS.email}      label="Email address"     value={displayEmail} />
              <InfoRow icon={INFO_ICONS.university} label="University"        value={university} />
              <InfoRow icon={INFO_ICONS.role}       label="Role"              value={roleConfig.label} />
              <InfoRow icon={INFO_ICONS.event}      label="Most recent event" value={recentEvent} />
              <InfoRow icon={INFO_ICONS.date}       label="Event date"        value={recentDate} />
            </div>
          )}
        </div>

        {/* Admin card */}
        {role === "admin" && (
          <div className="profile-card profile-card--role">
            <h2 className="profile-card__title">Admin Access</h2>
            <p className="profile-card__body">
              You have full platform access including event management, participant oversight, submission review, and leaderboard control.
            </p>
            <a href="/admin" className="profile-card__link" style={{ color: roleConfig.color }}>
              Go to Admin Dashboard &rarr;
            </a>
          </div>
        )}

        {/* Judge card */}
        {role === "judge" && (
          <div className="profile-card profile-card--role">
            <h2 className="profile-card__title">Judge Access</h2>
            <p className="profile-card__body">
              You have access to score submissions and view participant entries for events you are assigned to.
            </p>
            <a href="/judge" className="profile-card__link" style={{ color: roleConfig.color }}>
              Go to Judge Dashboard &rarr;
            </a>
          </div>
        )}

        {/* Student card */}
        {role === "student" && (
          <div className="profile-card profile-card--role">
            <h2 className="profile-card__title">Your Activity</h2>
            <p className="profile-card__body">
              Browse upcoming events, submit your design work, and track your ranking on the leaderboard.
            </p>
            <div className="profile-card__links">
              <a href="/events" className="profile-card__link" style={{ color: roleConfig.color }}>
                Browse Events &rarr;
              </a>
              <a href="/gallery" className="profile-card__link" style={{ color: roleConfig.color }}>
                View Gallery &rarr;
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}