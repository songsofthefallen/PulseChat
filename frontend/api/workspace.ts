import { apiClient } from "./client";

export interface Workspace {
  id: number;
  name: string;
}

export const workspaceApi = {
  getMyWorkspaces: async (): Promise<Workspace[]> => {
    const response = await apiClient.get("/workspaces");

    return response.data;
  },
};