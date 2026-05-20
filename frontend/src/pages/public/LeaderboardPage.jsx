import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Medal,
  Star,
  TrendUp,
  Users,
  Lightning,
  Crown,
} from "@phosphor-icons/react";
import { fetchLeaderboard } from "../../services/leaderboardService";
import "./LeaderboardPage.css";

// Fallback data shown if the API call fails or returns nothing
const DUMMY = [
  { rank: 1,  fullname: "Priya Shankar",    event: "UX Redesign Sprint",            category: "UX / Product Design",  university: "UCT",          points: 980 },
  { rank: 2,  fullname: "Maya Osei",        event: "Brand Identity Challenge 2026",  category: "Brand Identity",        university: "Wits",         points: 945 },
  { rank: 3,  fullname: "Fatima Al-Hassan", event: "Typography & Layout Sprint",     category: "Editorial Design",      university: "CPUT",         points: 912 },
  { rank: 4,  fullname: "Zoe Müller",       event: "Packaging Design Brief",         category: "Print & Packaging",     university: "Stellenbosch", points: 874 },
  { rank: 5,  fullname: "Amara Diallo",     event: "Motion & Animation Challenge",   category: "Motion Design",         university: "DUT",          points: 860 },
  { rank: 6,  fullname: "Laila Nkosi",      event: "Poster Design Open",             category: "Graphic Design",        university: "UJ",           points: 843, isCurrentUser: true },
  { rank: 7,  fullname: "Nina Ferreira",    event: "Social Media Kit Open",          category: "Brand / Marketing",     university: "UKZN",         points: 821 },
  { rank: 8,  fullname: "Chidi Eze",        event: "App Icon Design Challenge",      category: "UI Design",             university: "UPR",          points: 798 },
  { rank: 9,  fullname: "Sasha Kim",        event: "Typography & Layout Sprint",     category: "Graphic Design",        university: "Rhodes",       points: 774 },
  { rank: 10, fullname: "Ines Rodrigues",   event: "Brand Identity Challenge 2026",  category: "Brand Identity",        university: "Unisa",        points: 751 },
  { rank: 11, fullname: "Aisha Mensah",     event: "UX Redesign Sprint",             category: "UX / Product Design",   university: "UCT",          points: 728 },
  { rank: 12, fullname: "Yuki Tanaka",      event: "Motion & Animation Challenge",   category: "Motion Design",         university: "TUT",          points: 705 },
  { rank: 13, fullname: "Sofia Papadaki",   event: "Poster Design Open",             category: "Graphic Design",        university: "NWU",          points: 689 },
  { rank: 14, fullname: "Camille Dubois",   event: "Packaging Design Brief",         category: "Print & Packaging",     university: "UFS",          points: 667 },
  { rank: 15, fullname: "Rania Khalil",     event: "App Icon Design Challenge",      category: "UI Design",             university: "Wits",         points: 644 },
];

// Returns the first two initials of a full name in uppercase
function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Converts a name into a consistent hue value so each person always gets the same avatar colour
function avatarHue(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

// Renders one of the three podium cards (1st, 2nd, 3rd place)
// position is "left" (rank 2), "center" (rank 1), or "right" (rank 3)
function PodiumCard({ entry, position }) {
  const isCenter = position === "center";
  const hue = avatarHue(entry.fullname);

  // Pick the right icon and colour for each rank
  const rankIcon =
    entry.rank === 1 ? <Crown size={isCenter ? 22 : 18} weight="fill" color="#FFD700" /> :
    entry.rank === 2 ? <Medal size={18} weight="fill" color="#C0C0C0" /> :
                       <Trophy size={16} weight="fill" color="#CD7F32" />;

  return (
    <div className={`lb-podium-card lb-podium-card--${position}`}>
      {/* Glow effect only shown behind the 1st place card */}
      {isCenter && <div className="lb-podium-card__glow" />}

      {/* Rank icon and number */}
      <div className="lb-podium-card__rank-badge">
        {rankIcon}
        <span className="lb-podium-card__rank-num">{entry.rank}</span>
      </div>

      {/* Avatar circle with a colour derived from the person's name */}
      <div
        className="lb-podium-card__avatar"
        style={{
          background: `linear-gradient(135deg, hsl(${hue},55%,28%), hsl(${hue},65%,18%))`,
          borderColor: `hsl(${hue},50%,38%)`
        }}
      >
        <span className="lb-podium-card__initials">{initials(entry.fullname)}</span>
      </div>

      {/* Name, design category, and university */}
      <div className="lb-podium-card__info">
        <span className="lb-podium-card__name">{entry.fullname}</span>
        <span className="lb-podium-card__category">{entry.category}</span>
        {entry.university && (
          <span className="lb-podium-card__university">{entry.university}</span>
        )}
      </div>

      {/* Total points */}
      <div className="lb-podium-card__points-wrap">
        <span className="lb-podium-card__points">{entry.points.toLocaleString()}</span>
        <span className="lb-podium-card__pts-label">pts</span>
      </div>

      {/* Coloured base bar at the bottom, taller for higher ranks */}
      <div className={`lb-podium-card__base lb-podium-card__base--${position}`}>
        <span className="lb-podium-card__base-rank">{entry.rank}</span>
      </div>
    </div>
  );
}

// Renders a single row in the full rankings table
// animationDelay staggers the slide-in so rows appear one after another
function TableRow({ entry, index, isCurrentUser }) {
  const hue = avatarHue(entry.fullname);

  return (
    <div
      className={`lb-row ${isCurrentUser ? "lb-row--you" : ""}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Rank number */}
      <div className="lb-row__rank">
        <span className="lb-row__rank-num">{entry.rank}</span>
      </div>

      {/* Avatar + name + university */}
      <div className="lb-row__student">
        <div
          className="lb-row__avatar"
          style={{
            background: `linear-gradient(135deg, hsl(${hue},55%,28%), hsl(${hue},65%,18%))`,
            borderColor: `hsl(${hue},45%,35%)`
          }}
        >
          <span>{initials(entry.fullname)}</span>
        </div>
        <div className="lb-row__student-info">
          <span className="lb-row__name">
            {entry.fullname}
            {/* "You" badge only shown on the current user's row */}
            {isCurrentUser && <span className="lb-row__you-badge">You</span>}
          </span>
          {entry.university && (
            <span className="lb-row__university">{entry.university}</span>
          )}
        </div>
      </div>

      {/* Event name and design category */}
      <div className="lb-row__event">
        <span>{entry.event}</span>
        <span className="lb-row__category">{entry.category}</span>
      </div>

      {/* Points value */}
      <div className="lb-row__points">
        <span className="lb-row__points-val">{entry.points.toLocaleString()}</span>
        <span className="lb-row__pts">pts</span>
      </div>
    </div>
  );
}

// Placeholder row shown while leaderboard data is loading
function SkeletonRow() {
  return (
    <div className="lb-row lb-skeleton">
      <div className="lb-sk lb-sk--rank" />
      <div className="lb-sk lb-sk--avatar" />
      <div className="lb-sk lb-sk--name" />
      <div className="lb-sk lb-sk--event" />
      <div className="lb-sk lb-sk--pts" />
    </div>
  );
}

// Static content for the "How it works" explainer cards
const HOW_ITEMS = [
  { icon: <Lightning size={18} weight="fill" />, step: "01", title: "Enter an event",    body: "Every event you join earns base participation points — just showing up counts." },
  { icon: <Star size={18} weight="fill" />,      step: "02", title: "Compete & place",   body: "Strong submissions and community recognition earn bonus points. Top 3 placements carry serious weight." },
  { icon: <TrendUp size={18} weight="fill" />,   step: "03", title: "Stay consistent",   body: "Points compound across the full season. Regular participation beats single-event spikes." },
  { icon: <Users size={18} weight="fill" />,     step: "04", title: "Gain visibility",   body: "Top-ranked students get featured to industry sponsors and unlock mentorship access curated by SheisDesign." },
];

// Main leaderboard page
export default function LeaderboardPage() {
  const [entries, setEntries]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [usingDummy, setUsingDummy] = useState(false);

  // Fetch leaderboard data on mount, fall back to dummy data if it fails
  useEffect(() => {
    fetchLeaderboard()
      .then((data) => {
        if (data && data.length > 0) {
          setEntries(data);
        } else {
          setEntries(DUMMY);
          setUsingDummy(true);
        }
      })
      .catch(() => {
        setEntries(DUMMY);
        setUsingDummy(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  // Reorder top 3 so 2nd is on the left, 1st is in the centre, 3rd is on the right
  const podiumOrder = top3.length === 3
    ? [
        { entry: top3[1], pos: "left"   },
        { entry: top3[0], pos: "center" },
        { entry: top3[2], pos: "right"  },
      ]
    : top3.map((e, i) => ({ entry: e, pos: i === 0 ? "center" : i === 1 ? "left" : "right" }));

  return (
    <div className="lb-page">

      {/* Background ambient glow blobs */}
      <div className="lb-glow lb-glow--top-left" />
      <div className="lb-glow lb-glow--mid-right" />

      {/* Header: title, subtitle, and season stats */}
      <header className="lb-header">
        <div className="lb-header__bg-gradient" />
        <div className="lb-header__orb" />
        <div className="lb-header__orb2" />
        <div className="lb-header__inner">
          <div className="lb-header__body">

            {/* Left side: pill label, title, description */}
            <div className="lb-header__left">
              <div className="lb-header__pill">
                <Trophy size={11} weight="fill" color="#FE4081" />
                <span>Season 2026</span>
              </div>
              <h1 className="lb-header__title">Leaderboard</h1>
              <p className="lb-header__sub">
                See who's rising to the top. Points update after every event — compete, place, and get noticed by industry.
              </p>
            </div>

            {/* Right side: participant count, events hosted, current season */}
            <div className="lb-header__stats">
              {[
                { value: usingDummy || loading ? "1,200+" : `${entries.length}`, label: "Participants"   },
                { value: "48",          label: "Events hosted"  },
                { value: "Season 2026", label: "Current season" },
              ].map((s) => (
                <div key={s.label} className="lb-stat">
                  <span className="lb-stat__value">{s.value}</span>
                  <span className="lb-stat__label">{s.label}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* Podium section: top 3 displayed as visual podium cards */}
      <section className="lb-podium-section">
        <div className="lb-podium-section__inner">
          <div className="lb-section-label">
            <Crown size={13} weight="fill" color="#FE4081" />
            <span>Top performers</span>
          </div>

          {/* Show skeleton blocks while loading, real cards once ready */}
          {loading ? (
            <div className="lb-podium-skeleton">
              {[0, 1, 2].map((i) => <div key={i} className="lb-podium-sk" />)}
            </div>
          ) : (
            <div className="lb-podium">
              {podiumOrder.map(({ entry, pos }) => (
                <PodiumCard key={entry.rank} entry={entry} position={pos} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Full rankings table: all entries including top 3 */}
      <section className="lb-table-section">
        <div className="lb-table-section__inner">
          <div className="lb-table-header">
            <div className="lb-section-label">
              <Star size={13} weight="fill" color="#FE4081" />
              <span>Full rankings</span>
            </div>
            <span className="lb-table-count">
              Showing {loading ? "—" : entries.length} participants
            </span>
          </div>

          {/* Column heading labels */}
          <div className="lb-table-cols">
            <span>Rank</span>
            <span>Student</span>
            <span>Event / Discipline</span>
            <span>Points</span>
          </div>

          {/* Top 3 also appear in the table above the divider */}
          {!loading && top3.map((entry, i) => (
            <TableRow
              key={entry.rank}
              entry={entry}
              index={i}
              isCurrentUser={!!entry.isCurrentUser}
            />
          ))}

          {/* Visual divider between top 3 and the rest */}
          {!loading && <div className="lb-table-divider" />}

          {/* Ranks 4 and below, or skeleton rows while loading */}
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            : rest.map((entry, i) => (
                <TableRow
                  key={entry.rank}
                  entry={entry}
                  index={i + 3}
                  isCurrentUser={!!entry.isCurrentUser}
                />
              ))
          }
        </div>
      </section>

      {/* How it works section: scoring system explainer */}
      <section className="lb-how-section">
        <div className="lb-how-section__inner">
          <div className="lb-how-header">
            <div className="lb-section-label">
              <TrendUp size={13} weight="fill" color="#FE4081" />
              <span>Scoring system</span>
            </div>
            <h2 className="lb-how-title">
              How rankings <span className="lb-how-title--accent">work</span>
            </h2>
            <p className="lb-how-sub">
              Points are awarded for event participation and competition performance. The top-ranked students gain visibility with industry sponsors.
            </p>
          </div>

          {/* Four step cards explaining the scoring process */}
          <div className="lb-how-grid">
            {HOW_ITEMS.map((item) => (
              <div key={item.step} className="lb-how-card">
                <div className="lb-how-card__top">
                  <div className="lb-how-card__icon">{item.icon}</div>
                  <span className="lb-how-card__step">{item.step}</span>
                </div>
                <span className="lb-how-card__title">{item.title}</span>
                <p className="lb-how-card__body">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Points breakdown table showing base and bonus points per action */}
          <div className="lb-pts-table">
            <div className="lb-pts-table__head">
              {["Action", "Base Points", "Bonus Points"].map((col) => (
                <span key={col}>{col}</span>
              ))}
            </div>
            {[
              { action: "Event Participation",  base: "+50 pts",  bonus: "—"        },
              { action: "Submission Accepted",   base: "+100 pts", bonus: "—"        },
              { action: "Community Pick Award",  base: "+100 pts", bonus: "+75 pts"  },
              { action: "Top Entry Award",       base: "+100 pts", bonus: "+150 pts" },
              { action: "1st Place Finish",      base: "+100 pts", bonus: "+300 pts" },
              { action: "2nd Place Finish",      base: "+100 pts", bonus: "+200 pts" },
              { action: "3rd Place Finish",      base: "+100 pts", bonus: "+100 pts" },
            ].map((row, i, arr) => (
              <div
                key={row.action}
                className={`lb-pts-row ${i === arr.length - 1 ? "lb-pts-row--last" : ""}`}
              >
                <span className="lb-pts-row__action">{row.action}</span>
                <span className="lb-pts-row__base">{row.base}</span>
                {/* Dimmed style applied when there is no bonus for that action */}
                <span className={`lb-pts-row__bonus ${row.bonus === "—" ? "lb-pts-row__bonus--none" : ""}`}>
                  {row.bonus}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}