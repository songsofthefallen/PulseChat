import { apiClient } from "./client";
import type { User } from "@/types";

export const usersApi = {
  get: (userId: string) => apiClient.get<User>(`/users/${userId}`),

  updateProfile: (userId: string, payload: Partial<User>) =>
    apiClient.patch<User>(`/users/${userId}`, payload),

  updateStatus: (userId: string, status: User["status"], customStatus?: string) =>
    apiClient.patch<User>(`/users/${userId}/status`, { status, customStatus }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post<void>("/users/me/change-password", {
      currentPassword,
      newPassword,
    }),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return apiClient.post<{ avatarUrl: string }>("/users/me/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  search: (query: string) =>
    apiClient.get<User[]>("/users/search", { params: { q: query } }),
};
