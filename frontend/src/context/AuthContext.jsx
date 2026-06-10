import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [hasLoggedInBefore, setHasLoggedInBefore] = useState(
    () => localStorage.getItem("hasLoggedInBefore") === "true"
  );

  function login(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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
