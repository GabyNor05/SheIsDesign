const API_BASE = "http://localhost:5160/api";

// Fetches the full participant profile for a given userId.
// Returns: { name, email, university, totalEventsJoined, totalScore, mostRecentEventTitle, mostRecentEventDate }
async function fetchParticipantProfile(userId) {
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
  const response = await fetch(`${API_BASE}/Participant/${userId}/event/${eventId}`);
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
