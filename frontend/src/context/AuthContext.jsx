import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function normalizeUserData(rawUser) {
  if (!rawUser) return null;
  return {
    ...rawUser,
    id: rawUser.id ?? rawUser.Id,
    email: rawUser.email ?? rawUser.Email,
    role: rawUser.role ?? rawUser.Role,
    status: rawUser.status ?? rawUser.Status,
    judgeId: rawUser.judgeId ?? rawUser.JudgeId,
    studentId: rawUser.studentId ?? rawUser.StudentId,
    givenName: rawUser.givenName ?? rawUser.GivenName,
    familyName: rawUser.familyName ?? rawUser.FamilyName,
    profilePictureUrl:
      rawUser.profilePictureUrl ??
      rawUser.profilePictureLink ??
      rawUser.ProfilePictureLink ??
      rawUser.profileImageUrl,
    isNewUser: rawUser.isNewUser ?? rawUser.IsNewUser,
    dateCreated: rawUser.dateCreated ?? rawUser.DateCreated,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? normalizeUserData(JSON.parse(stored)) : null;
    } catch {
      return null;
    }
  });

  const [hasLoggedInBefore, setHasLoggedInBefore] = useState(
    () => localStorage.getItem("hasLoggedInBefore") === "true"
  );

  function login(userData) {
    const normalized = normalizeUserData(userData);
    setUser(normalized);
    localStorage.setItem("user", JSON.stringify(normalized));
    if (!hasLoggedInBefore) {
      localStorage.setItem("hasLoggedInBefore", "true");
      setHasLoggedInBefore(true);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("joinedEvents");
    sessionStorage.removeItem("StudentID");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasLoggedInBefore }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
