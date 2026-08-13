import { cn } from "@/lib/utils";

/**
 * PulseChat's signature motif: a 3-bar waveform used anywhere something is
 * "live" — typing indicators, active voice channels, presence. Static (no
 * animation) when `active` is false, so it never nags when nothing is
 * happening.
 */
function PulseWaveform({
  active = true,
  className,
  barClassName,
}: {
  active?: boolean;
  className?: string;
  barClassName?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5 h-3", className)}
      role="img"
      aria-label={active ? "active" : "inactive"}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "w-0.5 h-full rounded-full bg-accent",
            active && "pulse-bar",
            barClassName
          )}
          style={active ? { animationDelay: `${i * 0.15}s` } : { transform: "scaleY(0.5)" }}
        />
      ))}
    </span>
  );
}

export { PulseWaveform };
