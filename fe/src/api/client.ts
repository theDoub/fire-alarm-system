/**
 * api/client.ts
 * Central Axios instance — base URL, JWT interceptor, and 401 auto-logout.
 * All feature services import this instance instead of raw axios.
 */
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Change to your Spring Boot server address ──────────────────────────────
export const BASE_URL = 'http://192.168.1.13:8080/api';

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach stored JWT ─────────────────────────────────
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ── Response interceptor: handle 401 globally ─────────────────────────────
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      // Navigation reset is handled by AuthContext listener
    }
    return Promise.reject(error);
  },
);

export default client;
