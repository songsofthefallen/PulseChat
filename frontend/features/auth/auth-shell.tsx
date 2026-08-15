import { PulseWaveform } from "@/components/ui/pulse-waveform";

const currentYear = new Date().getFullYear();

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between bg-surface-sunken p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_20%,var(--accent-soft),transparent_55%)]" />
        <div className="relative flex items-center gap-2">
          <PulseWaveform className="h-4" />
          <span className="font-display text-lg font-semibold tracking-tight">
            PulseChat
          </span>
        </div>
        <div className="relative max-w-sm">
          <p className="font-display text-3xl leading-snug">
            Every conversation, in sync.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Servers, channels, and DMs in one fast, focused workspace —
            built for teams who'd rather be talking than waiting on a page
            to load.
          </p>
        </div>
        <p className="relative text-xs text-muted-foreground">
          © {currentYear} PulseChat
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <PulseWaveform className="h-4" />
            <span className="font-display text-lg font-semibold">PulseChat</span>
          </div>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
