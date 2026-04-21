const API_BASE = "http://localhost:5160/api";

export async function GetEventStatistics(category) {
  const response = await fetch(`${API_BASE}/Event/category/${category}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error Fetching Event Details");
  }

  return response.json();
}