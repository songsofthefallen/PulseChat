"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockServers } from "@/constants/mock-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function RailIcon({
  active,
  label,
  children,
  href,
  hasMention,
}: {
  active?: boolean;
  label: string;
  children: React.ReactNode;
  href: string;
  hasMention?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          aria-label={label}
          className="relative flex items-center justify-center"
        >
          <span
            className={cn(
              "absolute -left-3 h-2 w-1 rounded-r-full bg-foreground transition-all",
              active ? "h-8 opacity-100" : hasMention ? "h-2 opacity-100" : "opacity-0"
            )}
          />
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-2xl bg-surface-sunken text-sm font-semibold transition-all hover:rounded-xl",
              active && "rounded-xl bg-accent text-accent-foreground"
            )}
          >
            {children}
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function ServerRail() {
  const pathname = usePathname();
  const match = pathname.match(/^\/servers\/([^/]+)/);
  const activeServerId = match?.[1];

  return (
    <TooltipProvider delayDuration={200}>
      <nav className="flex h-full w-[72px] shrink-0 flex-col items-center gap-2 bg-surface-sunken/60 py-3">
        <RailIcon href="/dashboard" label="Home" active={!activeServerId}>
          <Avatar className="size-11 rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-accent text-accent-foreground">
              PC
            </AvatarFallback>
          </Avatar>
        </RailIcon>

        <div className="my-1 h-px w-8 bg-border" />

        <div className="flex flex-col items-center gap-2 overflow-y-auto">
          {mockServers.map((server) => (
            <RailIcon
              key={server.id}
              href={`/servers/${server.id}/channels/c3`}
              label={server.name}
              active={server.id === activeServerId}
              hasMention={server.hasMention || server.unreadCount > 0}
            >
              {server.name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </RailIcon>
          ))}
        </div>

        <button
          aria-label="Add or join a server"
          className="flex size-11 items-center justify-center rounded-2xl bg-surface-sunken text-signal transition-all hover:rounded-xl hover:bg-signal-soft"
        >
          <Plus className="size-5" />
        </button>
        <button
          aria-label="Explore servers"
          className="flex size-11 items-center justify-center rounded-2xl bg-surface-sunken text-accent transition-all hover:rounded-xl hover:bg-accent-soft"
        >
          <Compass className="size-5" />
        </button>
      </nav>
    </TooltipProvider>
  );
}
