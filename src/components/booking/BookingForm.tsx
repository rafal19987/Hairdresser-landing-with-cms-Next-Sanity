"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  EMAIL_PATTERN,
  Field,
  PHONE_PATTERN,
  inputClass,
  primaryButtonClass,
} from "@/components/forms/FormField";
import { displayName, type SessionClient } from "@/lib/account/session";

export interface BookingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note: string;
}

const EMPTY_VALUES: BookingFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  note: "",
};

const validate = (values: BookingFormValues, asClient: boolean) => {
  const errors: Partial<Record<keyof BookingFormValues, string>> = {};
  if (asClient) return errors;

  if (!values.firstName.trim()) errors.firstName = "Podaj imię";
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Podaj poprawny adres email";
  }
  if (values.phone && !PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = "Podaj poprawny numer telefonu";
  }

  return errors;
};

export const BookingForm: React.FC<{
  submitting: boolean;
  client?: SessionClient | null;
  loginHref: string;
  onLogout?: () => void;
  onSubmit: (values: BookingFormValues) => void;
}> = ({ submitting, client, loginHref, onLogout, onSubmit }) => {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [touched, setTouched] = useState(false);
  const errors = touched ? validate(values, Boolean(client)) : {};

  const update =
    (field: keyof BookingFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);

    if (Object.keys(validate(values, Boolean(client))).length === 0) {
      onSubmit(values);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {client ? (
        <p className="font-robotoCondensed text-lg text-[#BEBEBE] md:col-span-2">
          Rezerwujesz jako{" "}
          <span className="text-white">{displayName(client)}</span> (
          {client.email}).{" "}
          <button
            type="button"
            onClick={onLogout}
            className="text-[#C59D5F] underline-offset-4 hover:underline"
          >
            To nie Ty? Wyloguj się
          </button>
        </p>
      ) : (
        <>
          <Field label="Imię" error={errors.firstName}>
            <input
              className={inputClass(errors.firstName)}
              value={values.firstName}
              onChange={update("firstName")}
              autoComplete="given-name"
              maxLength={100}
            />
          </Field>
          <Field label="Nazwisko" optional>
            <input
              className={inputClass()}
              value={values.lastName}
              onChange={update("lastName")}
              autoComplete="family-name"
              maxLength={100}
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              className={inputClass(errors.email)}
              value={values.email}
              onChange={update("email")}
              autoComplete="email"
            />
          </Field>
          <Field label="Telefon" optional error={errors.phone}>
            <input
              type="tel"
              className={inputClass(errors.phone)}
              value={values.phone}
              onChange={update("phone")}
              autoComplete="tel"
              maxLength={30}
            />
          </Field>
        </>
      )}
      <div className="md:col-span-2">
        <Field label="Uwagi do wizyty" optional>
          <textarea
            className={cn(inputClass(), "min-h-20 resize-y")}
            value={values.note}
            onChange={update("note")}
            maxLength={200}
            rows={2}
          />
        </Field>
      </div>
      <div className="flex flex-col gap-4 md:col-span-2">
        <p className="font-robotoCondensed text-sm text-[#ADADAD]">
          {client ? (
            <>
              Wizyta pojawi się w Twoim{" "}
              <Link href="/konto" className="text-[#C59D5F] hover:underline">
                koncie
              </Link>
              , a potwierdzenie wyślemy na {client.email}.
            </>
          ) : (
            <>
              Na podany adres wyślemy potwierdzenie z linkiem, pod którym
              sprawdzisz, przełożysz lub anulujesz wizytę. Masz konto?{" "}
              <Link href={loginHref} className="text-[#C59D5F] hover:underline">
                Zaloguj się
              </Link>
              .
            </>
          )}
        </p>
        <button
          type="submit"
          disabled={submitting}
          className={primaryButtonClass}
        >
          {submitting ? "Rezerwuję..." : "Zarezerwuj wizytę"}
        </button>
      </div>
    </form>
  );
};
