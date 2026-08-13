"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronDown,
  Hash,
  Search,
  Settings,
  Star,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCategories, mockChannels, currentUser } from "@/constants/mock-data";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, PresenceDot } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserFooterMenu } from "./user-footer-menu";

export function ChannelsSidebar({
  serverId,
  activeChannelId,
}: {
  serverId: string;
  activeChannelId?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

  const categories = mockCategories.filter((c) => c.serverId === serverId);
  const channels = mockChannels.filter(
    (c) =>
      c.serverId === serverId &&
      c.name.toLowerCase().includes(query.toLowerCase())
  );
  const favorites = channels.filter((c) => c.isFavorite);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-surface-sunken/40 border-r border-border">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <span className="truncate font-display font-semibold">PulseChat HQ</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels"
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {favorites.length > 0 && (
          <ChannelGroup
            title="Favorites"
            icon={<Star className="size-3" />}
            collapsed={!!collapsed.favorites}
            onToggle={() =>
              setCollapsed((s) => ({ ...s, favorites: !s.favorites }))
            }
          >
            {favorites.map((ch) => (
              <ChannelRow
                key={ch.id}
                serverId={serverId}
                channel={ch}
                active={ch.id === activeChannelId}
              />
            ))}
          </ChannelGroup>
        )}

        {categories.map((cat) => {
          const items = channels.filter((c) => c.categoryId === cat.id);
          if (items.length === 0) return null;
          return (
            <ChannelGroup
              key={cat.id}
              title={cat.name}
              collapsed={!!collapsed[cat.id]}
              onToggle={() =>
                setCollapsed((s) => ({ ...s, [cat.id]: !s[cat.id] }))
              }
            >
              {items.map((ch) => (
                <ChannelRow
                  key={ch.id}
                  serverId={serverId}
                  channel={ch}
                  active={ch.id === activeChannelId}
                />
              ))}
            </ChannelGroup>
          );
        })}

        {channels.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            No channels match &ldquo;{query}&rdquo;.
          </p>
        )}
      </nav>

      <UserFooter />
    </aside>
  );
}

function ChannelGroup({
  title,
  icon,
  collapsed,
  onToggle,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-1 px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        <ChevronDown
          className={cn("size-3 transition-transform", collapsed && "-rotate-90")}
        />
        {icon}
        {title}
      </button>
      {!collapsed && <div className="space-y-0.5">{children}</div>}
    </div>
  );
}

function ChannelRow({
  serverId,
  channel,
  active,
}: {
  serverId: string;
  channel: (typeof mockChannels)[number];
  active: boolean;
}) {
  return (
    <Link
      href={`/servers/${serverId}/channels/${channel.id}`}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
        active
          ? "bg-surface text-foreground"
          : "text-muted-foreground hover:bg-surface hover:text-foreground",
        channel.mentionCount > 0 && !active && "text-foreground"
      )}
    >
      {channel.type === "voice" ? (
        <Volume2 className="size-4 shrink-0" />
      ) : (
        <Hash className="size-4 shrink-0" />
      )}
      <span className="truncate flex-1">{channel.name}</span>
      {channel.mentionCount > 0 && (
        <Badge variant="count">{channel.mentionCount}</Badge>
      )}
      {channel.mentionCount === 0 && channel.unreadCount > 0 && (
        <span className="size-1.5 rounded-full bg-foreground" />
      )}
    </Link>
  );
}

function UserFooter() {
  return (
    <div className="flex items-center gap-2 border-t border-border p-2">
      <div className="relative">
        <Avatar className="size-8">
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <PresenceDot status={currentUser.status} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight">
          {currentUser.name}
        </p>
        <p className="truncate text-xs text-muted-foreground leading-tight">
          {currentUser.customStatus ?? "Online"}
        </p>
      </div>
      <UserFooterMenu />
    </div>
  );
}
