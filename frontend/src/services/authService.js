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

  const data = await response.json();

  // Store student ID on login if the user is a student
  if (data.studentId) {
    sessionStorage.setItem("StudentID", data.studentId);
  }

  return data;
}

export async function googleLoginUser(accessToken) {
  const response = await fetch(`${API_BASE}/User/GoogleLogin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Google sign-in failed");
  }

  const data = await response.json();

  // Store student ID on Google login if the user is a student
  if (data.studentId) {
    sessionStorage.setItem("StudentID", data.studentId);
  }

  return data;
}

export async function verifyAdminCode(code) {
  const response = await fetch(`${API_BASE}/User/VerifyAdminCode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error("Invalid admin access code.");
  }
}

export async function createMentee({ fullname, university, year_of_study, field_of_study, student_number, wants_volunteer, userId }) {
  const response = await fetch(`${API_BASE}/Student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, university, year_of_study, field_of_study, student_number, wants_volunteer, userId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to save student details");
  }

  // Parse JSON first, then read the id from the parsed data
  const data = await response.json();
  if (data.id) {
    sessionStorage.setItem("StudentID", data.id);
  }

  return data;
}

export async function createIndustryProfessional({ fullname, institution, job_title, userId }) {
  const response = await fetch(`${API_BASE}/IndustryProfessional`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, institution, job_title, userId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to save professional details");
  }

  return response.json();
}