const API_BASE = "http://localhost:5160/api";

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE}/User`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Registration failed");
  }

  return response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/User/Login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Login failed");
  }

  return response.json();
}
