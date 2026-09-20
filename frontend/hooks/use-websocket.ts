"use client";

import { useEffect, useRef } from "react";

export function useWebSocket(
  channelId: number,
  onMessage: (event: MessageEvent) => void
) {
  const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
    let cancelled = false;

    const ws = new WebSocket("ws://localhost:8000/ws");

    wsRef.current = ws;

    ws.onopen = () => {
        if (cancelled) {
        ws.close();
        return;
        }

        console.log("WebSocket connected");

        ws.send(
        JSON.stringify({
            type: "subscribe",
            channel_id: channelId,
        })
        );
    };

    ws.onmessage = (event) => {
        console.log("WS EVENT:", JSON.parse(event.data));
        if (!cancelled) {
        onMessage(event);
        }
    };

    ws.onerror = (error) => {
        if (!cancelled) {
        console.error("WebSocket error:", error);
        }
    };

    ws.onclose = () => {
        if (!cancelled) {
        console.log("WebSocket disconnected");
        }
    };

    return () => {
        cancelled = true;

        if (ws.readyState === WebSocket.OPEN) {
        ws.close();
        }

        wsRef.current = null;
    };
    }, [channelId]);
      const send = (data: object) => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

        ws.send(JSON.stringify(data));
    };

    return {
        send,
    };
    }