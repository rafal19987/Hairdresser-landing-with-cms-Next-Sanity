"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (values: BookingFormValues) => {
  const errors: Partial<Record<keyof BookingFormValues, string>> = {};

  if (!values.firstName.trim()) errors.firstName = "Podaj imię";
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Podaj poprawny adres email";
  }
  if (values.phone && !/^[+\d\s()-]{6,30}$/.test(values.phone.trim())) {
    errors.phone = "Podaj poprawny numer telefonu";
  }

  return errors;
};

const Field: React.FC<{
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}> = ({ label, error, optional, children }) => (
  <label className="flex flex-col gap-2 font-robotoCondensed">
    <span className="text-base text-[#ADADAD]">
      {label}
      {optional && <span className="text-[#ADADAD]/60"> (opcjonalnie)</span>}
    </span>
    {children}
    {error && <span className="text-sm text-red-300">{error}</span>}
  </label>
);

const inputClass = (error?: string) =>
  cn(
    "w-full border-b-2 bg-transparent py-2 font-robotoCondensed text-lg text-white outline-none transition-colors duration-300 placeholder:text-[#ADADAD]/50",
    error ? "border-red-400" : "border-[#C59D5F]/30 focus:border-[#C59D5F]",
  );

export const BookingForm: React.FC<{
  submitting: boolean;
  onSubmit: (values: BookingFormValues) => void;
}> = ({ submitting, onSubmit }) => {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [touched, setTouched] = useState(false);
  const errors = touched ? validate(values) : {};

  const update =
    (field: keyof BookingFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);

    if (Object.keys(validate(values)).length === 0) onSubmit(values);
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
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
          Na podany adres wyślemy potwierdzenie z linkiem, pod którym
          sprawdzisz, przełożysz lub anulujesz wizytę.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "w-full rounded-none font-robotoCondensed text-lg md:w-fit",
          )}
        >
          {submitting ? "Rezerwuję..." : "Zarezerwuj wizytę"}
        </button>
      </div>
    </form>
  );
};
