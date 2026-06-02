import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

import { getParticipantProfile } from "../../../services/participantService";
import "./ProfilePage.css";

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  student: {
    label: "Student",
    color: "#C41262",
    bg: "rgba(196,18,98,0.12)",
    border: "rgba(196,18,98,0.3)",
    icon: "🎓",
    description: "Design participant",
  },
  judge: {
    label: "Judge",
    color: "#FFB800",
    bg: "rgba(255,184,0,0.1)",
    border: "rgba(255,184,0,0.3)",
    icon: "⚖️",
    description: "Industry professional",
  },
  admin: {
    label: "Admin",
    color: "#10e266",
    bg: "rgba(16,226,102,0.1)",
    border: "rgba(16,226,102,0.3)",
    icon: "🛡️",
    description: "Platform administrator",
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, accent }) {
  return (
    <div className="profile-stat" style={{ "--accent": accent }}>
      <span className="profile-stat__value">{value ?? "—"}</span>
      <span className="profile-stat__label">{label}</span>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
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

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  const role = user?.roles?.toLowerCase() || user?.role?.toLowerCase() || "student";
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.student;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    // Only fetch participant profile for students
    if (role === "student") {
      getParticipantProfile(user.id)
        .then(setProfile)
        .catch(() => setError("Could not load profile details"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, role]);

  // Derive display values — prefer backend profile, fall back to auth user
  const displayName = profile?.name || user?.fullname || user?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user?.email || "—";
  const university = profile?.university || user?.university || null;
  const totalEvents = profile?.totalEventsJoined ?? null;
  const totalScore = profile?.totalScore ?? null;
  const recentEvent = profile?.mostRecentEventTitle || null;
  const recentDate = profile?.mostRecentEventDate
    ? new Date(profile.mostRecentEventDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
    : null;

  // Avatar initials
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`profile-page ${visible ? "profile-page--visible" : ""}`}>

      {/* ── Background ── */}
      <div className="profile-page__bg" />
      <div className="profile-page__orb" />

      <div className="profile-page__inner">

        {/* ── Header card ── */}
        <div className="profile-card profile-card--header">

          {/* Top accent line */}
          <div className="profile-card__accent-line" style={{ background: roleConfig.color }} />

          <div className="profile-header">
            {/* Avatar */}
            <div className="profile-avatar">
              <span className="profile-avatar__initials">{initials}</span>
              <div className="profile-avatar__ring" />
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
                <span>{roleConfig.icon}</span>
                <span>{roleConfig.label}</span>
                <span className="profile-role-badge__dot" />
                <span>{roleConfig.description}</span>
              </div>
            </div>
          </div>

          {/* Stats row — students only */}
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

        {/* ── Details card ── */}
        <div className="profile-card">
          <h2 className="profile-card__title">Account Details</h2>

          {loading ? (
            <div className="profile-loading">
              <div className="profile-loading__spinner" />
              <span>Loading profile…</span>
            </div>
          ) : error ? (
            <div className="profile-error">{error}</div>
          ) : (
            <div className="profile-info-list">
              <InfoRow icon="✉️" label="Email address" value={displayEmail} />
              <InfoRow icon="🎓" label="University" value={university} />
              <InfoRow icon="🏷️" label="Role" value={roleConfig.label} />
              <InfoRow icon="🕐" label="Most recent event" value={recentEvent} />
              <InfoRow icon="📅" label="Event date" value={recentDate} />
            </div>
          )}
        </div>

        {/* ── Role-specific info card ── */}
        {role === "admin" && (
          <div className="profile-card profile-card--role">
            <h2 className="profile-card__title">Admin Access</h2>
            <p className="profile-card__body">
              You have full platform access including event management, participant oversight, submission review, and leaderboard control.
            </p>
            <a href="/admin" className="profile-card__link" style={{ color: roleConfig.color }}>
              Go to Admin Dashboard →
            </a>
          </div>
        )}

        {role === "judge" && (
          <div className="profile-card profile-card--role">
            <h2 className="profile-card__title">Judge Access</h2>
            <p className="profile-card__body">
              You have access to score submissions and view participant entries for events you are assigned to.
            </p>
            <a href="/judge" className="profile-card__link" style={{ color: roleConfig.color }}>
              Go to Judge Dashboard →
            </a>
          </div>
        )}

        {role === "student" && (
          <div className="profile-card profile-card--role">
            <h2 className="profile-card__title">Your Activity</h2>
            <p className="profile-card__body">
              Browse upcoming events, submit your design work, and track your ranking on the leaderboard.
            </p>
            <div className="profile-card__links">
              <a href="/events" className="profile-card__link" style={{ color: roleConfig.color }}>
                Browse Events →
              </a>
              <a href="/gallery" className="profile-card__link" style={{ color: roleConfig.color }}>
                View Gallery →
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}