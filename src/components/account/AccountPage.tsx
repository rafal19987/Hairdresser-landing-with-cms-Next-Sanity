"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { accountApi } from "@/lib/account/api";
import { displayName, useSession } from "@/lib/account/session";
import { AppointmentsManager } from "@/components/appointments/AppointmentsManager";
import { PageHeading } from "@/components/appointments/PageHeading";
import { Notice } from "@/components/booking/StepSection";
import { Skeleton } from "@/components/booking/Skeleton";
import { LoginForm, RegisterForm } from "@/components/account/AuthForms";
import { ProfileForm } from "@/components/account/ProfileForm";

type Tab = "login" | "register";

// Only same-site paths, so a crafted link cannot redirect to another domain after login
const safeNext = (next: string | null) =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : null;

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="border-b-2 border-[#C59D5F]/20 pb-4 font-robotoCondensed text-2xl font-bold text-white">
    {children}
  </h2>
);

const AuthPanel: React.FC<{ expired: boolean }> = ({ expired }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("login");
  const next = safeNext(searchParams.get("next"));

  return (
    <>
      <PageHeading
        title="Twoje konto"
        description="Zaloguj się, aby zobaczyć swoje wizyty i rezerwować szybciej."
      />
      {expired && (
        <div className="mb-6">
          <Notice tone="error">Sesja wygasła. Zaloguj się ponownie.</Notice>
        </div>
      )}
      <div role="tablist" className="mb-8 flex gap-8">
        {(
          [
            ["login", "Logowanie"],
            ["register", "Rejestracja"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "relative py-2 font-robotoCondensed text-2xl transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#C59D5F] after:transition-all after:duration-300",
              tab === value
                ? "text-white after:w-full"
                : "text-[#BEBEBE] after:w-0 hover:text-white hover:after:w-full",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "login" ? (
        <LoginForm onLoggedIn={() => next && router.push(next)} />
      ) : (
        <RegisterForm />
      )}
    </>
  );
};

export const AccountPage: React.FC = () => {
  const session = useSession();
  const [expired, setExpired] = useState(false);

  const handleUnauthorized = useCallback(() => {
    setExpired(true);
    void accountApi.logout();
  }, []);

  if (session === undefined) {
    return (
      <div aria-busy className="flex flex-col gap-6">
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!session) return <AuthPanel expired={expired} />;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <PageHeading
          title={`Cześć, ${session.client.firstName || displayName(session.client)}`}
          description="Tu znajdziesz swoje wizyty i dane konta."
        />
        <button
          type="button"
          onClick={() => void accountApi.logout()}
          className="mb-8 font-robotoCondensed text-lg text-[#BEBEBE] underline-offset-4 hover:text-white hover:underline"
        >
          Wyloguj się
        </button>
      </div>
      <div className="flex flex-col gap-16">
        <AppointmentsManager
          api={accountApi.appointments}
          onUnauthorized={handleUnauthorized}
        />
        <section className="flex flex-col gap-6">
          <SectionHeading>Twoje dane</SectionHeading>
          <ProfileForm onUnauthorized={handleUnauthorized} />
        </section>
      </div>
    </>
  );
};
