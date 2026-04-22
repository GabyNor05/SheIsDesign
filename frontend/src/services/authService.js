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

export async function createMentee({ fullname, university, year_of_study, field_of_study, student_number, wants_volunteer, userId }) {
  const response = await fetch(`${API_BASE}/Mentee`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, university, year_of_study, field_of_study, student_number, wants_volunteer, userId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to save student details");
  }

  return response.json();
}

export async function createIndustryProfessional({ institution, job_title, userId }) {
  const response = await fetch(`${API_BASE}/IndustryProfessional`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ institution, job_title, userId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to save professional details");
  }

  return response.json();
}
