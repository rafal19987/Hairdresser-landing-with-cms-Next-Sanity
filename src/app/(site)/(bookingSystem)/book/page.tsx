import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { PageHeading } from "@/components/appointments/PageHeading";

export const metadata: Metadata = {
  title: "Rezerwacja wizyty — Rêve",
  description: "Zarezerwuj wizytę w salonie Rêve online.",
};

export default function Page() {
  return (
    <div className="container max-w-7xl pb-24 pt-32">
      <PageHeading
        title="Rezerwacja"
        description="Wybierz usługę, specjalistę i dogodny termin. Potwierdzenie wyślemy na Twój adres email."
      />
      {/* Search params are read on the client, so the static shell renders without them */}
      <Suspense>
        <BookingFlow />
      </Suspense>
    </div>
  );
}
