import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { BookingResult } from "@/lib/booking/types";

export interface BookingSummary {
  serviceName: string;
  employee: string;
  date: string;
  time: string;
  price: string;
  email: string;
}

export const BookingConfirmation: React.FC<{
  result: BookingResult;
  summary: BookingSummary;
  onBookAnother: () => void;
}> = ({ result, summary, onBookAnother }) => {
  const confirmed = result.status === "confirmed";

  return (
    <section className="flex flex-col items-center gap-8 py-12 text-center">
      <span className="font-exo text-6xl font-black text-[#C59D5F]">
        {confirmed ? "Do zobaczenia!" : "Dziękujemy!"}
      </span>
      <p className="max-w-xl font-robotoCondensed text-xl text-[#BEBEBE]">
        {confirmed
          ? "Twoja wizyta jest potwierdzona."
          : "Rezerwacja została przyjęta i czeka na potwierdzenie przez salon."}{" "}
        Szczegóły i link do zarządzania wizytą wysłaliśmy na{" "}
        <strong className="font-normal text-white">{summary.email}</strong>.
      </p>
      <dl className="grid w-full max-w-xl grid-cols-[auto_1fr] gap-x-8 gap-y-3 bg-gradient-to-br from-[#000000] to-[#434343] p-6 text-left font-robotoCondensed text-lg">
        <dt className="text-[#ADADAD]">Usługa</dt>
        <dd className="text-white">{summary.serviceName}</dd>
        <dt className="text-[#ADADAD]">Specjalista</dt>
        <dd className="text-white">{summary.employee}</dd>
        <dt className="text-[#ADADAD]">Termin</dt>
        <dd className="text-white">
          {summary.date}, {summary.time}
        </dd>
        <dt className="text-[#ADADAD]">Cena</dt>
        <dd className="text-white">{summary.price}</dd>
      </dl>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={onBookAnother}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-none font-robotoCondensed text-lg text-white",
          )}
        >
          Umów kolejną wizytę
        </button>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "rounded-none font-robotoCondensed text-lg",
          )}
        >
          Strona główna
        </Link>
      </div>
    </section>
  );
};
