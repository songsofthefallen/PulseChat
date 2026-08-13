import { AuthShell } from "@/features/auth/auth-shell";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell
      title="Set a new password"
      description="Choose a strong password you haven't used before."
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
