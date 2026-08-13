"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ChannelsSidebar } from "@/components/layout/channels-sidebar";
import { MembersSidebar } from "@/components/layout/members-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MessageList } from "@/features/chat/message-list";
import { Composer } from "@/features/chat/composer";
import { mockChannels, mockMessages, currentUser } from "@/constants/mock-data";
import type { Message } from "@/types";

export default function ChannelPage() {
  const params = useParams<{ serverId: string; channelId: string }>();
  const channel = mockChannels.find((c) => c.id === params.channelId);
  const [messages, setMessages] = React.useState<Message[]>(
    mockMessages.filter((m) => m.channelId === params.channelId)
  );

  function handleSend(content: string) {
    if (!channel) return;
    const optimisticMessage: Message = {
      id: `local-${Date.now()}`,
      channelId: channel.id,
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      attachments: [],
      reactions: [],
    };
    // TODO: replace with messagesApi.send(channel.id, { content })
    setMessages((prev) => [...prev, optimisticMessage]);
  }

  if (!channel) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Channel not found.
      </div>
    );
  }

  return (
    <>
      <ChannelsSidebar serverId={params.serverId} activeChannelId={channel.id} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar channelName={channel.name} channelType={channel.type === "voice" ? "voice" : "text"} topic={channel.topic} />
        <MessageList messages={messages} channelName={channel.name} typingUsers={["Priya"]} />
        <Composer channelName={channel.name} onSend={handleSend} />
      </div>
      <MembersSidebar />
    </>
  );
}
