import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/account/PasswordReset";
import { PageHeading } from "@/components/appointments/PageHeading";

export const metadata: Metadata = {
  title: "Nowe hasło — Rêve",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

// Awaiting params works on Next 14 and is required from Next 15
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="container max-w-7xl pb-24 pt-32">
      <PageHeading
        title="Nowe hasło"
        description="Ustaw nowe hasło do swojego konta."
      />
      <ResetPasswordForm token={token} />
    </div>
  );
}
