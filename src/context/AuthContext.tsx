'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = useCallback(async () => {
    if (!loading) return; // Prevent multiple simultaneous checks
    try {
      console.log('Checking login status...');
      const response = await fetch('/api/auth/me');
      console.log('Login status response:', response.status);
      if (response.ok) {
        const userData = await response.json();
        console.log('User data received:', userData);
        setUser(userData);
      } else {
        console.log('Not authenticated or error occurred');
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    console.log('Login function called');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    console.log('Login response status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('Login successful, user data:', data.user);
      setUser(data.user);
    } else {
      const errorData = await response.json();
      console.error('Login failed:', errorData.error);
      throw new Error(errorData.error || 'Login failed');
    }
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
      setUser(null);
    } else {
      throw new Error('Logout failed');
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, checkLoginStatus, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}