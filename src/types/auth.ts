export type UserRole = "SSO" | "Student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Add other specific fields like studentID or departmentID here
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
