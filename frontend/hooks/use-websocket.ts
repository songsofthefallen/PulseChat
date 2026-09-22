"use client";

import { useEffect, useRef } from "react";

export function useWebSocket(
  channelId: number,
  onMessage: (event: MessageEvent) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
  onMessageRef.current = onMessage;
}, [onMessage]);

    useEffect(() => {
    let cancelled = false;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
        if (cancelled) return;

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
        if (!cancelled) {
            onMessageRef.current(event);
        }
        };

        ws.onerror = (error) => {
        if (!cancelled) {
            console.error("WebSocket error:", error);
        }
        };

        ws.onclose = () => {
        if (cancelled) {
            return;
        }

        console.log("WebSocket disconnected");

        reconnectTimeout = setTimeout(() => {
            console.log("Reconnecting WebSocket...");
            connect();
        }, 1000);
        };
    };

    connect();

    return () => {
        cancelled = true;

        if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        }

        if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
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