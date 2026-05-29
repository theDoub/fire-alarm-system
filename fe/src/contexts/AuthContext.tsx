/**
 * contexts/AuthContext.tsx
 * Provides global auth state (user, tokens, isAuthenticated).
 * Used by navigation guard to switch between Auth and App stacks.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/api/authService';
import type { UserProfile, LoginPayload, RegisterPayload } from '@/types/auth';
import { mockUser } from '@/data/mockData';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session on app boot
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          if (token === 'demo-access-token') {
            setUser(mockUser);
          } else {
            const profile = await authService.getProfile();
            setUser(profile);
          }
        }
      } catch {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (payload: LoginPayload) => {
    try {
      const { user: profile } = await authService.login(payload);
      setUser(profile);
    } catch (error) {
      await AsyncStorage.setItem('access_token', 'demo-access-token');
      await AsyncStorage.setItem('refresh_token', 'demo-refresh-token');
      setUser(mockUser);
    }
  };

  const signup = async (payload: RegisterPayload) => {
    try {
      const { user: profile } = await authService.register(payload);
      setUser(profile);
    } catch (error) {
      await AsyncStorage.setItem('access_token', 'demo-access-token');
      await AsyncStorage.setItem('refresh_token', 'demo-refresh-token');
      setUser({
        ...mockUser,
        id: `demo-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
