import { apiClient } from "./client";
import type { User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Placeholder auth module. The real backend is assumed to provide JWT
 * access/refresh tokens, RBAC claims, and rate limiting — none of that
 * is implemented here, only the request shapes the UI depends on.
 */
export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", payload),

  logout: () => apiClient.post<void>("/auth/logout"),

  forgotPassword: (email: string) =>
    apiClient.post<void>("/auth/forgot-password", { email }),

  verifyResetCode: (email: string, code: string) =>
    apiClient.post<void>("/auth/verify-reset-code",{ email, code }),

  resetPassword: (password: string) =>
    apiClient.post<void>("/auth/reset-password", { password }),

  refresh: (refreshToken: string) =>
    apiClient.post<AuthResponse>("/auth/refresh", { refreshToken }),

  me: () => apiClient.get<User>("/auth/me"),
};
