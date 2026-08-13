import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationsPopover } from "@/features/notifications/notifications-popover";
import {
  ActivityFeed,
  PinnedChannels,
  RecentConversations,
  WorkspaceList,
} from "@/features/dashboard/dashboard-widgets";
import { currentUser } from "@/constants/mock-data";

export default function DashboardPage() {
  const firstName = currentUser.name.split(" ")[0];

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <span className="font-display font-semibold">Home</span>
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search PulseChat" className="h-8 w-56 pl-8 text-xs" />
          </div>
          <NotificationsPopover />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="font-display text-2xl font-semibold">
          Good to see you, {firstName}.
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your workspaces.
        </p>

        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your workspaces
          </h2>
          <WorkspaceList />
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Recent conversations
            </h2>
            <RecentConversations />
          </section>

          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Pinned channels
              </h2>
              <PinnedChannels />
            </section>
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Activity
              </h2>
              <ActivityFeed />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
