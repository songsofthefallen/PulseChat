import Link from "next/link";
import { Hash, Pin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, PresenceDot } from "@/components/ui/avatar";
import { mockChannels, mockMessages, mockUsers } from "@/constants/mock-data";
import { cn, formatTimestamp, initials } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/dashboard";

export function WorkspaceList() {
  const {
    data: workspaces,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: dashboardApi.getMyWorkspaces,
  });

  if (isLoading) {
    return <p>Loading workspaces...</p>;
  }

  if (error) {
    return <p>Unable to load workspaces.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {workspaces?.map((workspace) => (
        <Link
          key={workspace.id}
          href={`/workspaces/${workspace.id}`}
        >
          <Card className="h-full transition-colors hover:border-accent/50">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-sm font-semibold text-accent">
                  {workspace.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              </div>

              <p className="truncate text-sm font-medium">
                {workspace.name}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function RecentConversations() {
  const {
    data: conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", "recent-conversations"],
    queryFn: dashboardApi.getRecentConversations,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Unable to load recent conversations.
      </p>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <p className="px-3 py-2 text-sm text-muted-foreground">
        No recent conversations.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((message) => (
        <Link
          key={message.id}
          href={`/workspaces/${message.channel.workspace_id}/channels/${message.channel_id}`}
          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-sunken"
        >
          <Avatar className="size-9">
            <AvatarFallback>
              {initials(message.user.username)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">
              <span className="font-medium">
                {message.user.username}
              </span>{" "}
              <span className="text-muted-foreground">
                in #{message.channel.name}
              </span>
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {message.content}
            </p>
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {formatTimestamp(message.created_at)}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function PinnedChannels() {
  const {
    data: pinned,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard", "pinned-channels"],
    queryFn: dashboardApi.getPinnedChannels,
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Unable to load pinned channels.
      </p>
    );
  }

  if (!pinned || pinned.length === 0) {
    return (
      <p className="px-3 py-2 text-xs text-muted-foreground">
        Pin a channel to find it here quickly.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {pinned.map((channel) => (
        <Link
          key={channel.id}
          href={`/workspaces/${channel.workspace_id}/channels/${channel.id}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-sunken"
        >
          <Star className="size-3.5 text-warning" />
          <Hash className="size-3.5 text-muted-foreground" />
          {channel.name}
        </Link>
      ))}
    </div>
  );
}

const ACTIVITY = [
  { id: "a1", user: mockUsers[1], text: "created #design-review", time: "2h ago" },
  { id: "a2", user: mockUsers[2], text: "joined Indie Hackers", time: "5h ago" },
  { id: "a3", user: mockUsers[4], text: "pinned a message in #general", time: "1d ago" },
];

export function ActivityFeed() {
  return (
    <div className="space-y-3">
      {ACTIVITY.map((item, i) => (
        <div key={item.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <Avatar className="size-7">
              <AvatarFallback className="text-[10px]">
                {initials(item.user.name)}
              </AvatarFallback>
            </Avatar>
            {i < ACTIVITY.length - 1 && (
              <span className="mt-1 w-px flex-1 bg-border" />
            )}
          </div>
          <div className={cn("pb-3", i === ACTIVITY.length - 1 && "pb-0")}>
            <p className="text-sm">
              <span className="font-medium">{item.user.name}</span>{" "}
              <span className="text-muted-foreground">{item.text}</span>
            </p>
            <p className="text-xs text-muted-foreground">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
