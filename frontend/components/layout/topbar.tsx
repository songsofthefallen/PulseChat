"use client";

import * as React from "react";
import { Hash, Moon, Search, Sun, Users, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { SearchDialog } from "@/features/search/search-dialog";
import { NotificationsPopover } from "@/features/notifications/notifications-popover";

export function Topbar({
  channelName,
  channelType = "text",
  topic,
  onToggleMembers,
}: {
  channelName: string;
  channelType?: "text" | "voice";
  topic?: string;
  onToggleMembers?: () => void;
}) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-2">
          {channelType === "voice" ? (
            <Volume2 className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <Hash className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate font-display font-semibold">{channelName}</span>
          {topic && (
            <>
              <span className="hidden text-muted-foreground sm:inline">·</span>
              <span className="hidden truncate text-sm text-muted-foreground sm:inline">
                {topic}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden rounded border border-border px-1 text-[10px] md:inline">
              ⌘K
            </kbd>
          </Button>
          <NotificationsPopover />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
          {onToggleMembers && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle members"
              className="xl:hidden"
              onClick={onToggleMembers}
            >
              <Users className="size-4" />
            </Button>
          )}
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
