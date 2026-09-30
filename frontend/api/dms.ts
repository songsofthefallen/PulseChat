import { apiClient } from "./client";
import { DMConversation }from "@/types"

export const dmsApi = {
    listOfConversations: async () => {
    const response = await apiClient.get<DMConversation[]>("/dms");
    return response.data;
  },

  getConversation: async (conversationId: number) => {
    const response = await apiClient.get(
      `/dms/${conversationId}`
    );

    return response.data;
  },

  createConversation: async (userId: number) => {
    const response = await apiClient.post(
      "/dms",
      { user_id: userId }
    );

    return response.data;
  },

    getMessages: async (conversationId: number, beforeId?: number) => {
        const response = await apiClient.get(
            `/dms/${conversationId}/messages`,
            {
                params: {
                    before_id: beforeId,
                },
            }
        );

        return response.data;
    },

    sendMessage: async (
        conversationId: number,
        content: string,
        file?: File
        ) => {
        const formData = new FormData();

        formData.append("content", content);

        if (file) {
            formData.append("file", file);
        }

        const response = await apiClient.post(
            `/dms/${conversationId}/messages`,
            formData
        );

        return response.data;
    },
};