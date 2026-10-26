/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { authService, type User, type AuthResponse } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  signUp: (data: { email: string; password: string; fullName: string }) => Promise<AuthResponse>;
  loginAsStudent: (data: { fullName: string; attendanceNumber: number }) => Promise<AuthResponse>;
  loginAsGuest: (guestName?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      return authService.getCurrentUser();
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.signInWithPassword(credentials);
      if (res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: { email: string; password: string; fullName: string }): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.signUp(data);
      if (res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsStudent = async (data: { fullName: string; attendanceNumber: number }): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.signInWithStudentProfile(data);
      if (res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async (guestName?: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.signInAsGuest(guestName);
      if (res.user) {
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    signUp,
    loginAsStudent,
    loginAsGuest,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
