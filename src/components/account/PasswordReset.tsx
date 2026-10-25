"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { toErrorMessage } from "@/lib/booking/api";
import { accountApi } from "@/lib/account/api";
import { Notice } from "@/components/booking/StepSection";
import {
  EMAIL_PATTERN,
  Field,
  inputClass,
  primaryButtonClass,
} from "@/components/forms/FormField";

const MIN_PASSWORD_LENGTH = 8;

const LoginLink: React.FC = () => (
  <Link
    href="/konto"
    className={cn(
      buttonVariants({ variant: "primary", size: "lg" }),
      "rounded-none font-robotoCondensed text-lg",
    )}
  >
    Zaloguj się
  </Link>
);

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex max-w-xl flex-col items-start gap-6">
        <Notice>
          Jeśli konto z adresem {email.trim()} istnieje, wysłaliśmy na nie link
          do zmiany hasła. Link jest ważny przez 60 minut.
        </Notice>
        <Link
          href="/konto"
          className="font-robotoCondensed text-lg text-[#C59D5F] underline-offset-4 hover:underline"
        >
          Wróć do logowania
        </Link>
      </div>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Podaj poprawny adres email");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await accountApi.forgotPassword(email.trim());
      setSent(true);
    } catch (reason) {
      setError(toErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form noValidate onSubmit={submit} className="flex max-w-xl flex-col gap-6">
      {error && <Notice tone="error">{error}</Notice>}
      <Field label="Email konta">
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass()}
        />
      </Field>
      <button
        type="submit"
        disabled={submitting}
        className={primaryButtonClass}
      >
        {submitting ? "Wysyłam..." : "Wyślij link"}
      </button>
    </form>
  );
};

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const passwordError =
    touched && password.length < MIN_PASSWORD_LENGTH
      ? `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków`
      : undefined;
  const repeatError =
    touched && repeatPassword !== password
      ? "Hasła nie są takie same"
      : undefined;

  if (done) {
    return (
      <div className="flex max-w-xl flex-col items-start gap-6">
        <Notice>
          Hasło zostało zmienione. Wylogowaliśmy Cię na wszystkich urządzeniach
          — zaloguj się nowym hasłem.
        </Notice>
        <LoginLink />
      </div>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    setError(null);
    if (password.length < MIN_PASSWORD_LENGTH || repeatPassword !== password) {
      return;
    }

    setSubmitting(true);
    try {
      await accountApi.resetPassword(token, password);
      setDone(true);
    } catch (reason) {
      setError(toErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form noValidate onSubmit={submit} className="flex max-w-xl flex-col gap-6">
      {error && (
        <div className="flex flex-col items-start gap-3">
          <Notice tone="error">{error}</Notice>
          <Link
            href="/konto/reset-hasla"
            className="font-robotoCondensed text-base text-[#C59D5F] underline-offset-4 hover:underline"
          >
            Wyślij nowy link
          </Link>
        </div>
      )}
      <Field
        label="Nowe hasło"
        error={passwordError}
        hint={`Co najmniej ${MIN_PASSWORD_LENGTH} znaków`}
      >
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass(passwordError)}
        />
      </Field>
      <Field label="Powtórz hasło" error={repeatError}>
        <input
          type="password"
          autoComplete="new-password"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          className={inputClass(repeatError)}
        />
      </Field>
      <button
        type="submit"
        disabled={submitting}
        className={primaryButtonClass}
      >
        {submitting ? "Zapisuję..." : "Ustaw nowe hasło"}
      </button>
    </form>
  );
};
