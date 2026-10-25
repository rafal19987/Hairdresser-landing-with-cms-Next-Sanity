import type { Metadata } from "next";
import { VerifyEmail } from "@/components/account/VerifyEmail";
import { PageHeading } from "@/components/appointments/PageHeading";

export const metadata: Metadata = {
  title: "Aktywacja konta — Rêve",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function Page({ params }: { params: { token: string } }) {
  return (
    <div className="container max-w-7xl pb-24 pt-32">
      <PageHeading
        title="Aktywacja konta"
        description="Potwierdzamy Twój adres email."
      />
      <VerifyEmail token={params.token} />
    </div>
  );
}
