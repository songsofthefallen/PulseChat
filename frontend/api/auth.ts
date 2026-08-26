import { apiClient } from "./client";
import type { User } from "@/types";
import { setAccessToken } from "./tokenStore";

export interface LoginRequest {
  email: string;
  password: string;
}


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



export const authApi = {
 async login(credentials: LoginRequest) {
    const response = await apiClient.post( "/auth/login", credentials);

    console.log("LOGIN RESPONSE:", response.data);

    setAccessToken(response.data.access_token);

      console.log(
      "STORED ACCESS TOKEN:",
      response.data.access_token
    );
    return response.data;
  },

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

  me: async () => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
  
};


