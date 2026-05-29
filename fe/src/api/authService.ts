/**
 * api/authService.ts
 * Interfaces with AuthController (/api/auth)
 * Handles JWT storage after login/register.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './client';
import { AUTH } from './endpoints';
import type { AuthResponse, LoginPayload, RegisterPayload, UserProfile } from '@/types/auth';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await client.post<AuthResponse>(AUTH.LOGIN, payload);
    await AsyncStorage.setItem('access_token', data.accessToken);
    if (data.refreshToken) {
      await AsyncStorage.setItem('refresh_token', data.refreshToken);
    }
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await client.post<AuthResponse>(AUTH.REGISTER, payload);
    await AsyncStorage.setItem('access_token', data.accessToken);
    if (data.refreshToken) {
      await AsyncStorage.setItem('refresh_token', data.refreshToken);
    }
    return data;
  },

  async logout(): Promise<void> {
    await client.post(AUTH.LOGOUT).catch(() => {}); // best-effort server invalidation
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
  },

  async getProfile(): Promise<UserProfile> {
    const { data } = await client.get<UserProfile>(AUTH.ME);
    return data;
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data } = await client.post<AuthResponse>(AUTH.REFRESH, { refreshToken });
    await AsyncStorage.setItem('access_token', data.accessToken);
    return data;
  },
};
