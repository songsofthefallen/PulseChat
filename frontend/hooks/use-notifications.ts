"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationItem } from "@/types"

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list(),
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationsApi.unreadList(),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationsApi.markRead(id),

    onSuccess: (updatedNotification) => {
      queryClient.setQueryData<NotificationItem[]>(
        ["notifications"],
        (notifications) =>
          notifications?.map((notification) =>
            notification.id === updatedNotification.id
              ? updatedNotification
              : notification
          )
      );

      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
}