"use client";

import * as React from "react";
import { AtSign, Bell, MessageSquare, Smile, UserPlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatTimestamp } from "@/lib/utils";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notifications";
import { NotificationItem } from "@/types";
import {
  getNotificationTitle,
  getNotificationBody,
} from "@/features/notifications/notification-utils";


const ICONS: Record<NotificationItem["type"], React.ReactNode> = {
  mention: <AtSign className="size-4" />,
  reply: <MessageSquare className="size-4" />,
  reaction: <Smile className="size-4" />,
  invite: <UserPlus className="size-4" />,
  system: <Bell className="size-4" />,
  message: <MessageSquare className="size-4" />,
};

export function NotificationsPopover() {
  const { data: notifications = [] } = useNotifications();
  const { data: unreadData } = useUnreadNotificationCount();

  const markNotificationRead = useMarkNotificationRead();
  const markAllNotificationsRead = useMarkAllNotificationsRead();

  const unreadCount = unreadData?.count ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <Badge
              variant="count"
              className="absolute -right-1 -top-1 px-1 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-display font-semibold text-sm">Notifications</p>
          <button
            className="text-xs text-accent hover:underline"
              onClick={() => markAllNotificationsRead.mutate()}
          >
            Mark all read
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <EmptyState />
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                  onClick={() => {
                    if (!n.is_read) {
                      markNotificationRead.mutate(n.id);
                    }
                  }}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-surface-sunken",
                  !n.is_read && "bg-accent-soft/40"
                )}
              >
                <span className="mt-0.5 text-accent">{ICONS[n.type]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-snug">
                    {n.actor_username ?? getNotificationTitle(n.type)}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {n.message_content ?? getNotificationBody(n.type)}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {formatTimestamp(n.created_at)}
                  </span>
                </span>
                {!n.is_read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
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
