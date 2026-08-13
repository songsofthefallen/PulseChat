import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PulseWaveform } from "@/components/ui/pulse-waveform";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <PulseWaveform active={false} className="h-5 opacity-60" />
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to PulseChat</Link>
      </Button>
    </div>
  );
}
