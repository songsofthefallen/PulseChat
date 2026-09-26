"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationsPopover } from "@/features/notifications/notifications-popover";
import {
  ActivityFeed,
  PinnedChannels,
  RecentConversations,
  WorkspaceList,
} from "@/features/dashboard/dashboard-widgets";
import { authApi } from "@/api/auth";
import { NotificationList } from "@/features/notifications/notification-list";

export default function DashboardPage() {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <div>Unable to load user.</div>;
  }

  const firstName = user.username.split(" ")[0];

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <span className="font-display font-semibold">Home</span>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search PulseChat"
              className="h-8 w-56 pl-8 text-xs"
            />
          </div>

          <NotificationsPopover />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="font-display text-2xl font-semibold">
          Good to see you, {firstName}.
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening across your workspaces.
        </p>

        <div className="mt-6 space-y-8">
          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Workspaces
            </h2>

            <WorkspaceList />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Recent Conversations
            </h2>

            <RecentConversations />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Pinned Channels
            </h2>

            <PinnedChannels />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Activity
            </h2>

            <ActivityFeed />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              Notifications
            </h2>

            <NotificationList />
          </section>
        </div>
      </div>
    </div>
  );
}