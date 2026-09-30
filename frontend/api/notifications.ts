import { apiClient } from "./client";
import type { NotificationItem, NotificationUnreadCount } from "@/types";

export const notificationsApi = {
  list: async (beforeId?: number) => {
    const response = await apiClient.get<NotificationItem[]>("/notifications", {
      params: beforeId !== undefined ? { before_id: beforeId } : undefined,
    });

    return response.data;
  },

  unreadList: async () => {
    const response = await apiClient.get<NotificationUnreadCount>("/notifications/unread-count");
    return response.data;
  },

  markRead: async (id: number) => {
    const response = await apiClient.patch<NotificationItem>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllRead: async () => {
    const response = await apiClient.patch<void>("/notifications/read-all");
    return response.data;
  },
};
