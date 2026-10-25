"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { manageLinkApi, toErrorMessage } from "@/lib/booking/api";
import { Notice } from "@/components/booking/StepSection";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ManageLinkRequest: React.FC<{ expired?: boolean }> = ({
  expired,
}) => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Podaj poprawny adres email");
      return;
    }

    setState("sending");
    setError(null);
    try {
      await manageLinkApi.sendLink(email.trim());
      setState("sent");
    } catch (reason) {
      setError(toErrorMessage(reason));
      setState("idle");
    }
  };

  return (
    <div className="flex max-w-xl flex-col gap-6 font-robotoCondensed">
      {expired && (
        <Notice tone="error">
          Ten link jest nieprawidłowy albo wygasł. Wyślemy Ci nowy.
        </Notice>
      )}
      {state === "sent" ? (
        <Notice>
          Jeśli pod adresem {email.trim()} są wizyty, wysłaliśmy na niego nowy
          link. Sprawdź skrzynkę, także folder spam.
        </Notice>
      ) : (
        <form noValidate onSubmit={submit} className="flex flex-col gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-base text-[#ADADAD]">
              Adres email użyty przy rezerwacji
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={cn(
                "w-full border-b-2 bg-transparent py-2 text-lg text-white outline-none transition-colors duration-300",
                error
                  ? "border-red-400"
                  : "border-[#C59D5F]/30 focus:border-[#C59D5F]",
              )}
            />
            {error && <span className="text-sm text-red-300">{error}</span>}
          </label>
          <button
            type="submit"
            disabled={state === "sending"}
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "w-full rounded-none font-robotoCondensed text-lg md:w-fit",
            )}
          >
            {state === "sending" ? "Wysyłam..." : "Wyślij link do wizyt"}
          </button>
        </form>
      )}
    </div>
  );
};
