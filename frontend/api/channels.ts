import { apiClient } from "./client";
import type { Channel, ChannelCategory } from "@/types";

export const channelsApi = {
  listByServer: (serverId: string) =>
    apiClient.get<Channel[]>(`/servers/${serverId}/channels`),

  categories: (serverId: string) =>
    apiClient.get<ChannelCategory[]>(`/servers/${serverId}/categories`),

  get: (channelId: string) => apiClient.get<Channel>(`/channels/${channelId}`),

  create: (serverId: string, payload: Pick<Channel, "name" | "type" | "categoryId">) =>
    apiClient.post<Channel>(`/servers/${serverId}/channels`, payload),

  update: (channelId: string, payload: Partial<Channel>) =>
    apiClient.patch<Channel>(`/channels/${channelId}`, payload),

  delete: (channelId: string) => apiClient.delete<void>(`/channels/${channelId}`),

  markRead: (channelId: string) =>
    apiClient.post<void>(`/channels/${channelId}/read`),
};
