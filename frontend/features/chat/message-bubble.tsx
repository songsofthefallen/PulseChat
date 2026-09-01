"use client";

import * as React from "react";
import {
  Copy,
  MoreHorizontal,
  Pencil,
  Pin,
  Reply,
  SmilePlus,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatTimestamp, initials } from "@/lib/utils";
import type { Message } from "@/types";

const QUICK_REACTIONS = ["👍", "🎉", "❤️", "😂", "👀"];

function renderContent(content: string) {
  // Minimal, safe markdown-ish rendering: `inline code` and **bold** only.
  const parts = content.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function MessageBubble({
  message ,
  grouped,
  isOwn,
}: {
  message: Message;
  grouped?: boolean;
  isOwn?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={cn(
        "group relative flex gap-3 px-4 py-1 hover:bg-surface-sunken/50",
        !grouped && "mt-3"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-9 shrink-0">
        {!grouped && (
          <Avatar className="size-9">
            <AvatarFallback>{initials(message.author.name)}</AvatarFallback>
          </Avatar>
        )}
        {grouped && hovered && (
          <span className="block pt-0.5 text-[10px] text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {!grouped && (
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-sm">{message.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(message.createdAt)}
            </span>
            {message.pinned && (
              <Badge variant="secondary" className="gap-1 py-0">
                <Pin className="size-2.5" /> Pinned
              </Badge>
            )}
          </div>
        )}
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {renderContent(message.content)}
          {message.editedAt && (
            <span className="ml-1.5 text-[11px] text-muted-foreground">(edited)</span>
          )}
        </p>

        {message.reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {message.reactions.map((r) => (
              <button
                key={r.emoji}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs transition-colors",
                  r.reactedByMe
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border bg-surface-sunken text-muted-foreground hover:border-accent/50"
                )}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {hovered && (
        <div className="absolute -top-4 right-4 flex items-center gap-0.5 rounded-md border border-border bg-surface shadow-sm">
          {QUICK_REACTIONS.slice(0, 1).map((emoji) => (
            <button key={emoji} className="rounded-md p-1.5 hover:bg-surface-sunken" aria-label="Add reaction">
              <SmilePlus className="size-4 text-muted-foreground" />
            </button>
          ))}
          <button className="rounded-md p-1.5 hover:bg-surface-sunken" aria-label="Reply">
            <Reply className="size-4 text-muted-foreground" />
          </button>
          {isOwn && (
            <button className="rounded-md p-1.5 hover:bg-surface-sunken" aria-label="Edit">
              <Pencil className="size-4 text-muted-foreground" />
            </button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-md p-1.5 hover:bg-surface-sunken" aria-label="More">
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Pin className="size-3.5" /> Pin message
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="size-3.5" /> Copy text
              </DropdownMenuItem>
              {isOwn && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2 className="size-3.5" /> Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
