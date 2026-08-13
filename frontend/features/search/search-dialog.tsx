"use client";

import * as React from "react";
import { Hash, MessageSquare, Search, User as UserIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mockChannels, mockUsers, mockMessages } from "@/constants/mock-data";
import { cn } from "@/lib/utils";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = React.useState("");

  const users = query
    ? mockUsers.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
    : [];
  const channels = query
    ? mockChannels.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];
  const messages = query
    ? mockMessages.filter((m) => m.content.toLowerCase().includes(query.toLowerCase()))
    : [];

  const hasResults = users.length + channels.length + messages.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0" showClose={false}>
        <DialogTitle className="sr-only">Search PulseChat</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages, channels, and people..."
            className="h-auto border-0 p-0 shadow-none focus-visible:ring-0"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
            Esc
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {!query && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              Start typing to search across your workspace.
            </p>
          )}
          {query && !hasResults && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;.
            </p>
          )}

          {channels.length > 0 && (
            <ResultGroup label="Channels">
              {channels.map((c) => (
                <ResultRow key={c.id} icon={<Hash className="size-4" />} title={`#${c.name}`} />
              ))}
            </ResultGroup>
          )}
          {users.length > 0 && (
            <ResultGroup label="People">
              {users.map((u) => (
                <ResultRow key={u.id} icon={<UserIcon className="size-4" />} title={u.name} subtitle={`@${u.handle}`} />
              ))}
            </ResultGroup>
          )}
          {messages.length > 0 && (
            <ResultGroup label="Messages">
              {messages.map((m) => (
                <ResultRow
                  key={m.id}
                  icon={<MessageSquare className="size-4" />}
                  title={m.author.name}
                  subtitle={m.content}
                />
              ))}
            </ResultGroup>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function ResultRow({
  icon,
  title,
  subtitle,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left hover:bg-surface-sunken",
        className
      )}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        {subtitle && (
          <span className="block truncate text-xs text-muted-foreground">
            {subtitle}
          </span>
        )}
      </span>
    </button>
  );
}
