import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PulseWaveform } from "@/components/ui/pulse-waveform";

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <PulseWaveform active={false} className="h-5 opacity-60" />
      <h1 className="font-display text-2xl font-semibold">Your session has ended</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        For your security, you were signed out after a period of inactivity.
        Sign in again to keep chatting.
      </p>
      <Button asChild>
        <Link href="/login">Sign in again</Link>
      </Button>
    </div>
  );
}
