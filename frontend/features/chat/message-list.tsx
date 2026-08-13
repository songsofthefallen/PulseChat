"use client";

import * as React from "react";
import { Hash, Loader2 } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { PulseWaveform } from "@/components/ui/pulse-waveform";
import { currentUser } from "@/constants/mock-data";
import type { Message } from "@/types";

const GROUP_WINDOW_MS = 5 * 60 * 1000;

export function MessageList({
  messages,
  channelName,
  typingUsers = [],
}: {
  messages: Message[];
  channelName: string;
  typingUsers?: string[];
}) {
  const [loadingMore, setLoadingMore] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, []);

  React.useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          // TODO: fetch older page via messagesApi.list(channelId, cursor)
          setTimeout(() => setLoadingMore(false), 800);
        }
      },
      { threshold: 1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadingMore]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div ref={topRef} className="flex justify-center py-3">
        {loadingMore && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      </div>

      <div className="flex flex-col items-start gap-3 border-b border-border px-4 pb-6">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-sunken">
          <Hash className="size-7 text-muted-foreground" />
        </div>
        <div>
          <p className="font-display text-xl font-semibold">#{channelName}</p>
          <p className="text-sm text-muted-foreground">
            This is the start of the #{channelName} channel.
          </p>
        </div>
      </div>

      <div className="py-2">
        {messages.map((message, i) => {
          const prev = messages[i - 1];
          const grouped =
            !!prev &&
            prev.author.id === message.author.id &&
            new Date(message.createdAt).getTime() -
              new Date(prev.createdAt).getTime() <
              GROUP_WINDOW_MS;
          return (
            <MessageBubble
              key={message.id}
              message={message}
              grouped={grouped}
              isOwn={message.author.id === currentUser.id}
            />
          );
        })}
      </div>

      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
          <PulseWaveform className="h-3" />
          <span>
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing…
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
