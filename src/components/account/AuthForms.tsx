"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toErrorMessage } from "@/lib/booking/api";
import { accountApi, isUnverifiedEmailError } from "@/lib/account/api";
import { Notice } from "@/components/booking/StepSection";
import {
  Checkbox,
  EMAIL_PATTERN,
  Field,
  PHONE_PATTERN,
  inputClass,
  primaryButtonClass,
} from "@/components/forms/FormField";

const MIN_PASSWORD_LENGTH = 8;

export const ResendVerification: React.FC<{ email: string }> = ({ email }) => {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  if (state === "sent") {
    return <Notice>Wysłaliśmy nowy link aktywacyjny na {email}.</Notice>;
  }

  return (
    <button
      type="button"
      disabled={state === "sending"}
      onClick={async () => {
        setState("sending");
        await accountApi.resendVerification(email).catch(() => undefined);
        setState("sent");
      }}
      className="self-start font-robotoCondensed text-base text-[#C59D5F] underline-offset-4 hover:underline"
    >
      {state === "sending" ? "Wysyłam..." : "Wyślij link aktywacyjny ponownie"}
    </button>
  );
};

export const LoginForm: React.FC<{ onLoggedIn: () => void }> = ({
  onLoggedIn,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setUnverified(false);

    if (!EMAIL_PATTERN.test(email.trim()) || !password) {
      setError("Podaj email i hasło");
      return;
    }

    setSubmitting(true);
    try {
      await accountApi.login(email.trim(), password);
      onLoggedIn();
    } catch (reason) {
      setUnverified(isUnverifiedEmailError(reason));
      setError(
        isUnverifiedEmailError(reason)
          ? "Konto nie jest jeszcze aktywne. Kliknij link z wiadomości, którą wysłaliśmy po rejestracji."
          : toErrorMessage(reason),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form noValidate onSubmit={submit} className="flex max-w-xl flex-col gap-6">
      {error && <Notice tone="error">{error}</Notice>}
      {unverified && <ResendVerification email={email.trim()} />}
      <Field label="Email">
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass()}
        />
      </Field>
      <Field label="Hasło">
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass()}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={submitting}
          className={primaryButtonClass}
        >
          {submitting ? "Logowanie..." : "Zaloguj się"}
        </button>
        <Link
          href="/konto/reset-hasla"
          className="font-robotoCondensed text-base text-[#BEBEBE] underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Nie pamiętasz hasła?
        </Link>
      </div>
    </form>
  );
};

interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  repeatPassword: string;
  marketingConsent: boolean;
}

const validateRegistration = (values: RegisterValues) => {
  const errors: Partial<Record<keyof RegisterValues, string>> = {};

  if (!values.firstName.trim()) errors.firstName = "Podaj imię";
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Podaj poprawny adres email";
  }
  if (values.phone && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Podaj poprawny numer telefonu";
  }
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków`;
  }
  if (values.repeatPassword !== values.password) {
    errors.repeatPassword = "Hasła nie są takie same";
  }

  return errors;
};

export const RegisterForm: React.FC = () => {
  const [values, setValues] = useState<RegisterValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    repeatPassword: "",
    marketingConsent: false,
  });
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const errors = touched ? validateRegistration(values) : {};

  const update =
    (field: keyof RegisterValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    setError(null);
    if (Object.keys(validateRegistration(values)).length > 0) return;

    setSubmitting(true);
    try {
      await accountApi.register({
        email: values.email.trim(),
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim() || undefined,
        phone: values.phone.trim() || undefined,
        marketingConsent: values.marketingConsent,
      });
      setRegistered(true);
    } catch (reason) {
      setError(toErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  if (registered) {
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <Notice>
          Konto zostało utworzone. Wysłaliśmy na {values.email.trim()} link
          aktywacyjny — kliknij go, aby się zalogować. Wcześniejsze wizyty
          umówione na ten adres pojawią się w Twoim koncie po aktywacji.
        </Notice>
        <ResendVerification email={values.email.trim()} />
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      className="grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2"
    >
      {error && (
        <div className="md:col-span-2">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      <Field label="Imię" error={errors.firstName}>
        <input
          autoComplete="given-name"
          value={values.firstName}
          onChange={update("firstName")}
          maxLength={100}
          className={inputClass(errors.firstName)}
        />
      </Field>
      <Field label="Nazwisko" optional>
        <input
          autoComplete="family-name"
          value={values.lastName}
          onChange={update("lastName")}
          maxLength={100}
          className={inputClass()}
        />
      </Field>
      <Field label="Email" error={errors.email}>
        <input
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={update("email")}
          className={inputClass(errors.email)}
        />
      </Field>
      <Field label="Telefon" optional error={errors.phone}>
        <input
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={update("phone")}
          maxLength={30}
          className={inputClass(errors.phone)}
        />
      </Field>
      <Field
        label="Hasło"
        error={errors.password}
        hint={`Co najmniej ${MIN_PASSWORD_LENGTH} znaków`}
      >
        <input
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={update("password")}
          className={inputClass(errors.password)}
        />
      </Field>
      <Field label="Powtórz hasło" error={errors.repeatPassword}>
        <input
          type="password"
          autoComplete="new-password"
          value={values.repeatPassword}
          onChange={update("repeatPassword")}
          className={inputClass(errors.repeatPassword)}
        />
      </Field>
      <div className="md:col-span-2">
        <Checkbox
          checked={values.marketingConsent}
          onChange={(marketingConsent) =>
            setValues((current) => ({ ...current, marketingConsent }))
          }
        >
          Chcę otrzymywać informacje o nowościach i promocjach salonu.
        </Checkbox>
      </div>
      <div className={cn("md:col-span-2")}>
        <button
          type="submit"
          disabled={submitting}
          className={primaryButtonClass}
        >
          {submitting ? "Tworzę konto..." : "Załóż konto"}
        </button>
      </div>
    </form>
  );
};
