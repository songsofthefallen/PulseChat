"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { dmsApi } from "@/api/dms";
import type { DMMessage, DMConversation, } from "@/types";



export function useDMConversation(conversationId: number) {
  return useQuery<DMConversation>({
    queryKey: ["dm-conversation", conversationId],
    queryFn: () => dmsApi.getConversation(conversationId),
    enabled: !!conversationId,
  });
}

export function useCreateDMConversation() {
  return useMutation({
    mutationFn: (userId: number) =>
      dmsApi.createConversation(userId),
  });
}

export function useDMMessages(conversationId: number) {
    return useQuery<DMMessage[]>({
        queryKey: ["dm-messages", conversationId],
        queryFn: async () => {
            const messages = await dmsApi.getMessages(conversationId);

            return messages.reverse();
        },
        enabled: !!conversationId,
    });
}

export function useSendDMMessage(conversationId: number) {
  return useMutation({
    mutationFn: ({
      content,
      file,
    }: {
      content: string;
      file?: File;
    }) => dmsApi.sendMessage(conversationId, content, file),
  });
}