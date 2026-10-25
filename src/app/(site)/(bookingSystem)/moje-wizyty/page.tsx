import type { Metadata } from "next";
import { ManageLinkRequest } from "@/components/appointments/ManageLinkRequest";
import { PageHeading } from "@/components/appointments/PageHeading";

export const metadata: Metadata = {
  title: "Twoje wizyty — Rêve",
  description: "Otrzymaj link do swoich wizyt w salonie Rêve.",
};

export default function Page() {
  return (
    <div className="container max-w-7xl pb-24 pt-32">
      <PageHeading
        title="Twoje wizyty"
        description="Podaj adres email użyty przy rezerwacji, a wyślemy Ci link do przeglądania, przekładania i anulowania wizyt."
      />
      <ManageLinkRequest />
    </div>
  );
}
