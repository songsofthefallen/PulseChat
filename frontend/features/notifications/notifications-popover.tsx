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
import { mockNotifications } from "@/constants/mock-data";
import { cn, formatTimestamp } from "@/lib/utils";
import type { NotificationItem } from "@/types";

const ICONS: Record<NotificationItem["type"], React.ReactNode> = {
  mention: <AtSign className="size-4" />,
  reply: <MessageSquare className="size-4" />,
  reaction: <Smile className="size-4" />,
  invite: <UserPlus className="size-4" />,
  system: <Bell className="size-4" />,
};

export function NotificationsPopover() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

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
            onClick={() =>
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
            }
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
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((item) =>
                      item.id === n.id ? { ...item, read: true } : item
                    )
                  )
                }
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-surface-sunken",
                  !n.read && "bg-accent-soft/40"
                )}
              >
                <span className="mt-0.5 text-accent">{ICONS[n.type]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-snug">
                    {n.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {n.body}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {formatTimestamp(n.createdAt)}
                  </span>
                </span>
                {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />}
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
