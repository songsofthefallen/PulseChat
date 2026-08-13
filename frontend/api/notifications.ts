import { apiClient } from "./client";
import type { NotificationItem } from "@/types";

export const notificationsApi = {
  list: () => apiClient.get<NotificationItem[]>("/notifications"),
  markRead: (id: string) => apiClient.post<void>(`/notifications/${id}/read`),
  markAllRead: () => apiClient.post<void>("/notifications/read-all"),
};
