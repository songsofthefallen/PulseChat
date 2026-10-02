"use client";

import * as React from "react";
import { Hash, MessageSquare, Search, User as UserIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGlobalSearch } from "@/hooks/use-search";

export function SearchDialog({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) {
    console.log("SearchDialog rendered", open);
   const [query, setQuery] = React.useState("");
  const { data: searchResults, isLoading: isSearchLoading } =
    useGlobalSearch(query);

    console.log("search results:", searchResults);
        console.log("qu:", query);


  const users = searchResults?.users ?? [];
  const workspaces = searchResults?.workspaces ?? [];
  const channels = searchResults?.channels ?? [];
  const conversations = searchResults?.conversations ?? [];

  const hasResults =
    users.length +
      workspaces.length +
      channels.length +
      conversations.length >
    0;

  React.useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0" showClose={false}>
        <DialogTitle className="sr-only">Search PulseChat</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
<input
  value={query}
  onChange={(e) => {
    console.log("PLAIN INPUT:", e.target.value);
    setQuery(e.target.value);
  }}
  placeholder="TEST INPUT"
  className="border p-2"
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
          {query && isSearchLoading && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              Searching...
            </p>
          )}

          {query && isSearchLoading && !hasResults && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;.
            </p>
          )}

          {workspaces.length > 0 && (
            <ResultGroup label="Workspaces">
              {workspaces.map((workspace) => (
                <ResultRow
                  key={workspace.id}
                  icon={<Hash className="size-4" />}
                  title={workspace.name}
                />
              ))}
            </ResultGroup>
          )}

          {channels.length > 0 && (
            <ResultGroup label="Channels">
              {channels.map((channel) => (
                <ResultRow
                  key={channel.id}
                  icon={<Hash className="size-4" />}
                  title={`#${channel.name}`}
                />
              ))}
            </ResultGroup>
          )}

          {users.length > 0 && (
            <ResultGroup label="People">
              {users.map((user) => (
                <ResultRow
                  key={user.id}
                  icon={<UserIcon className="size-4" />}
                  title={user.username}
                />
              ))}
            </ResultGroup>
          )}

          {conversations.length > 0 && (
            <ResultGroup label="Conversations">
              {conversations.map((conversation) => (
                <ResultRow
                  key={conversation.id}
                  icon={<MessageSquare className="size-4" />}
                  title={conversation.name ?? `Conversation ${conversation.id}`}
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
