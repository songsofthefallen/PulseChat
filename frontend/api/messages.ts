import { apiClient } from "./client";
import type { Message, MessageRead } from "@/types";



export const messagesApi = {
  listByChannel: (workspaceId: number, channelId: number, beforeId?: number) =>
    apiClient.get<Message[]>(
      `/workspaces/${workspaceId}/channels/${channelId}/messages`,
      {
        params: beforeId ? { before_id: beforeId } : undefined,
      }
    ),

  getReadMessages: async (workspaceId: number,channelId: number) => {
    const response = await apiClient.get<MessageRead[]>(`/workspaces/${workspaceId}/channels/${channelId}/read`);
    return response.data;
  },

  send: ( workspaceId: number, channelId: number, content: string,) => 
    apiClient.post<Message>(`/workspaces/${workspaceId}/channels/${channelId}/messages`, { content },
    ),

  markAsRead: (workspaceId: number, channelId: number, messageId: number) =>
    apiClient.post(
      `/workspaces/${workspaceId}/channels/${channelId}/messages/${messageId}/read`
  ),

  edit: (messageId: string, content: string) =>
    apiClient.patch<Message>(`/messages/${messageId}`, { content }),

  delete: (messageId: string) => apiClient.delete<void>(`/messages/${messageId}`),

  pin: (messageId: string, pinned: boolean) =>
    apiClient.post<void>(`/messages/${messageId}/pin`, { pinned }),

  react: (messageId: string, emoji: string) =>
    apiClient.post<void>(`/messages/${messageId}/reactions`, { emoji }),

  unreact: (messageId: string, emoji: string) =>
    apiClient.delete<void>(`/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`),

  uploadAttachment: (file: File, onProgress?: (pct: number) => void) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<{ id: string; url: string }>("/attachments", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    });
  },

  // Real-time delivery (typing, new messages, presence) is assumed to
  // arrive over a WebSocket the backend provides — not implemented here.
};
