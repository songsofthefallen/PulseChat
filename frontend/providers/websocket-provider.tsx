"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useRef } from "react";
import { useWebSocket } from "@/hooks/use-websocket";

type WebSocketContextValue = {
  send: (data: object) => void;
  subscribe: (
    channelId: number,
    onMessage: (data: any) => void
  ) => () => void;
};

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const listenersRef = useRef(
    new Map<number, Set<(data: any) => void>>()
  );
  
  const queryClient = useQueryClient();
  const { send } = useWebSocket((event) => {
    const data = JSON.parse(event.data);

    console.log("GLOBAL WS:", data);

    if (data.type === "user_online" || data.type === "user_offline") {
  queryClient.setQueriesData(
    { queryKey: ["presence"] },
    (previous: any) => {
      if (!previous) {
        return previous;
      }

      return previous.map((item: any) =>
        item.user_id === data.user_id
          ? {
              ...item,
              status: data.type === "user_online" ? "online" : "offline",
            }
          : item
      );
    }
  );
}

    if (data.channel_id) {
      const listeners = listenersRef.current.get(data.channel_id);

      listeners?.forEach((listener) => {
        listener(data);
      });
    }
  });

  const subscribe = (
    channelId: number,
    onMessage: (data: any) => void
  ) => {
    if (!listenersRef.current.has(channelId)) {
      listenersRef.current.set(channelId, new Set());

      send({
        type: "subscribe",
        channel_id: channelId,
      });
    }

    listenersRef.current.get(channelId)!.add(onMessage);

    return () => {
      const listeners = listenersRef.current.get(channelId);

      if (!listeners) {
        return;
      }

      listeners.delete(onMessage);

      if (listeners.size === 0) {
        listenersRef.current.delete(channelId);
      }
    };
  };

  return (
    <WebSocketContext.Provider value={{ send, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error("useWebSocketContext must be used inside WebSocketProvider");
  }

  return context;
}