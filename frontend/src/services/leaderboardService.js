const API_BASE = "http://localhost:5160/api";

export async function fetchLeaderboard() {
  const res = await fetch(`${API_BASE}/Leaderboard`);
  if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);
  const data = await res.json();
  // Normalise field names — backend may use PascalCase
  return data.map((entry, i) => ({
    rank: entry.rank ?? entry.Rank ?? i + 1,
    fullname: entry.fullname ?? entry.Fullname ?? entry.name ?? "—",
    category:
      entry.field_of_study ??
      entry.Field_of_study ??
      entry.category ??
      "Design",
    university: entry.university ?? entry.University ?? "",
    points: entry.points ?? entry.Points ?? 0,
    event: entry.event_name ?? entry.Event_name ?? entry.event ?? "—",
  }));
}

export async function fetchLeaderboardStats() {
  // Once the backend exposes aggregate stats, wire this up.
  // For now returns null so the page falls back to counting the entries array.
  try {
    const res = await fetch(`${API_BASE}/Leaderboard/stats`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
