"use client";

import * as React from "react";

import { useUsers } from "@/hooks/useUsers";
import { useUsersPresence } from "@/hooks/usePresence";
import type { User } from "@/types";

import {
  Avatar,
  AvatarFallback,
  PresenceDot,
  type PresenceStatus,
} from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { initials } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const GROUPS: {
  label: string;
  status: PresenceStatus;
}[] = [
  { label: "Online", status: "online" },
  { label: "Idle", status: "idle" },
  { label: "Do Not Disturb", status: "dnd" },
  { label: "Offline", status: "offline" },
];

export function MembersSidebar() {
  const [query, setQuery] = React.useState("");
  

  // Get real users from the backend
  const {
    data: users = [],
    isLoading,
    error,
  } = useUsers();

  // Get all user IDs
  const userIds = users.map((user) => user.id);

  // Get presence for all users in one request
  const {
    data: presence = [],
  } = useUsersPresence(userIds);
  // Convert:
  // [
  //   { user_id: 1, status: "Online" },
  //   { user_id: 2, status: "Offline" }
  // ]
  //
  // into:
  // Map {
  //   1 => "Online",
  //   2 => "Offline"
  // }
  const presenceMap = new Map(
    presence.map((item) => [item.user_id, item.status])
  );

  // Convert backend presence status to the status
  // expected by PresenceDot
  const getPresenceStatus = (userId: number): PresenceStatus => {
    const status = presenceMap.get(userId);

    if (status === "online") {
      return "online";
    }

    return "offline";
  };

  // Search users
  const filtered = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  if (isLoading) {
    return (
      <aside className="flex h-full w-64 shrink-0 flex-col border-l border-border bg-surface-sunken/40">
        <div className="p-3">
          <p className="text-xs text-muted-foreground">
            Loading members...
          </p>
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="flex h-full w-64 shrink-0 flex-col border-l border-border bg-surface-sunken/40">
        <div className="p-3">
          <p className="text-xs text-destructive">
            Failed to load members.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-l border-border bg-surface-sunken/40">
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members"
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Members */}
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {GROUPS.map((group) => {
          const members = filtered.filter(
            (user) => getPresenceStatus(user.id) === group.status
          );

          if (members.length === 0) {
            return null;
          }

          return (
            <div key={group.status} className="mb-3">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label} — {members.length}
              </p>

              <div className="space-y-0.5">
                {members.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    status={getPresenceStatus(member.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function MemberRow({
  member,
  status,
}: {
  member: User;
  status: PresenceStatus;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-surface">
          <div className="relative">
            <Avatar className="size-8">
              <AvatarFallback>
                {initials(member.username)}
              </AvatarFallback>
            </Avatar>

            <PresenceDot status={status} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight">
              {member.username}
            </p>

            {member.customStatus && (
              <p className="truncate text-xs text-muted-foreground leading-tight">
                {member.customStatus }
              </p>
            )}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent side="left" className="w-64">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-12">
              <AvatarFallback className="text-base">
                {initials(member.username)}
              </AvatarFallback>
            </Avatar>

            <PresenceDot
              status={status}
              className="size-3.5"
            />
          </div>

          <div>
            <p className="font-display font-semibold">
              {member.username}
            </p>

            <p className="text-xs text-muted-foreground">
              @{member.handle}
            </p>
          </div>
        </div>

        {member.customStatus  && (
          <p className="mt-3 rounded-md bg-surface-sunken px-2 py-1.5 text-xs">
            {member.customStatus }
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}