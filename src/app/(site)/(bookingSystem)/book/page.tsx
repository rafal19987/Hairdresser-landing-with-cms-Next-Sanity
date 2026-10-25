import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Rezerwacja wizyty — Rêve",
  description: "Zarezerwuj wizytę w salonie Rêve online.",
};

export default function Page() {
  return (
    <div className="container max-w-7xl pb-24 pt-32">
      <div className="prose mb-8 max-w-none prose-headings:text-white prose-p:text-[#BEBEBE]">
        <h1 className="font-exo text-5xl font-black lg:text-6xl">Rezerwacja</h1>
        <p className="font-robotoCondensed text-xl">
          Wybierz usługę, specjalistę i dogodny termin. Potwierdzenie wyślemy na
          Twój adres email.
        </p>
      </div>
      {/* Search params are read on the client, so the static shell renders without them */}
      <Suspense>
        <BookingFlow />
      </Suspense>
    </div>
  );
}
