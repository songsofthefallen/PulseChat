"use client";

import { useQuery } from "@tanstack/react-query";
import { presenceApi } from "@/api/presence";

export function useUsersPresence(userIds: number[]) {
  return useQuery({
    queryKey: ["presence", userIds],
    queryFn: () => presenceApi.getUsersPresence(userIds),
    enabled: userIds.length > 0,
    refetchInterval: 30_000,
  });
}