import Link from "next/link";
import { AuthShell } from "@/features/auth/auth-shell";
import { VerifyCodeForm } from "@/features/auth/verify-code-form";

export default async function VerifyCodePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthShell
      title="Enter your code"
      description={
        email
          ? `We sent a 6-digit code to ${email}. It expires in 10 minutes.`
          : "Enter the 6-digit code we emailed you."
      }
      footer={
        <Link href="/forgot-password" className="text-accent hover:underline">
          Use a different email
        </Link>
      }
    >
      <VerifyCodeForm email={email ?? ""} />
    </AuthShell>
  );
}
