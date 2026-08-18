"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { channelsApi } from "@/api/channels";

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

  if (isLoading) {
    return <div>Loading channels...</div>;
  }

  if (error) {
    return <div>Unable to load channels.</div>;
  }

  const channels = response?.data ?? [];

  return (
    <div>
      <h1>Workspace</h1>

      {channels.map((channel) => (
        <div key={channel.id}>
          #{channel.name}
        </div>
      ))}
    </div>
  );
}