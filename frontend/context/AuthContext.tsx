import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { User } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedInUser, token: apiToken } = await mockApi.login(email, password);
    setUser(loggedInUser);
    setToken(apiToken);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', apiToken);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    await mockApi.signup(name, email, password);
    // After signup, automatically log in the user
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    signup,
    logout,
  }), [user, token, loading, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};