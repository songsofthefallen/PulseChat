import { apiClient } from "./client";
import type { SearchResult } from "@/types";

export const searchApi = {
  global: (query: string) =>
    apiClient.get<SearchResult[]>("/search", { params: { q: query } }),
};
