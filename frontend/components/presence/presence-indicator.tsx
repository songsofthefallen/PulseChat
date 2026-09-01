interface PresenceIndicatorProps {
  status: "online" | "offline";
}

export function PresenceIndicator({
  status,
}: PresenceIndicatorProps) {
  return (
    <span>
      {status === "online" ? "🟢" : "⚪"}
    </span>
  );
}