const API_BASE = "http://localhost:5160/api";

// GET all events
export async function getAllEvents() {
  const response = await fetch(`${API_BASE}/Event`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error fetching events");
  }
  return response.json();
}

// GET single event by ID
export async function getEventById(id) {
  const response = await fetch(`${API_BASE}/Event/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error fetching event");
  }
  return response.json();
}

// GET upcoming events (start_date > today, ordered by date)
export async function getUpcomingEvents() {
  const response = await fetch(`${API_BASE}/Event/upcoming`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error fetching upcoming events");
  }
  return response.json();
}

// GET events filtered by status ("open", "drafted", "closed")
export async function getEventsByStatus(status) {
  const response = await fetch(`${API_BASE}/Event/status/${status}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Error fetching events with status: ${status}`);
  }
  return response.json();
}

// GET event stats by category (returns openCount, draftCount, closedCount)
export async function getEventStatsByCategory(category) {
  const response = await fetch(`${API_BASE}/Event/category/${category}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error fetching event statistics");
  }
  return response.json();
}
