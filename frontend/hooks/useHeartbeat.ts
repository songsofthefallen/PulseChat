"use client";

import { useEffect } from "react";
import { presenceApi } from "@/api/presence";

export function useHeartbeat() {
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await presenceApi.heartbeat();
      } catch (error) {
        console.error("Heartbeat failed:", error);
      }
    };

    sendHeartbeat();

    const interval = setInterval(sendHeartbeat, 30_000);

    return () => clearInterval(interval);
  }, []);
}