import { apiClient } from "./client";
import type { RecentConversation, PinnedChannel } from "@/types";


export interface Workspace {
  id: number;
  name: string;
}

export const dashboardApi = {
  getMyWorkspaces: async (): Promise<Workspace[]> => {
    const response = await apiClient.get("/dashboard/workspaces");
    return response.data;
  },

  getOneWorkspace: (workspaceId: number) =>
  apiClient.get<Workspace>(`/dashboard/workspaces/${workspaceId}`),

  getRecentConversations: async (): Promise<RecentConversation[]> => {
    const response = await apiClient.get("/dashboard/recent-conversations");
    return response.data;
  },

  getPinnedChannels: async (): Promise<PinnedChannel[]> => {
    const response = await apiClient.get("/dashboard/pinned-channels");
    return response.data;
  },
};