import { apiClient } from "./client";
import type { NotificationItem, NotificationUnreadCount } from "@/types";

export const notificationsApi = {
  list: async () => {
    const response = await apiClient.get<NotificationItem[]>("/notifications");
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
