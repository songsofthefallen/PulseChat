"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { channelsApi } from "@/api/channels";
import { messagesApi } from "@/api/messages";
import { useWebSocket } from "@/hooks/use-websocket";
import { authApi } from "@/api/auth";
import type { MessageRead } from "@/types";


export default function ChannelPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const lastTypingRef = useRef(0);
  const [typingUserId, setTypingUserId] = useState<number | null>(null);
  const [typingUsername, setTypingUsername] = useState<string | null>(null);
  const [readMessages, setReadMessages] = useState<MessageRead[]>([]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markedAsReadRef = useRef<Set<number>>(new Set());
  const workspaceId = Number(params.workspace_id);
  const channelId = Number(params.channel_id);
  const { data: currentUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
  });
  const { send } = useWebSocket(channelId, (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "new_message") {
    queryClient.invalidateQueries({
      queryKey: ["messages", workspaceId, channelId],
    });
  }

  if (data.type === "message_read") {
    setReadMessages((previous) => [
      ...previous,
      {
        user_id: data.user_id,
        message_id: data.message_id,
        read_at: data.read_at,
        username: data.username,
      },
    ]);
  }

  if (data.type === "user_typing") {
    if (!currentUser) {
      return;
    }

  if (data.user_id !== currentUser.id) {
    setTypingUserId(data.user_id);
    setTypingUsername(data.username);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setTypingUserId(null);
        }, 1000);
      }
    }
  });

  const { data: existingReadMessages } = useQuery({
    queryKey: ["message-reads", workspaceId, channelId],
    queryFn: () => messagesApi.getReadMessages(workspaceId, channelId),
  });

  useEffect(() => {
    if (!existingReadMessages) return;

    setReadMessages((previous) => {
      const existing = new Map(
        previous.map((read) => [`${read.user_id}-${read.message_id}`, read])
      );

      for (const read of existingReadMessages) {
        existing.set(`${read.user_id}-${read.message_id}`, read);
      }

      return Array.from(existing.values());
    });
  }, [existingReadMessages]);


  useEffect(() => {
    console.log("Read messages updated:", readMessages);
  }, [readMessages]);

  // Stores whatever the user is currently typing
  const [content, setContent] = useState("");

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["channel", workspaceId, channelId],
    queryFn: () =>
      channelsApi.getOneChannel(workspaceId, channelId),
  });

  const {
    data: messagesResponse,
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", workspaceId, channelId],
    queryFn: () =>
      messagesApi.listByChannel(workspaceId, channelId),
  });

  // Sends a message to the backend
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      messagesApi.send(
        workspaceId,
        channelId,
        content,
      ),

    // Runs after the POST succeeds
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", workspaceId, channelId],
      });

      setContent("");
    },
  });

   const markAsReadMutation = useMutation({
  mutationFn: (messageId: number) =>
    messagesApi.markAsRead(workspaceId, channelId, messageId),
  });

  useEffect(() => {
  if (!messagesResponse?.data) return;

  messagesResponse.data.forEach((message) => {
    if (markedAsReadRef.current.has(message.id)) return;

    markedAsReadRef.current.add(message.id);
    markAsReadMutation.mutate(message.id);
  });
  }, [messagesResponse]);

  if (isLoading) {
    return <div>Loading channel...</div>;
  }

  if (error) {
    return <div>Unable to load channel.</div>;
  }

  const channel = response?.data;
  const messages = messagesResponse?.data ?? [];

  const handleSendMessage = () => {
    const trimmedContent = content.trim();

    // Don't send empty messages
    if (!trimmedContent) {
      return;
    }

    sendMessageMutation.mutate(trimmedContent);
  };

  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col bg-background">

      {/* Channel header */}
      <header className="flex h-14 shrink-0 items-center border-b border-border px-6">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-lg text-muted-foreground">
            #
          </span>

          <h1 className="truncate text-sm font-semibold">
            {channel?.name}
          </h1>

          <div className="mx-2 h-4 w-px bg-border" />

          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            Welcome to #{channel?.name}
          </p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-6">

          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-20">
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-accent-soft text-lg text-accent">
                  #
                </div>

                <h2 className="text-lg font-semibold">
                  Welcome to #{channel?.name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  This is the beginning of this channel.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="group flex gap-3"
                >
                  {/* Avatar */}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                    {message.user.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Message */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold">
                        {message.user.username}
                      </span>

                      <span className="text-[11px] text-muted-foreground">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                      {message.content}
                    </p>

                    {readMessages
                      .filter(
                        (read) =>
                          read.message_id === message.id &&
                          read.user_id !== currentUser?.id
                      )
                      .map((read) => (
                        <span
                          key={read.user_id}
                          className="text-xs text-muted-foreground"
                        >
                          Read by {read.username}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
              {typingUserId !== null && (
                <div className="text-sm text-muted-foreground">
                  {typingUsername} is typing...
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Message composer */}
      <footer className="shrink-0 border-t border-border px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2">

            <button
              type="button"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-lg text-muted-foreground hover:bg-surface-sunken hover:text-foreground"
            >
              +
            </button>

            <input
              type="text"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);

                const now = Date.now();

                if (now - lastTypingRef.current >= 500) {
                  send({
                    type: "typing",
                    channel_id: channelId,
                  });

                  lastTypingRef.current = now;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder={`Message #${channel?.name}`}
              disabled={sendMessageMutation.isPending}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={
                sendMessageMutation.isPending ||
                !content.trim()
              }
              className="rounded-md bg-accent px-4 py-2 text-xs font-medium text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendMessageMutation.isPending ? "Sending..." : "Send"}
            </button>

          </div>
        </div>
      </footer>

    </div>
  );
}