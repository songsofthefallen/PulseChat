import { apiClient } from "./client";
import type { Server } from "@/types";

export const serversApi = {
  list: () => apiClient.get<Server[]>("/servers"),

  get: (serverId: string) => apiClient.get<Server>(`/servers/${serverId}`),

  create: (payload: { name: string; iconUrl?: string }) =>
    apiClient.post<Server>("/servers", payload),

  join: (inviteCode: string) =>
    apiClient.post<Server>("/servers/join", { inviteCode }),

  leave: (serverId: string) => apiClient.post<void>(`/servers/${serverId}/leave`),

  updateSettings: (serverId: string, payload: Partial<Server>) =>
    apiClient.patch<Server>(`/servers/${serverId}`, payload),

  members: (serverId: string) =>
    apiClient.get(`/servers/${serverId}/members`),
};
