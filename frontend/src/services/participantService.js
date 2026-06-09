import API_BASE from '../config';

const STATUS_COLORS = {
  approved: "#22C55E",
  pending: "#FBBF24",
  rejected: "#F87171",
};

function getInitials(name = "", email = "") {
  const source = (name || email || "").trim();
  if (!source) return "?";

  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function mapParticipant(item) {
  const status = (item.status || "pending").toLowerCase();
  const type = (item.type || "student").toLowerCase();

  return {
    id: item.id,
    type,
    initials: item.initials || getInitials(item.name, item.email),
    name: item.name || item.fullName || "Unknown participant",
    email: item.email || "",
    institution: item.institution || "",
    field: item.field || item.jobTitle || "",
    status,
    joined: item.joined || item.dateCreated || "",
    submissions: Number(item.submissions || 0),
    points: Number(item.points || 0),
    color: item.color || STATUS_COLORS[status] || "#a78bfa",
  };
}

export async function fetchParticipantsForAdmin() {
  const response = await fetch(`${API_BASE}/Participant`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch participants");
  }

  const data = await response.json();
  return data.map(mapParticipant);
}

export async function updateParticipantStatus(userId, status) {
  const response = await fetch(`${API_BASE}/Participant/${userId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to update participant status");
  }

  return response.json();
}

// Fetches the full participant profile for a given userId.
// Returns: { name, email, university, totalEventsJoined, totalScore, mostRecentEventTitle, mostRecentEventDate }
export async function fetchParticipantProfile(userId) {
  const response = await fetch(`${API_BASE}/Participant/${userId}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch participant profile");
  }
  return response.json();
}

// Fetches the participant's status within a specific event.
// Returns: { status, eventTitle }
async function fetchParticipantEventStatus(userId, eventId) {
  const response = await fetch(
    `${API_BASE}/Participant/${userId}/event/${eventId}`,
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to fetch participant event status");
  }
  return response.json();
}

// Returns the full name of the participant.
export async function getParticipantName(userId) {
  const profile = await fetchParticipantProfile(userId);
  return profile.name;
}

// Returns the email address of the participant.
export async function getParticipantEmail(userId) {
  const profile = await fetchParticipantProfile(userId);
  return profile.email;
}

// Returns the university the participant attends.
export async function getParticipantUniversity(userId) {
  const profile = await fetchParticipantProfile(userId);
  return profile.university;
}

// Returns the total number of distinct events the participant has entered.
export async function getParticipantTotalEvents(userId) {
  const profile = await fetchParticipantProfile(userId);
  return profile.totalEventsJoined;
}

// Returns the participant's cumulative score across all events.
export async function getParticipantTotalScore(userId) {
  const profile = await fetchParticipantProfile(userId);
  return profile.totalScore;
}

// Returns the title and start date of the participant's most recently entered event.
// Returns: { title, date } or null if they have no entries.
export async function getParticipantMostRecentEvent(userId) {
  const profile = await fetchParticipantProfile(userId);
  if (!profile.mostRecentEventTitle) return null;
  return {
    title: profile.mostRecentEventTitle,
    date: profile.mostRecentEventDate,
  };
}

// Returns the participant's submission status within a specific event.
// Example: getParticipantStatusInEvent(1, 3) → "pending" / "approved" / "rejected"
export async function getParticipantStatusInEvent(userId, eventId) {
  const data = await fetchParticipantEventStatus(userId, eventId);
  return data.status;
}

// Returns the full participant profile in one call.
// Use this when you need to display multiple fields at once to avoid multiple requests.
export async function getParticipantProfile(userId) {
  return fetchParticipantProfile(userId);
}

// Returns all event-specific details for a participant in one call.
// Returns: { status, eventTitle }
export async function getParticipantEventDetails(userId, eventId) {
  return fetchParticipantEventStatus(userId, eventId);
}
