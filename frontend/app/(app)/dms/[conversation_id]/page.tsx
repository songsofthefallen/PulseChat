"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { dmsApi } from "@/api/dms";
import { useDMConversation, useDMMessages, useSendDMMessage } from "@/hooks/use-dms";
import { useWebSocketContext } from "@/providers/websocket-provider";
import type { DMMessage } from "@/types";

export default function DMPage() {
  // --------------------------------------------------
  // Params / context
  // --------------------------------------------------

  const params = useParams();
  const conversationId = Number(params.conversation_id);

  const queryClient = useQueryClient();
  const { subscribeDM } = useWebSocketContext();

  // --------------------------------------------------
  // Refs
  // --------------------------------------------------

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const initialScrollDoneRef = useRef(false);
  const previousScrollHeightRef = useRef(0);
  const hasMoreOlderRef = useRef(true);
  const previousMessageCountRef = useRef(0);
  const shouldScrollToBottomRef = useRef(false);
  // --------------------------------------------------
  // Local state
  // --------------------------------------------------

  const [content, setContent] = useState("");
  const [loadingOlder, setLoadingOlder] = useState(false);

  // --------------------------------------------------
  // Queries
  // --------------------------------------------------

  const {
    data: conversation,
    isLoading: conversationLoading,
    error: conversationError,
  } = useDMConversation(conversationId);

  const { data: messages = [] } = useDMMessages(conversationId);

  // --------------------------------------------------
  // Mutations
  // --------------------------------------------------

  const sendMessage = useSendDMMessage(conversationId);

  // --------------------------------------------------
  // Event handlers
  // --------------------------------------------------

  const handleSendMessage = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    sendMessage.mutate(
      { content: trimmedContent },
      {
        onSuccess: () => {
          setContent("");
        },
      }
    );
  };

  const loadOlderMessages = async () => {
    if (
      loadingOlder ||
      !hasMoreOlderRef.current ||
      messages.length === 0
    ) {
      return;
    }

    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const oldestMessageId = messages[0].id;

    previousScrollHeightRef.current = container.scrollHeight;
    setLoadingOlder(true);

    try {
      const olderMessages: DMMessage[] = await dmsApi.getMessages(
        conversationId,
        oldestMessageId
      );

      if (olderMessages.length === 0) {
        hasMoreOlderRef.current = false;
        previousScrollHeightRef.current = 0;
        return;
      }

      queryClient.setQueryData(
        ["dm-messages", conversationId],
        (currentMessages: DMMessage[] = []) => {
          const existingIds = new Set(
            currentMessages.map((message) => message.id)
          );

          const newMessages = olderMessages
            .reverse()
            .filter((message) => !existingIds.has(message.id));

          return [...newMessages, ...currentMessages];
        }
      );
    } finally {
      setLoadingOlder(false);
    }
  };

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;

    if (
      !container ||
      loadingOlder ||
      !hasMoreOlderRef.current
    ) {
      return;
    }

    if (container.scrollTop <= 50) {
      loadOlderMessages();
    }
  };

  // --------------------------------------------------
  // WebSocket
  // --------------------------------------------------

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    return subscribeDM(conversationId, (data) => {
        if (data.type !== "new_dm_message") {
        return;
        }

        shouldScrollToBottomRef.current = true;

        queryClient.setQueryData(
        ["dm-messages", conversationId],
        (currentMessages: DMMessage[] = []) => {
          if (
            currentMessages.some(
              (message) => message.id === data.message_id
            )
          ) {
            return currentMessages;
          }

          return [
            ...currentMessages,
            {
              id: data.message_id,
              content: data.content,
              created_at: data.created_at,
              user: {
                id: data.user_id,
                username: data.username,
              },
              attachments: [],
            },
          ];
        }
      );
    });
  }, [conversationId, subscribeDM, queryClient]);

  // --------------------------------------------------
  // Reset pagination state when changing conversations
  // --------------------------------------------------

  useEffect(() => {
    initialScrollDoneRef.current = false;
    previousScrollHeightRef.current = 0;
    hasMoreOlderRef.current = true;
  }, [conversationId]);

  // --------------------------------------------------
  // Message pagination / scrolling
  // --------------------------------------------------

  // Automatically load older messages when the first page
  // does not fill the available message area.
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (
      !container ||
      loadingOlder ||
      !hasMoreOlderRef.current ||
      messages.length === 0
    ) {
      return;
    }

    if (container.scrollHeight <= container.clientHeight) {
      previousScrollHeightRef.current = container.scrollHeight;
      loadOlderMessages();
    }
  }, [messages, loadingOlder]);

  // Restore the user's scroll position after older messages
  // are inserted at the top.
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || previousScrollHeightRef.current === 0) {
      return;
    }

    const newScrollHeight = container.scrollHeight;

    const heightDifference =
      newScrollHeight - previousScrollHeightRef.current;

    container.scrollTop += heightDifference;

    previousScrollHeightRef.current = 0;
  }, [messages]);

    useEffect(() => {
        const container = messagesContainerRef.current;

        if (!container || messages.length === 0) {
            return;
        }

        if (!initialScrollDoneRef.current) {
            return;
        }

        const isNearBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
            150;

        if (isNearBottom) {
            container.scrollTop = container.scrollHeight;
        }
        }, [messages]);


    useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || messages.length === 0) {
        return;
    }

    const previousMessageCount = previousMessageCountRef.current;

    if (
        previousMessageCount > 0 &&
        messages.length > previousMessageCount
    ) {
        const addedMessages =
        messages.length - previousMessageCount;

        if (addedMessages === 1) {
        container.scrollTop = container.scrollHeight;
        }
    }

    previousMessageCountRef.current = messages.length;
    }, [messages]);


    useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || !shouldScrollToBottomRef.current) {
        return;
    }

    container.scrollTop = container.scrollHeight;
    shouldScrollToBottomRef.current = false;
    }, [messages]);
  // Initial scroll to the newest message.
  // If the first page does not overflow, wait for auto-fill
  // pagination to finish first.
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (
      !container ||
      messages.length === 0 ||
      (
        hasMoreOlderRef.current &&
        container.scrollHeight <= container.clientHeight
      )
    ) {
      return;
    }

    if (initialScrollDoneRef.current) {
      return;
    }

    container.scrollTop = container.scrollHeight;
    initialScrollDoneRef.current = true;
  }, [messages]);



  // --------------------------------------------------
  // Render guards
  // --------------------------------------------------

  if (conversationLoading) {
    return <div>Loading conversation...</div>;
  }

  if (conversationError) {
    console.error("DM conversation error:", conversationError);
    return <div>Unable to load conversation.</div>;
  }

  if (!conversation) {
    return <div>Conversation not found.</div>;
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col bg-background">

      {/* Conversation header */}
      <header className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <Users className="mr-2 size-4 text-muted-foreground" />

        <div className="min-w-0">
          <h1 className="truncate font-display font-semibold">
            {conversation.participants
              .map((participant) => participant.user.username)
              .join(", ")}
          </h1>

          <p className="text-xs text-muted-foreground">
            {conversation.participants.length} members
          </p>
        </div>
      </header>

      {/* Messages */}
      <main
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-6">

          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-20">
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-accent-soft text-lg text-accent">
                  @
                </div>

                <h2 className="text-lg font-semibold">
                  No messages yet
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Start the conversation.
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
                        {new Date(
                          message.created_at
                        ).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
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
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Message..."
              disabled={sendMessage.isPending}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              onClick={handleSendMessage}
              disabled={
                sendMessage.isPending ||
                !content.trim()
              }
              className="rounded-md bg-accent px-4 py-2 text-xs font-medium text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendMessage.isPending ? "Sending..." : "Send"}
            </button>

          </div>
        </div>
      </footer>

    </div>
  );
}