import Link from "next/link";
import { Hash, Pin, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, PresenceDot } from "@/components/ui/avatar";
import { mockChannels, mockMessages, mockUsers } from "@/constants/mock-data";
import { cn, formatTimestamp, initials } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { workspaceApi } from "@/api/workspace";

export function WorkspaceList() {
  const {
    data: workspaces,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceApi.getMyWorkspaces,
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
  const recents = mockMessages
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-1">
      {recents.map((m) => {
        const channel = mockChannels.find((c) => c.id === m.channelId);
        return (
          <Link
            key={m.id}
            href={`/servers/s1/channels/${m.channelId}`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface-sunken"
          >
            <div className="relative">
              <Avatar className="size-9">
                <AvatarFallback>{initials(m.author.name)}</AvatarFallback>
              </Avatar>
              <PresenceDot status={m.author.status} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">
                <span className="font-medium">{m.author.name}</span>{" "}
                <span className="text-muted-foreground">
                  in #{channel?.name ?? "unknown"}
                </span>
              </p>
              <p className="truncate text-xs text-muted-foreground">{m.content}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatTimestamp(m.createdAt)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function PinnedChannels() {
  const pinned = mockChannels.filter((c) => c.isFavorite);
  return (
    <div className="space-y-1">
      {pinned.map((c) => (
        <Link
          key={c.id}
          href={`/servers/${c.serverId}/channels/${c.id}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-sunken"
        >
          <Star className="size-3.5 text-warning" />
          <Hash className="size-3.5 text-muted-foreground" />
          {c.name}
        </Link>
      ))}
      {pinned.length === 0 && (
        <p className="px-3 py-2 text-xs text-muted-foreground">
          Pin a channel to find it here quickly.
        </p>
      )}
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
