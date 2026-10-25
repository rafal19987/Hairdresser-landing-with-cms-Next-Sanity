"use client";

import { useEffect, useState } from "react";
import { toErrorMessage } from "@/lib/booking/api";
import { accountApi, type ClientProfile } from "@/lib/account/api";
import { Notice } from "@/components/booking/StepSection";
import { Skeleton } from "@/components/booking/Skeleton";
import {
  Checkbox,
  Field,
  PHONE_PATTERN,
  inputClass,
  primaryButtonClass,
} from "@/components/forms/FormField";

export const ProfileForm: React.FC<{ onUnauthorized: () => void }> = ({
  onUnauthorized,
}) => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    accountApi
      .getProfile()
      .then(setProfile)
      .catch((reason) =>
        reason?.status === 401
          ? onUnauthorized()
          : setError(toErrorMessage(reason)),
      );
  }, [onUnauthorized]);

  if (!profile) {
    return error ? (
      <Notice tone="error">{error}</Notice>
    ) : (
      <div aria-busy className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  const phoneError =
    profile.phone && !PHONE_PATTERN.test(profile.phone.trim())
      ? "Podaj poprawny numer telefonu"
      : undefined;

  const update =
    (field: "firstName" | "lastName" | "phone") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSaved(false);
      setProfile({ ...profile, [field]: event.target.value });
    };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (phoneError || !profile.firstName?.trim()) return;

    setSaving(true);
    setError(null);
    try {
      setProfile(
        await accountApi.updateProfile({
          firstName: profile.firstName.trim(),
          lastName: profile.lastName?.trim() || undefined,
          phone: profile.phone?.trim() || undefined,
          marketingConsent: profile.marketingConsent,
        }),
      );
      setSaved(true);
    } catch (reason) {
      setError(toErrorMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={submit}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      {(error || saved) && (
        <div className="md:col-span-2">
          {error ? (
            <Notice tone="error">{error}</Notice>
          ) : (
            <Notice>Dane zostały zapisane.</Notice>
          )}
        </div>
      )}
      <Field
        label="Imię"
        error={!profile.firstName?.trim() ? "Podaj imię" : undefined}
      >
        <input
          autoComplete="given-name"
          value={profile.firstName ?? ""}
          onChange={update("firstName")}
          maxLength={100}
          className={inputClass()}
        />
      </Field>
      <Field label="Nazwisko" optional>
        <input
          autoComplete="family-name"
          value={profile.lastName ?? ""}
          onChange={update("lastName")}
          maxLength={100}
          className={inputClass()}
        />
      </Field>
      <Field label="Email" hint="Adresu email nie można zmienić">
        <input value={profile.email} readOnly className={inputClass()} />
      </Field>
      <Field label="Telefon" optional error={phoneError}>
        <input
          type="tel"
          autoComplete="tel"
          value={profile.phone ?? ""}
          onChange={update("phone")}
          maxLength={30}
          className={inputClass(phoneError)}
        />
      </Field>
      <div className="md:col-span-2">
        <Checkbox
          checked={profile.marketingConsent}
          onChange={(marketingConsent) => {
            setSaved(false);
            setProfile({ ...profile, marketingConsent });
          }}
        >
          Chcę otrzymywać informacje o nowościach i promocjach salonu.
        </Checkbox>
      </div>
      <div className="md:col-span-2">
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? "Zapisuję..." : "Zapisz dane"}
        </button>
      </div>
    </form>
  );
};
