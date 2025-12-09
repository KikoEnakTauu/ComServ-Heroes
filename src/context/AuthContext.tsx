import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../utils/roles';

interface AuthContextType {
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [role, setRole] = useState<UserRole | null>(null);

  const login = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const logout = () => {
    setRole(null);
  };

  const isAuthenticated = role !== null;

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
