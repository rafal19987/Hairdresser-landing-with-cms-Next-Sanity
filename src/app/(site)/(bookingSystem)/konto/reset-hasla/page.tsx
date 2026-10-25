import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/PasswordReset";
import { PageHeading } from "@/components/appointments/PageHeading";

export const metadata: Metadata = {
  title: "Nie pamiętasz hasła? — Rêve",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="container max-w-7xl pb-24 pt-32">
      <PageHeading
        title="Nie pamiętasz hasła?"
        description="Podaj adres email konta, a wyślemy link do ustawienia nowego hasła."
      />
      <ForgotPasswordForm />
    </div>
  );
}
