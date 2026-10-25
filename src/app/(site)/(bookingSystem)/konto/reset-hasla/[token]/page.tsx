import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/account/PasswordReset";
import { PageHeading } from "@/components/appointments/PageHeading";

export const metadata: Metadata = {
  title: "Nowe hasło — Rêve",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function Page({ params }: { params: { token: string } }) {
  return (
    <div className="container max-w-7xl pb-24 pt-32">
      <PageHeading
        title="Nowe hasło"
        description="Ustaw nowe hasło do swojego konta."
      />
      <ResetPasswordForm token={params.token} />
    </div>
  );
}
