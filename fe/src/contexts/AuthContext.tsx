/**
 * contexts/AuthContext.tsx
 * Provides global auth state (user, tokens, isAuthenticated).
 * Used by navigation guard to switch between Auth and App stacks.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/api/authService';
import type { UserProfile, LoginPayload } from '@/types/auth';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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
          const profile = await authService.getProfile();
          setUser(profile);
        }
      } catch {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (payload: LoginPayload) => {
    const { user: profile } = await authService.login(payload);
    setUser(profile);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (e) {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      setUser(null);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
