import { apiClient } from "./client";

export interface UserPresence {
  user_id: number;
  status: "online" | "offline";
}

export const presenceApi = {
  heartbeat: async () => {
    const response = await apiClient.post("/users/me/heartbeat");
    return response.data;
  },

  getPresence: async (userId: number) => {
    const response = await apiClient.get(`/users/${userId}/presence`);
    return response.data;
  },

 getUsersPresence: async (userIds: number[]) => {
  const params = new URLSearchParams();

  userIds.forEach((id) => {
    params.append("user_ids", id.toString());
  });

  const response = await apiClient.get("/users/presence", {
    params,
  });

  return response.data;
},
};