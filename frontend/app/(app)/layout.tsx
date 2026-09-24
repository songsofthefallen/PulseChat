"use client";

import { ServerRail } from "@/components/layout/server-rail";
import { useHeartbeat } from "@/hooks/useHeartbeat"
import { WebSocketProvider } from "@/providers/websocket-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useHeartbeat();

  return (
    <WebSocketProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <ServerRail />
        <div className="flex min-w-0 flex-1">{children}</div>
      </div>
    </WebSocketProvider>
  );
}


