"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { toErrorMessage } from "@/lib/booking/api";
import { accountApi } from "@/lib/account/api";
import { Notice } from "@/components/booking/StepSection";
import { Skeleton } from "@/components/booking/Skeleton";
import {
  EMAIL_PATTERN,
  Field,
  inputClass,
  primaryButtonClass,
} from "@/components/forms/FormField";

type State =
  | { status: "loading" }
  | { status: "verified"; linkedAppointments: number }
  | { status: "failed"; message: string };

const ResendForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <Notice>
        Jeśli konto z adresem {email.trim()} czeka na aktywację, wysłaliśmy nowy
        link.
      </Notice>
    );
  }

  return (
    <form
      noValidate
      className="flex max-w-xl flex-col gap-6"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!EMAIL_PATTERN.test(email.trim())) return;
        await accountApi
          .resendVerification(email.trim())
          .catch(() => undefined);
        setSent(true);
      }}
    >
      <Field label="Adres email konta">
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass()}
        />
      </Field>
      <button type="submit" className={primaryButtonClass}>
        Wyślij nowy link aktywacyjny
      </button>
    </form>
  );
};

export const VerifyEmail: React.FC<{ token: string }> = ({ token }) => {
  const [state, setState] = useState<State>({ status: "loading" });
  // Verification tokens are single-use; React strict mode would call the effect twice
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    accountApi
      .verifyEmail(token)
      .then(({ linkedAppointments }) =>
        setState({ status: "verified", linkedAppointments }),
      )
      .catch((reason) =>
        setState({ status: "failed", message: toErrorMessage(reason) }),
      );
  }, [token]);

  if (state.status === "loading") {
    return (
      <div aria-busy className="flex max-w-xl flex-col gap-4">
        <Skeleton className="h-14" />
        <Skeleton className="h-11 w-48" />
      </div>
    );
  }

  if (state.status === "failed") {
    return (
      <div className="flex flex-col gap-8">
        <Notice tone="error">
          Link aktywacyjny jest nieprawidłowy albo wygasł ({state.message}).
          Podaj adres email, a wyślemy nowy.
        </Notice>
        <ResendForm />
      </div>
    );
  }

  return (
    <div className="flex max-w-xl flex-col items-start gap-6">
      <Notice>
        Konto jest aktywne.
        {state.linkedAppointments > 0 &&
          ` Przypisaliśmy do niego wcześniejsze wizyty (${state.linkedAppointments}).`}
      </Notice>
      <Link
        href="/konto"
        className={cn(
          buttonVariants({ variant: "primary", size: "lg" }),
          "rounded-none font-robotoCondensed text-lg",
        )}
      >
        Zaloguj się
      </Link>
    </div>
  );
};
