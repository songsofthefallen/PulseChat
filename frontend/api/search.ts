import { apiClient } from "./client";
import type { GlobalSearchResponse } from "@/types";

export const searchApi = {
  search: async (query: string) => {
    const response = await apiClient.get<GlobalSearchResponse>("/search", {
      params: { q: query },
    });

    return response.data;
  },
};