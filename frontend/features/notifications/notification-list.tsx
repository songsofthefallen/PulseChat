"use client";

import { Bell } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notifications";
import {
  getNotificationTitle,
  getNotificationBody,
} from "@/features/notifications/notification-utils";

export function NotificationList() {
  const { data: notifications = [] } = useNotifications();

  const markNotificationRead = useMarkNotificationRead();
  const markAllNotificationsRead = useMarkAllNotificationsRead();

  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-display text-sm font-semibold">Notifications</p>

        <button
          className="text-xs text-accent hover:underline"
          onClick={() => markAllNotificationsRead.mutate()}
        >
          Mark all read
        </button>
      </div>

      <div>
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => {
                if (!notification.is_read) {
                  markNotificationRead.mutate(notification.id);
                }
              }}
              className="flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-surface-sunken"
            >
              <Bell className="mt-0.5 size-4 shrink-0 text-accent" />

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">
                  {getNotificationTitle(notification.type)}
                </span>

                <span className="block text-xs text-muted-foreground">
                  {getNotificationBody(notification.type)}
                </span>

                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {formatTimestamp(notification.created_at)}
                </span>
              </span>

              {!notification.is_read && (
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}


function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <Bell className="size-6 text-muted-foreground" />
      <p className="text-sm font-medium">You&apos;re all caught up</p>
      <p className="text-xs text-muted-foreground">
        Mentions, replies, and invites will show up here.
      </p>
    </div>
  );
}