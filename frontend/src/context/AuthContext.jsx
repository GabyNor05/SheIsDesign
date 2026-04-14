// ─────────────────────────────────────────────────────────────────────────────
// AuthContext.jsx — Global authentication state
// Wraps the whole app so any component can read the logged-in user
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  BACKEND HANDOFF — what needs to change when API is ready       │
// │                                                                 │
// │  1. login(userData) — currently just saves whatever you pass.   │
// │     Replace with: const res = await fetch('/api/auth/login')    │
// │     then save res.json() (which should match UserReadDTO.cs)    │
// │                                                                 │
// │  2. localStorage key "sid_user" — stores the logged-in user.   │
// │     When JWT is ready, also store the token here and attach     │
// │     it to every fetch as: Authorization: Bearer <token>         │
// │                                                                 │
// │  3. The `user` shape below should match UserReadDTO.cs:         │
// │     { id, email, role, fullname, profileImageUrl? }             │
// └─────────────────────────────────────────────────────────────────┘
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Rehydrate from localStorage on page refresh
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("sid_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ── login ──────────────────────────────────────────────────────────────────
  // Call this after OTP is verified (or after real API responds with user data)
  // userData shape: { id, email, role, fullname, profileImageUrl? }
  function login(userData) {
    setUser(userData);
    localStorage.setItem("sid_user", JSON.stringify(userData));
  }

  // ── logout ─────────────────────────────────────────────────────────────────
  function logout() {
    setUser(null);
    localStorage.removeItem("sid_user");
    // TODO: POST /api/auth/logout to invalidate JWT on server
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook — use anywhere: const { user, login, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}