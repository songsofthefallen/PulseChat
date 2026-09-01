import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic-ish relative time formatter for message timestamps. */
export function formatTimestamp(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  const timeZone = "Asia/Manila";
  const locale = "en-PH";

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  });

  const dateString = dateFormatter.format(d);
  const todayString = dateFormatter.format(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayString = dateFormatter.format(yesterday);

  const time = timeFormatter.format(d);

  if (dateString === todayString) {
    return `Today at ${time}`;
  }

  if (dateString === yesterdayString) {
    return `Yesterday at ${time}`;
  }
  return `${dateString} at ${time}`;
}

export function initials(username: string): string {
  return username
    .split(" ")
    .filter(Boolean) 
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}
