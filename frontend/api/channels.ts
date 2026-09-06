import { apiClient } from "./client";
import type { Channel, ChannelCategory } from "@/types";

export const channelsApi = {
  listByWorkspace: (workspaceId: number) =>
    apiClient.get<Channel[]>(`/dashboard/workspaces/${workspaceId}/channels`),

  getOneChannel: (workspaceId: number, channelId: number) =>
    apiClient.get<Channel>(`/dashboard/workspaces/${workspaceId}/channels/${channelId}`),



  categories: (serverId: string) =>
    apiClient.get<ChannelCategory[]>(`/servers/${serverId}/categories`),

  get: (channelId: string) => apiClient.get<Channel>(`/channels/${channelId}`),


  update: (channelId: string, payload: Partial<Channel>) =>
    apiClient.patch<Channel>(`/channels/${channelId}`, payload),

  delete: (channelId: string) => apiClient.delete<void>(`/channels/${channelId}`),

  markRead: (channelId: string) =>
    apiClient.post<void>(`/channels/${channelId}/read`),
};
