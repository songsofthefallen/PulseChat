"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationsPopover } from "@/features/notifications/notifications-popover";
import { WorkspaceList, ConversationList } from "@/features/dashboard/dashboard-widgets";
import { authApi } from "@/api/auth";
import { useGlobalSearch } from "@/hooks/use-search"
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading: isSearchLoading } =
    useGlobalSearch(searchQuery);

  const users = searchResults?.users ?? [];
  const workspaces = searchResults?.workspaces ?? [];
  const channels = searchResults?.channels ?? [];
  const conversations = searchResults?.conversations ?? [];
  
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PulseChat"
              className="h-8 w-56 pl-8 text-xs"
            />

            {searchQuery.trim() && (
              <div className="absolute right-0 top-10 z-50 w-80 rounded-md border border-border bg-background p-2 shadow-lg">
                {isSearchLoading && (
                  <p className="px-2 py-3 text-sm text-muted-foreground">
                    Searching...
                  </p>
                )}

                {!isSearchLoading &&
                  users.length === 0 &&
                  workspaces.length === 0 &&
                  channels.length === 0 &&
                  conversations.length === 0 && (
                    <p className="px-2 py-3 text-sm text-muted-foreground">
                      No results found.
                    </p>
                  )}

                {workspaces.length > 0 && (
                  <SearchResultGroup label="Workspaces">
                    {workspaces.map((workspace) => (
                      <SearchResultRow
                        key={workspace.id}
                        title={workspace.name}
                        onClick={() => router.push(`/workspaces/${workspace.id}`)}
                      />
                    ))}
                  </SearchResultGroup>
                )}

                {channels.length > 0 && (
                  <SearchResultGroup label="Channels">
                    {channels.map((channel) => (
                      <SearchResultRow
                        key={channel.id}
                        title={`#${channel.name}`}
                        onClick={() =>
                          router.push(
                            `/workspaces/${channel.workspace_id}/channels/${channel.id}`
                          )
                        }
                      />
                    ))}
                  </SearchResultGroup>
                )}

                {conversations.length > 0 && (
                  <SearchResultGroup label="Conversations">
                    {conversations.map((conversation) => (
                      <SearchResultRow
                        key={conversation.id}
                        title={conversation.name ?? `Conversation ${conversation.id}`}
                        onClick={() => router.push(`/dms/${conversation.id}`)}
                      />
                    ))}
                  </SearchResultGroup>
                )}
              </div>
            )}
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
              Direct Messages
            </h2>

            <ConversationList />
          </section>

        </div>
      </div>
    </div>
  );
}

function SearchResultGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 last:mb-0">
      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

function SearchResultRow({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md px-2 py-2 text-left text-sm hover:bg-surface-sunken"
    >
      {title}
    </button>
  );
}