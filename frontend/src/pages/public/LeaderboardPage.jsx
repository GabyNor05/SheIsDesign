import { useEffect, useState } from "react";
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
import { useAuth } from "../../context/AuthContext";
import "./LeaderboardPage.css";

const DUMMY = [
  { rank: 1,  fullname: "Priya Shankar",    event: "UX Redesign Sprint",            category: "UX / Product Design",  university: "UCT",          points: 980 },
  { rank: 2,  fullname: "Maya Osei",        event: "Brand Identity Challenge 2026",  category: "Brand Identity",        university: "Wits",         points: 945 },
  { rank: 3,  fullname: "Fatima Al-Hassan", event: "Typography & Layout Sprint",     category: "Editorial Design",      university: "CPUT",         points: 912 },
  { rank: 4,  fullname: "Zoe Müller",       event: "Packaging Design Brief",         category: "Print & Packaging",     university: "Stellenbosch", points: 874 },
  { rank: 5,  fullname: "Amara Diallo",     event: "Motion & Animation Challenge",   category: "Motion Design",         university: "DUT",          points: 860 },
  { rank: 6,  fullname: "Laila Nkosi",      event: "Poster Design Open",             category: "Graphic Design",        university: "UJ",           points: 843 },
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

// ── Aggregate raw entries so each person appears once ──────────────────────────
// Groups by userId (if present) or fullname as fallback.
// Sums all points, surfaces the highest-scoring event as the display event,
// then re-ranks by total points descending.
function aggregateEntries(raw) {
  const map = new Map();

  for (const entry of raw) {
    // Use userId as the canonical key; fall back to lowercased fullname
    const key = entry.userId
      ? String(entry.userId)
      : (entry.fullname ?? "").toLowerCase().trim();

    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, {
        userId:     entry.userId     ?? null,
        fullname:   entry.fullname   ?? "Unknown",
        university: entry.university ?? null,
        totalPoints: 0,
        bestEvent:   null,   // entry with highest points — used for display
      });
    }

    const person = map.get(key);
    const pts = Number(entry.points) || 0;
    person.totalPoints += pts;

    // Track the single best-scoring event row for display
    if (!person.bestEvent || pts > (Number(person.bestEvent.points) || 0)) {
      person.bestEvent = entry;
    }
  }

  // Convert to the shape the rest of the component expects, sorted + re-ranked
  return Array.from(map.values())
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((person, i) => ({
      rank:       i + 1,
      userId:     person.userId,
      fullname:   person.fullname,
      university: person.university,
      points:     person.totalPoints,
      // Show the best event's name and category in the table
      event:      person.bestEvent?.event    ?? person.bestEvent?.eventTitle ?? "—",
      category:   person.bestEvent?.category ?? "—",
    }));
}

function initials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function avatarHue(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

function isCurrentUserEntry(entry, user) {
  if (!user) return false;
  if (entry.userId && (user.id ?? user.userId) && String(entry.userId) === String(user.id ?? user.userId)) return true;
  const entryName = entry.fullname?.toLowerCase().trim() || "";
  const userName  = (user.fullname || user.name || "").toLowerCase().trim();
  return entryName.length > 0 && userName.length > 0 && entryName === userName;
}

function PodiumCard({ entry, position, isCurrentUser }) {
  const isCenter = position === "center";
  const hue = avatarHue(entry.fullname);

  const rankIcon =
    entry.rank === 1 ? <Crown size={isCenter ? 22 : 18} weight="fill" color="#FFD700" /> :
    entry.rank === 2 ? <Medal size={18} weight="fill" color="#C0C0C0" /> :
                       <Trophy size={16} weight="fill" color="#CD7F32" />;

  return (
    <div className={`lb-podium-card lb-podium-card--${position} ${isCurrentUser ? "lb-podium-card--you" : ""}`}>
      {isCenter && <div className="lb-podium-card__glow" />}

      <div className="lb-podium-card__rank-badge">
        {rankIcon}
        <span className="lb-podium-card__rank-num">{entry.rank}</span>
      </div>

      <div
        className="lb-podium-card__avatar"
        style={{
          background: `linear-gradient(135deg, hsl(${hue},55%,28%), hsl(${hue},65%,18%))`,
          borderColor: `hsl(${hue},50%,38%)`,
        }}
      >
        <span className="lb-podium-card__initials">{initials(entry.fullname)}</span>
      </div>

      <div className="lb-podium-card__info">
        <span className="lb-podium-card__name">
          {entry.fullname}
          {isCurrentUser && <span className="lb-row__you-badge">You</span>}
        </span>
        <span className="lb-podium-card__category">{entry.category}</span>
        {entry.university && (
          <span className="lb-podium-card__university">{entry.university}</span>
        )}
      </div>

      <div className="lb-podium-card__points-wrap">
        <span className="lb-podium-card__points">{entry.points.toLocaleString()}</span>
        <span className="lb-podium-card__pts-label">pts</span>
      </div>

      <div className={`lb-podium-card__base lb-podium-card__base--${position}`}>
        <span className="lb-podium-card__base-rank">{entry.rank}</span>
      </div>
    </div>
  );
}

function TableRow({ entry, index, isCurrentUser }) {
  const hue = avatarHue(entry.fullname);

  return (
    <div
      className={`lb-row ${isCurrentUser ? "lb-row--you" : ""}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="lb-row__rank">
        <span className="lb-row__rank-num">{entry.rank}</span>
      </div>

      <div className="lb-row__student">
        <div
          className="lb-row__avatar"
          style={{
            background: `linear-gradient(135deg, hsl(${hue},55%,28%), hsl(${hue},65%,18%))`,
            borderColor: `hsl(${hue},45%,35%)`,
          }}
        >
          <span>{initials(entry.fullname)}</span>
        </div>
        <div className="lb-row__student-info">
          <span className="lb-row__name">
            {entry.fullname}
            {isCurrentUser && <span className="lb-row__you-badge">You</span>}
          </span>
          {entry.university && (
            <span className="lb-row__university">{entry.university}</span>
          )}
        </div>
      </div>

      <div className="lb-row__event">
        <span>{entry.event}</span>
        <span className="lb-row__category">{entry.category}</span>
      </div>

      <div className="lb-row__points">
        <span className="lb-row__points-val">{entry.points.toLocaleString()}</span>
        <span className="lb-row__pts">pts</span>
      </div>
    </div>
  );
}

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

const HOW_ITEMS = [
  { icon: <Lightning size={18} weight="fill" />, step: "01", title: "Enter an event",  body: "Every event you join earns base participation points — just showing up counts." },
  { icon: <Star size={18} weight="fill" />,      step: "02", title: "Compete & place", body: "Strong submissions and community recognition earn bonus points. Top 3 placements carry serious weight." },
  { icon: <TrendUp size={18} weight="fill" />,   step: "03", title: "Stay consistent", body: "Points compound across the full season. Regular participation beats single-event spikes." },
  { icon: <Users size={18} weight="fill" />,     step: "04", title: "Gain visibility", body: "Top-ranked students get featured to industry sponsors and unlock mentorship access curated by SheisDesign." },
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then((data) => {
        const raw = (data && data.length > 0) ? data : DUMMY;
        // Aggregate here — one entry per person, ranked by total points
        setEntries(aggregateEntries(raw));
      })
      .catch(() => setEntries(aggregateEntries(DUMMY)))
      .finally(() => setLoading(false));
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const podiumOrder = top3.length === 3
    ? [{ entry: top3[1], pos: "left" }, { entry: top3[0], pos: "center" }, { entry: top3[2], pos: "right" }]
    : top3.map((e, i) => ({ entry: e, pos: i === 0 ? "center" : i === 1 ? "left" : "right" }));

  return (
    <div className="lb-page">
      <div className="lb-glow lb-glow--mid-right" />

      <section className="lb-hero-podium">
        <div className="lb-hero-podium__bg-gradient" />
        <div className="lb-hero-podium__orb" />
        <div className="lb-hero-podium__orb2" />

        <h1 className="lb-hero-title">Leaderboard</h1>

        <div className="lb-podium-wrapper">
          {loading ? (
            <div className="lb-podium-skeleton">
              {[0, 1, 2].map((i) => <div key={i} className="lb-podium-sk" />)}
            </div>
          ) : (
            <div className="lb-podium">
              {podiumOrder.map(({ entry, pos }) => (
                <PodiumCard
                  key={entry.rank}
                  entry={entry}
                  position={pos}
                  isCurrentUser={isCurrentUserEntry(entry, user)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

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

          <div className="lb-table-cols">
            <span>Rank</span>
            <span>Student</span>
            <span>Top Event / Discipline</span>
            <span>Points</span>
          </div>

          {!loading && top3.map((entry, i) => (
            <TableRow
              key={entry.rank}
              entry={entry}
              index={i}
              isCurrentUser={isCurrentUserEntry(entry, user)}
            />
          ))}

          {!loading && <div className="lb-table-divider" />}

          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            : rest.map((entry, i) => (
                <TableRow
                  key={entry.rank}
                  entry={entry}
                  index={i + 3}
                  isCurrentUser={isCurrentUserEntry(entry, user)}
                />
              ))
          }
        </div>
      </section>

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

          <div className="lb-pts-table">
            <div className="lb-pts-table__head">
              {["Action", "Base Points", "Bonus Points"].map((col) => (
                <span key={col}>{col}</span>
              ))}
            </div>
            {[
              { action: "Event Participation",  base: "+50 pts",  bonus: "—" },
              { action: "Submission Accepted",   base: "+100 pts", bonus: "—" },
              { action: "Community Pick Award",  base: "+100 pts", bonus: "+75 pts" },
              { action: "Top Entry Award",       base: "+100 pts", bonus: "+150 pts" },
              { action: "1st Place Finish",      base: "+100 pts", bonus: "+300 pts" },
              { action: "2nd Place Finish",      base: "+100 pts", bonus: "+200 pts" },
              { action: "3rd Place Finish",      base: "+100 pts", bonus: "+100 pts" },
            ].map((row, i, arr) => (
              <div key={row.action} className={`lb-pts-row ${i === arr.length - 1 ? "lb-pts-row--last" : ""}`}>
                <span className="lb-pts-row__action">{row.action}</span>
                <span className="lb-pts-row__base">{row.base}</span>
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