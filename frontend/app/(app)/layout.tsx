import { ServerRail } from "@/components/layout/server-rail";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <ServerRail />
      <div className="flex min-w-0 flex-1">{children}</div>
    </div>
  );
}
