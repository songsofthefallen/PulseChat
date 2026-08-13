"use client";

import * as React from "react";
import { mockUsers } from "@/constants/mock-data";
import { Avatar, AvatarFallback, PresenceDot, type PresenceStatus } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { initials } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const GROUPS: { label: string; status: PresenceStatus }[] = [
  { label: "Online", status: "online" },
  { label: "Idle", status: "idle" },
  { label: "Do Not Disturb", status: "dnd" },
  { label: "Offline", status: "offline" },
];

export function MembersSidebar() {
  const [query, setQuery] = React.useState("");

  const filtered = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="hidden xl:flex h-full w-64 shrink-0 flex-col border-l border-border bg-surface-sunken/40">
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
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {GROUPS.map((group) => {
          const members = filtered.filter((u) => u.status === group.status);
          if (members.length === 0) return null;
          return (
            <div key={group.status} className="mb-3">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label} — {members.length}
              </p>
              <div className="space-y-0.5">
                {members.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function MemberRow({ member }: { member: (typeof mockUsers)[number] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-surface">
          <div className="relative">
            <Avatar className="size-8">
              <AvatarFallback>{initials(member.name)}</AvatarFallback>
            </Avatar>
            <PresenceDot status={member.status} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight">
              {member.name}
            </p>
            {member.customStatus && (
              <p className="truncate text-xs text-muted-foreground leading-tight">
                {member.customStatus}
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
                {initials(member.name)}
              </AvatarFallback>
            </Avatar>
            <PresenceDot status={member.status} className="size-3.5" />
          </div>
          <div>
            <p className="font-display font-semibold">{member.name}</p>
            <p className="text-xs text-muted-foreground">@{member.handle}</p>
          </div>
        </div>
        {member.customStatus && (
          <p className="mt-3 rounded-md bg-surface-sunken px-2 py-1.5 text-xs">
            {member.customStatus}
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
