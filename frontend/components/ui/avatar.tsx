"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-9 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-accent-soft text-accent text-xs font-semibold",
        className
      )}
      {...props}
    />
  );
}

type PresenceStatus = "online" | "idle" | "dnd" | "offline";

function PresenceDot({
  status,
  className,
}: {
  status: PresenceStatus;
  className?: string;
}) {
  const color = {
    online: "bg-signal",
    idle: "bg-idle",
    dnd: "bg-dnd",
    offline: "bg-offline",
  }[status];

  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 block size-2.5 rounded-full ring-2 ring-surface",
        color,
        className
      )}
      aria-label={status}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, PresenceDot };
export type { PresenceStatus };
