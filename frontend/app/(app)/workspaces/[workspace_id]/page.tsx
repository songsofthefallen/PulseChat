"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { channelsApi } from "@/api/channels";
import { workspaceApi} from "@/api/workspace";
import Link from "next/link";

export default function WorkspacePage() {
  const params = useParams();

  const workspaceId = Number(params.workspace_id);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["channels", workspaceId],
    queryFn: () => channelsApi.listByWorkspace(workspaceId),
  });

  const {
    data: workspaceResponse,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => workspaceApi.getOneWorkspace(workspaceId),
  });

  if (isLoading) {
    return <div>Loading channels...</div>;
  }

  if (error) {
    return <div>Unable to load channels.</div>;
  }

  const channels = response?.data ?? [];



  const workspace = workspaceResponse?.data;

 return (
  <div className="flex min-h-screen">
    <aside className="w-64 border-r border-border p-4">
      <h1 className="mb-4 text-lg font-semibold">
        {workspace?.name}
      </h1>

      <div className="space-y-1">
        {channels.map((channel) => (
          <Link
            key={channel.id}
            href={`/workspaces/${workspaceId}/channels/${channel.id}`}
            className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-surface-sunken"
          >
            <span className="mr-2 text-muted-foreground">
              #
            </span>

            {channel.name}
          </Link>
        ))}
      </div>
    </aside>

    <main className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">
          Welcome to the workspace
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Select a channel to start chatting.
        </p>
      </div>
    </main>
  </div>
);
}
