"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  BookingApiError,
  bookingApi,
  toErrorMessage,
  type AppointmentsApi,
} from "@/lib/booking/api";
import type { ManagedAppointments, SalonSettings } from "@/lib/booking/types";
import { Notice } from "@/components/booking/StepSection";
import { Shimmer } from "@/components/booking/Skeleton";
import {
  AppointmentCard,
  PastAppointmentRow,
  formatDateTime,
} from "@/components/appointments/AppointmentCard";

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="border-b-2 border-[#C59D5F]/20 pb-4 font-robotoCondensed text-2xl font-bold text-white">
    {children}
  </h2>
);

const CardSkeleton: React.FC = () => (
  <div
    aria-hidden
    className="relative h-36 overflow-hidden bg-gradient-to-br from-[#0d0d0d] to-[#2b2b2b]"
  >
    <Shimmer />
  </div>
);

export const AppointmentsManager: React.FC<{
  api: AppointmentsApi;
  onUnauthorized: () => void;
}> = ({ api, onUnauthorized }) => {
  const [salon, setSalon] = useState<SalonSettings | null>(null);
  const [data, setData] = useState<ManagedAppointments | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleError = useCallback(
    (reason: unknown) => {
      if (reason instanceof BookingApiError && reason.status === 401) {
        onUnauthorized();
        return;
      }
      setError(toErrorMessage(reason));
    },
    [onUnauthorized],
  );

  const load = useCallback(
    () => api.list().then(setData).catch(handleError),
    [api, handleError],
  );

  useEffect(() => {
    bookingApi.getSalon().then(setSalon).catch(handleError);
    load();
  }, [handleError, load]);

  // The card closes its panel as soon as the API confirms; the list refreshes in the background
  const afterChange = (message: string) => {
    setSuccess(message);
    void load();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) return <Notice tone="error">{error}</Notice>;

  if (!salon || !data) {
    return (
      <div aria-busy className="flex flex-col gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {success && <Notice>{success}</Notice>}

      <section className="flex flex-col gap-6">
        <SectionHeading>Nadchodzące wizyty</SectionHeading>
        {data.upcoming.length === 0 ? (
          <div className="flex flex-col items-start gap-6">
            <Notice>Nie masz zaplanowanych wizyt.</Notice>
            <Link
              href="/book"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "rounded-none font-robotoCondensed text-lg",
              )}
            >
              Zarezerwuj wizytę
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {data.upcoming.map((appointment) => (
              <li key={appointment.uuid}>
                <AppointmentCard
                  appointment={appointment}
                  salon={salon}
                  onCancel={async (reason) => {
                    await api.cancel(appointment.uuid, reason);
                    afterChange(
                      `Wizyta ${appointment.serviceName} została anulowana. Potwierdzenie wysłaliśmy mailem.`,
                    );
                  }}
                  loadRescheduleSlots={(date) =>
                    api.rescheduleSlots(appointment.uuid, date)
                  }
                  onReschedule={async (startsAt) => {
                    await api.reschedule(appointment.uuid, startsAt);
                    afterChange(
                      `Wizyta ${appointment.serviceName} została przełożona na ${formatDateTime(startsAt, salon.timeZone)}.`,
                    );
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {data.past.length > 0 && (
        <section className="flex flex-col gap-2">
          <SectionHeading>Historia</SectionHeading>
          <ul>
            {data.past.map((appointment) => (
              <PastAppointmentRow
                key={appointment.uuid}
                appointment={appointment}
                timeZone={salon.timeZone}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
