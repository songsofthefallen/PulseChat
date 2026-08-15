"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authApi   } from "@/api/auth";
import axios from "axios"

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export function VerifyCodeForm({ email }: { email: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [digits, setDigits] = React.useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(RESEND_COOLDOWN_SECONDS);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  React.useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const code = digits.join("");

  function updateDigit(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    setError(null);

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < CODE_LENGTH) {
      setError("Enter all 6 digits");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await authApi.verifyResetCode(email, code)
      router.push(`/reset-password`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
            setError("Your code has expired. Please request a new one.");
        }
        else if (error.response?.status === 401) {
          setError("That code is incorrect. Please try again");
        }
        else {
          setError("Something went wrong. Please try again.");
        }
      }
      
      setDigits(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    // TODO: replace with authApi.resendResetCode(email).
    toast({ title: "Code resent", description: `Check ${email} for a new code.` });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={digit}
            onChange={(e) => updateDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            aria-invalid={!!error}
            className="h-12 w-11 rounded-md border border-border bg-surface text-center text-lg font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-accent aria-invalid:border-danger"
          />
        ))}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Verify code
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Didn&apos;t get a code?{" "}
        {cooldown > 0 ? (
          <span>Resend in {cooldown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-accent hover:underline"
          >
            Resend code
          </button>
        )}
      </p>
    </form>
  );
}
