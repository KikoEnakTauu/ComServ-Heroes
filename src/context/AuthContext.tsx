import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, ROLES } from '../utils/roles';
import { supabase } from '../utils/supabase';

interface AuthContextType {
  userId: string | null;
  role: UserRole | null;
  email: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// SSO email domains that should have SSO role
const SSO_DOMAINS = ['@sso.com', '@admin.com', '@organizer.com'];

const determineRoleFromEmail = (email: string): UserRole => {
  const lowerEmail = email.toLowerCase();
  const isSSO = SSO_DOMAINS.some(domain => lowerEmail.endsWith(domain));
  return isSSO ? ROLES.SSO : ROLES.USER;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userEmail = session.user.email || '';
        setUserId(session.user.id);
        setEmail(userEmail);
        setRole(determineRoleFromEmail(userEmail));
      } else {
        setUserId(null);
        setEmail(null);
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userEmail = session.user.email || '';
        setUserId(session.user.id);
        setEmail(userEmail);
        setRole(determineRoleFromEmail(userEmail));
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Basic validation
      if (!email || !password) {
        return { success: false, message: 'Please enter email and password' };
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Password validation (min 6 characters)
      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation redirect
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities && data.user.identities.length === 0) {
          return { success: false, message: 'This email is already registered. Please login instead.' };
        }
        
        // Auto-login after signup if email confirmation is disabled
        if (!data.session) {
          // If no session, try to login immediately
          const loginResult = await login(email, password);
          if (loginResult.success) {
            return { success: true, message: 'Account created and logged in successfully!' };
          }
        }
        
        return { 
          success: true, 
          message: data.session ? 'Account created successfully!' : 'Account created! Please login to continue.' 
        };
      }

      return { success: false, message: 'Failed to create account' };
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred during sign up' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Basic validation
      if (!email || !password) {
        return { success: false, message: 'Please enter email and password' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        const userEmail = data.user.email || '';
        const userRole = determineRoleFromEmail(userEmail);
        setUserId(data.user.id);
        setEmail(userEmail);
        setRole(userRole);

        return { 
          success: true, 
          message: `Welcome! You are logged in as ${userRole === ROLES.SSO ? 'SSO' : 'User'}` 
        };
      }

      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred during login' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setRole(null);
    setEmail(null);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ userId, role, email, isAuthenticated, loading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
