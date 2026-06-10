import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getParticipantProfile } from "../../../services/participantService";
import { submissionService } from "../../../services/submissionService";
import { postService } from "../../../services/postManagementService";
import { eventService } from "../../../services/eventService";
import "./ProfilePage.css";

const API_BASE = "http://localhost:5160/api";

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

const STATUS_STYLES = {
  pending:  { color: "#FBBF24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)"  },
  approved: { color: "#22C55E", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)"   },
  rejected: { color: "#F87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
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

// function StatusPill({ status }) {
//   const s = (status || "pending").toLowerCase();
//   const style = STATUS_STYLES[s] || STATUS_STYLES.pending;
//   return (
//     <span className="profile-status-pill" style={{
//       color: style.color,
//       background: style.bg,
//       border: `1px solid ${style.border}`,
//     }}>
//       {s.charAt(0).toUpperCase() + s.slice(1)}
//     </span>
//   );
// }

function SectionTab({ tabs, active, onChange }) {
  return (
    <div className="profile-tabs">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`profile-tab ${active === t.id ? "profile-tab--active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {t.count != null && (
            <span className="profile-tab__count">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, login } = useAuth();

  const [profile,      setProfile]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [visible,      setVisible]      = useState(false);
  const [photo,        setPhoto]        = useState(user?.profileImageUrl || null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Applied events (submissions cross-referenced with events)
  const [submissions,  setSubmissions]  = useState([]);
  const [events,       setEvents]       = useState([]);
  const [subLoading,   setSubLoading]   = useState(true);

  // Library posts
  const [posts,        setPosts]        = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Active section tab
  const [activeTab, setActiveTab] = useState("details");

  const role       = user?.role?.toLowerCase() || "student";
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const userId     = user?.id ?? user?.userId ?? user?.user_id ?? null;
  const studentId  = user?.studentId ?? user?.student_id ?? null;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Fetch base profile
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    if (role === "student") {
      getParticipantProfile(userId)
        .then(setProfile)
        .catch(err => console.warn("Profile fetch failed:", err.message))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId, role]);

  // Fetch submissions + events for applied events section
  useEffect(() => {
    if (!studentId || role !== "student") { setSubLoading(false); return; }

    Promise.all([
      submissionService.getAllSubmissions(),
      eventService.getAllEvents(),
    ])
      .then(([allSubs, allEvents]) => {
        const mine = (allSubs || []).filter(s => s.studentId === studentId || s.StudentId === studentId);
        setSubmissions(mine);
        setEvents(allEvents || []);
      })
      .catch(err => console.warn("Submissions fetch failed:", err.message))
      .finally(() => setSubLoading(false));
  }, [studentId, role]);

  // Fetch library posts
  useEffect(() => {
    if (!studentId || role !== "student") { setPostsLoading(false); return; }

    postService.getAllPosts()
      .then(allPosts => {
        const mine = (allPosts || []).filter(p => p.studentId === studentId || p.StudentId === studentId);
        setPosts(mine);
      })
      .catch(err => console.warn("Posts fetch failed:", err.message))
      .finally(() => setPostsLoading(false));
  }, [studentId, role]);

  // Profile photo upload — Cloudinary then persist to backend
  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setPhotoLoading(true);
    try {
      const { CloudinaryService } = await import("../../../services/CloudinaryService");
      const url = await CloudinaryService.uploadImage(file, "profile_photos");
      if (url && userId) {
        // Persist to backend
        await fetch(`${API_BASE}/User/${userId}/UpdateProfilePicture`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profilePictureLink: url }),
        });
        setPhoto(url);
        login({ ...user, profileImageUrl: url });
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setPhotoLoading(false);
    }
  }

  // Derived display values
  const displayName  = profile?.name || user?.fullname || user?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user?.email || "—";
  const university   = profile?.university || user?.university || null;
  const totalEvents  = profile?.totalEventsJoined ?? null;
  const totalScore   = profile?.totalScore ?? null;
  const recentEvent  = profile?.mostRecentEventTitle || null;
  const recentDate   = profile?.mostRecentEventDate
    ? new Date(profile.mostRecentEventDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const initials = displayName
    .split(" ").map(w => w[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();

  // Build applied events list by joining submissions → events
  const appliedEvents = submissions.map(sub => {
    const ev = events.find(e => e.id === sub.eventId || e.id === sub.EventId);
    return {
      id:        sub.id || sub.Id,
      title:     sub.title || sub.Title || ev?.title || "Untitled submission",
      eventTitle: ev?.title || "—",
      category:  ev?.category || "—",
      status:    sub.status || sub.Status || "pending",
      points:    sub.points ?? sub.Points ?? 0,
      rank:      sub.rank ?? sub.Rank ?? null,
      timestamp: sub.timeStamp || sub.TimeStamp,
      imageLink: ev?.image_link || ev?.imageLink || null,
    };
  });

  const tabs = role === "student" ? [
    { id: "details",  label: "Details"         },
    { id: "events",   label: "Applied Events",  count: appliedEvents.length  },
    { id: "library",  label: "My Library",      count: posts.length          },
  ] : [
    { id: "details",  label: "Details" },
  ];

  return (
    <div className={`profile-page ${visible ? "profile-page--visible" : ""}`}>
      <div className="profile-page__bg" />
      <div className="profile-page__orb" />

      <div className="profile-page__inner">

        {/* ── Header card ── */}
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
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
            </div>

            {/* Name + role */}
            <div className="profile-header__info">
              <h1 className="profile-header__name">{displayName}</h1>
              <p className="profile-header__email">{displayEmail}</p>
              <div className="profile-role-badge" style={{ color: roleConfig.color, background: roleConfig.bg, borderColor: roleConfig.border }}>
                <span>{roleConfig.label}</span>
                <span className="profile-role-badge__dot" />
                <span>{roleConfig.description}</span>
              </div>
            </div>
          </div>

          {/* Stats — students only */}
          {role === "student" && (
            <div className="profile-stats">
              <StatCard value={totalEvents}  label="Events Joined"     accent="#C41262" />
              <StatCard value={totalScore}   label="Total Score"       accent="#FE4081" />
              <StatCard
                value={recentEvent ? recentEvent.split(" ").slice(0, 3).join(" ") + "…" : null}
                label="Most Recent Event"
                accent="#FE7FAB"
              />
            </div>
          )}
        </div>

        {/* ── Tab navigation ── */}
        {role === "student" && (
          <SectionTab tabs={tabs} active={activeTab} onChange={setActiveTab} />
        )}

        {/* ── Details tab ── */}
        {activeTab === "details" && (
          <>
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

            {/* Role-specific cards */}
            {role === "admin" && (
              <div className="profile-card profile-card--role">
                <h2 className="profile-card__title">Admin Access</h2>
                <p className="profile-card__body">
                  You have full platform access including event management, participant oversight, submission review, and leaderboard control.
                </p>
                <a href="/admin" className="profile-card__link" style={{ color: roleConfig.color }}>Go to Admin Dashboard &rarr;</a>
              </div>
            )}
            {role === "judge" && (
              <div className="profile-card profile-card--role">
                <h2 className="profile-card__title">Judge Access</h2>
                <p className="profile-card__body">
                  You have access to score submissions and view participant entries for events you are assigned to.
                </p>
                <a href="/judge" className="profile-card__link" style={{ color: roleConfig.color }}>Go to Judge Dashboard &rarr;</a>
              </div>
            )}
            {role === "student" && (
              <div className="profile-card profile-card--role">
                <h2 className="profile-card__title">Your Activity</h2>
                <p className="profile-card__body">
                  Browse upcoming events, submit your design work, and track your ranking on the leaderboard.
                </p>
                <div className="profile-card__links">
                  <a href="/events"  className="profile-card__link" style={{ color: roleConfig.color }}>Browse Events &rarr;</a>
                  <a href="/gallery" className="profile-card__link" style={{ color: roleConfig.color }}>View Gallery &rarr;</a>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Applied Events tab ── */}
        {activeTab === "events" && (
          <div className="profile-card">
            <h2 className="profile-card__title">Applied Events</h2>
            {subLoading ? (
              <div className="profile-loading">
                <div className="profile-loading__spinner" />
                <span>Loading submissions...</span>
              </div>
            ) : appliedEvents.length === 0 ? (
              <div className="profile-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <p>You haven't applied to any events yet.</p>
                <a href="/events" className="profile-empty__cta">Browse events</a>
              </div>
            ) : (
              <div className="profile-event-list">
                {appliedEvents.map(ev => (
                  <div key={ev.id} className="profile-event-row">
                    {/* Image or placeholder */}
                    <div className="profile-event-row__img">
                      {ev.imageLink
                        ? <img src={ev.imageLink} alt={ev.eventTitle} />
                        : <div className="profile-event-row__img-placeholder">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FE4081">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                          </div>
                      }
                    </div>

                    <div className="profile-event-row__body">
                      <div className="profile-event-row__top">
                        <span className="profile-event-row__category">{ev.category}</span>
                        {/* <StatusPill status={ev.status} /> */}
                      </div>
                      <p className="profile-event-row__title">{ev.eventTitle}</p>
                      <p className="profile-event-row__subtitle">{ev.title}</p>
                    </div>

                    <div className="profile-event-row__meta">
                      {ev.points > 0 && (
                        <div className="profile-event-row__pts">
                          <span className="profile-event-row__pts-value">{ev.points}</span>
                          <span className="profile-event-row__pts-label">pts</span>
                        </div>
                      )}
                      {ev.rank && (
                        <div className="profile-event-row__rank">#{ev.rank}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Library tab ── */}
        {activeTab === "library" && (
          <div className="profile-card">
            <h2 className="profile-card__title">My Library</h2>
            {postsLoading ? (
              <div className="profile-loading">
                <div className="profile-loading__spinner" />
                <span>Loading posts...</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="profile-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                </svg>
                <p>No posts in your library yet.</p>
                <a href="/gallery" className="profile-empty__cta">Go to gallery</a>
              </div>
            ) : (
              <div className="profile-library-grid">
                {posts.map(post => (
                  <div key={post.id || post.Id} className="profile-library-card">
                    <div className="profile-library-card__image">
                      {post.imageFileLink || post.ImageFileLink
                        ? <img src={post.imageFileLink || post.ImageFileLink} alt={post.title || post.Title} />
                        : <div className="profile-library-card__img-placeholder">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FE4081">
                              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                          </div>
                      }
                    </div>
                    <div className="profile-library-card__body">
                      <p className="profile-library-card__category">{post.category || post.Category || "Post"}</p>
                      <p className="profile-library-card__title">{post.title || post.Title}</p>
                      {(post.description || post.Description) && (
                        <p className="profile-library-card__desc">{post.description || post.Description}</p>
                      )}
                      <div className="profile-library-card__footer">
                        <span className="profile-library-card__stat">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          {post.commentCount ?? post.CommentCount ?? 0}
                        </span>
                        <span className="profile-library-card__stat">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          {post.linkCount ?? post.LinkCount ?? 0}
                        </span>
                        {(post.postDate || post.PostDate) && (
                          <span className="profile-library-card__date">
                            {new Date(post.postDate || post.PostDate).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}