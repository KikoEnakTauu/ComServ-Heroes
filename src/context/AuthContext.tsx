// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "../types/auth";

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => Promise<void>; // Mocking login for structure
  logout: () => void;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Helper to strictly check permissions
  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const login = async (role: UserRole) => {
    // API simulation
    setUser({ id: "123", name: "John Doe", email: "john@csh.com", role });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
