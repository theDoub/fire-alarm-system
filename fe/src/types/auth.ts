/**
 * types/auth.ts — Authentication domain types
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface UserProfile {
  userId?: string;
  id?: string;
  fullName?: string;
  name?: string;
  email: string;
  role: 'ADMIN' | 'VIEWER' | 'USER';
  avatarUrl?: string;
  createdAt?: string;
}
