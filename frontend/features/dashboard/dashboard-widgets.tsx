import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/dashboard";
import { dmsApi } from "@/api/dms";

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

export function ConversationList() {
  const {
    data: conversations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dm-conversations"],
    queryFn: dmsApi.listOfConversations,
  });

  if (isLoading) {
    return <p>Loading direct messages...</p>;
  }

  if (error) {
    return <p>Unable to load direct messages.</p>;
  }

  if (conversations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            No direct messages yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={`/dms/${conversation.id}`}
        >
          <Card className="transition-colors hover:border-accent/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                {conversation.participants
                  .map((participant) => participant.user.username[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {conversation.participants
                    .map((participant) => participant.user.username)
                    .join(", ")}
                </p>

                <p className="text-xs text-muted-foreground">
                  Direct message
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
  

