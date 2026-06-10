import API_BASE from '../config';

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeStatus(status) {
  const value = (status ?? "Pending").toString().toLowerCase();
  if (value === "winner") return "Winner";
  if (value === "reviewed" || value === "approved" || value === "accepted")
    return "Reviewed";
  return "Pending";
}

export async function fetchEvents() {
  const res = await fetch(`${API_BASE}/Event`);
  if (!res.ok) throw new Error(`Events fetch failed: ${res.status}`);

  const data = await res.json();
  return data.map((event) => ({
    id: event.id ?? event.Id,
    title: event.title ?? event.Title,
    date: formatDate(event.start_date ?? event.Start_date),
    raw: event,
  }));
}

export async function fetchLeaderboardForEvent(eventId) {
  const res = await fetch(`${API_BASE}/Leaderboard?eventId=${eventId}`);
  if (!res.ok) throw new Error(`Leaderboard fetch failed: ${res.status}`);

  const data = await res.json();
  return data.map((entry) => ({
    id: entry.id ?? entry.Id,
    eventId: entry.eventId ?? entry.EventId ?? eventId,
    studentName: entry.student_name ?? entry.Student_name ?? "Unknown",
    studentEmail: entry.student_email ?? entry.Student_email ?? "",
    submissionTitle: entry.submission_title ?? entry.Submission_title ?? "",
    status: normalizeStatus(
      entry.review_status ?? entry.Review_status ?? entry.status,
    ),
    score:
      typeof entry.score === "number" ? entry.score : (entry.Score ?? null),
    rank: entry.rank ?? entry.Rank ?? null,
    fileLink: entry.image_file_link ?? entry.Image_file_link ?? null,
    submittedAt: "—",
    isWinner:
      (entry.review_status ?? entry.Review_status ?? "")
        .toString()
        .toLowerCase() === "winner",
    color: "#FE4081",
  }));
}

export async function fetchLeaderboard() {
  const events = await fetchEvents();

  const allResults = await Promise.all(
    events.map(async (event) => {
      const rows = await fetchLeaderboardForEvent(event.id);
      return rows.map((row) => ({
        id: row.id,
        rank: row.rank ?? 0,
        fullname: row.studentName ?? "Unknown",
        event: event.title ?? "Unknown event",
        category: event.category ?? event.raw?.category ?? "Design Competition",
        university: row.studentEmail
          ? row.studentEmail.split("@")[1]?.split(".")[0]?.toUpperCase() || ""
          : "",
        points: typeof row.score === "number" ? row.score : 0,
        userId: null,
        raw: row,
      }));
    }),
  );

  return allResults.flat().sort((a, b) => a.rank - b.rank);
}

export async function updateSubmission(submissionId, submission) {
  const res = await fetch(`${API_BASE}/Submission/${submissionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: submission.title ?? "",
      status: submission.status ?? "Pending",
      points: typeof submission.points === "number" ? submission.points : 0,
      rank: typeof submission.rank === "number" ? submission.rank : 0,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Submission update failed: ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}

export async function fetchLeaderboardStats() {
  try {
    const res = await fetch(`${API_BASE}/Leaderboard/stats`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
