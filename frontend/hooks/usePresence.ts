"use client";

import { useQuery } from "@tanstack/react-query";
import { presenceApi } from "@/api/presence";

type UserPresence = {
  user_id: number;
  status: "online" | "offline";
};

export function useUsersPresence(userIds: number[]) {
  return useQuery<UserPresence[]>({
    queryKey: ["presence", userIds],
    queryFn: () => presenceApi.getUsersPresence(userIds),
    enabled: userIds.length > 0,
    refetchInterval: 30_000,
  });
}