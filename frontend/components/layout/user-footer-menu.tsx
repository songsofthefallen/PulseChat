"use client";

import Link from "next/link";
import { Circle, LogOut, Minus, Moon, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserFooterMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7" aria-label="User menu">
          <Settings className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top">
        <DropdownMenuLabel>Set status</DropdownMenuLabel>
        <DropdownMenuItem>
          <Circle className="size-3 fill-signal text-signal" /> Online
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Moon className="size-3.5 text-idle" /> Idle
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Minus className="size-3.5 text-dnd" /> Do not disturb
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="size-3.5" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" asChild>
          <Link href="/login">
            <LogOut className="size-3.5" /> Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
