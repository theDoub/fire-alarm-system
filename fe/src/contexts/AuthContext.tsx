/**
 * contexts/AuthContext.tsx
 * Provides global auth state (user, tokens, isAuthenticated).
 * Used by navigation guard to switch between Auth and App stacks.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/api/authService';
import type { UserProfile, LoginPayload, RegisterPayload } from '@/types/auth';

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
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
          if (token === 'mock_access_token') {
            setUser({
              fullName: 'Van A',
              email: 'vanang@gmail.com',
              role: 'USER',
              userId: 'mock-user-id',
              name: 'Van A'
            });
            return;
          }
          // Clear any older cached non-mock tokens to prevent rendering old users like "John Doe"
          await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
          setUser(null);
        }
      } catch {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (payload: LoginPayload) => {
    if (payload.email === 'vanang@gmail.com' && payload.password === '123456') {
      const mockProfile: UserProfile = {
        fullName: 'Van A',
        email: 'vanang@gmail.com',
        role: 'USER',
        userId: 'mock-user-id',
        name: 'Van A'
      };
      await AsyncStorage.setItem('access_token', 'mock_access_token');
      setUser(mockProfile);
      return;
    }
    const { user: profile } = await authService.login(payload);
    setUser(profile);
  };

  const register = async (payload: RegisterPayload) => {
    // Mock register: any unique email is accepted
    const mockProfile: UserProfile = {
      fullName: payload.name,
      email: payload.email,
      role: 'USER',
      userId: `mock-user-${Math.random().toString(36).substr(2, 8)}`,
      name: payload.name,
    };
    await AsyncStorage.setItem('access_token', 'mock_access_token');
    setUser(mockProfile);
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token !== 'mock_access_token') {
        await authService.logout().catch(() => {});
      }
    } catch {}
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token === 'mock_access_token') {
        setUser({
          fullName: 'Van A',
          email: 'vanang@gmail.com',
          role: 'USER',
          userId: 'mock-user-id',
          name: 'Van A'
        });
        return;
      }
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (e) {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      setUser(null);
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
