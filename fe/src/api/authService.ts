/**
 * api/authService.ts
 * Interfaces with AuthController (/api/auth)
 * Handles JWT storage after login/register.
 * Supports MOCK_MODE for local testing without backend.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './client';
import { AUTH } from './endpoints';
import type { AuthResponse, LoginPayload, RegisterPayload, UserProfile } from '@/types/auth';

// Set to true to enable mock login for testing screens without backend
const MOCK_MODE = true;

// Mock test credentials
const MOCK_USERS: Record<string, { password: string; user: UserProfile }> = {
  'test@firealarm.com': {
    password: '123456',
    user: {
      id: 'mock-user-1',
      name: 'Test User',
      email: 'test@firealarm.com',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    },
  },
};

// Generate mock JWT token (valid for 24 hours)
const generateMockToken = (userId: string): string => {
  // Simple mock token - just needs to be a non-empty string
  const timestamp = Math.floor(Date.now() / 1000);
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke3VzZXJJZH0iLCJpYXQiOiR7dGltZXN0YW1wfSwiZXhwIjoke3RpbWVzdGFtcCArIDg2NDAwfX0.mock-signature`;
};

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (MOCK_MODE) {
      const mockUser = MOCK_USERS[payload.email];
      if (mockUser && mockUser.password === payload.password) {
        const accessToken = generateMockToken(mockUser.user.id);
        const refreshToken = generateMockToken(mockUser.user.id);
        await AsyncStorage.setItem('access_token', accessToken);
        await AsyncStorage.setItem('refresh_token', refreshToken);
        return {
          accessToken,
          refreshToken,
          user: mockUser.user,
        };
      }
      throw new Error('Invalid mock credentials. Use test@firealarm.com / Test@1234');
    }

    const { data } = await client.post<AuthResponse>(AUTH.LOGIN, payload);
    await AsyncStorage.setItem('access_token', data.accessToken);
    await AsyncStorage.setItem('refresh_token', data.refreshToken);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (MOCK_MODE) {
      const user: UserProfile = {
        id: `mock-user-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
      };
      const accessToken = generateMockToken(user.id);
      const refreshToken = generateMockToken(user.id);
      await AsyncStorage.setItem('access_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
      return { accessToken, refreshToken, user };
    }
    const { data } = await client.post<AuthResponse>(AUTH.REGISTER, payload);
    await AsyncStorage.setItem('access_token', data.accessToken);
    await AsyncStorage.setItem('refresh_token', data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    if (!MOCK_MODE) {
      await client.post(AUTH.LOGOUT).catch(() => {}); // best-effort server invalidation
    }
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
  },

  async getProfile(): Promise<UserProfile> {
    if (MOCK_MODE) {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        return MOCK_USERS['test@firealarm.com'].user;
      }
      throw new Error('No mock user logged in');
    }
    const { data } = await client.get<UserProfile>(AUTH.ME);
    return data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    if (MOCK_MODE) {
      return {
        accessToken: generateMockToken('mock-user-1'),
        refreshToken: generateMockToken('mock-user-1'),
        user: MOCK_USERS['test@firealarm.com'].user,
      };
    }
    const { data } = await client.post<AuthResponse>(AUTH.REFRESH, { refreshToken });
    await AsyncStorage.setItem('access_token', data.accessToken);
    return data;
  },
};
