"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { firstOpenDay, bookableDays, localDate } from "@/lib/booking/dates";
import type {
  AppointmentStatus,
  AvailableSlot,
  ManagedAppointment,
  SalonSettings,
} from "@/lib/booking/types";
import { SlotPicker } from "@/components/booking/SlotPicker";
import { Notice } from "@/components/booking/StepSection";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Oczekuje na potwierdzenie",
  confirmed: "Potwierdzona",
  rescheduled: "Przełożona",
  cancelled: "Anulowana",
  completed: "Zakończona",
};

const formatParts = (iso: string, timeZone: string) => {
  const date = new Date(iso);
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("pl-PL", { timeZone, ...options })
      .format(date)
      .replace(".", "");

  return {
    weekday: part({ weekday: "long" }),
    day: part({ day: "numeric" }),
    month: part({ month: "long" }),
    year: part({ year: "numeric" }),
    time: part({ hour: "2-digit", minute: "2-digit" }),
  };
};

// Day and month formatted together, so the month is declined (26 października)
export const formatDateTime = (iso: string, timeZone: string) => {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat("pl-PL", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  const time = new Intl.DateTimeFormat("pl-PL", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${day}, ${time}`;
};

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const StatusBadge: React.FC<{ status: AppointmentStatus }> = ({ status }) => (
  <span
    className={cn(
      "inline-block border px-2 py-0.5 font-robotoCondensed text-sm",
      status === "confirmed" && "border-[#C59D5F] text-[#C59D5F]",
      status === "pending" && "border-[#BEBEBE]/40 text-[#BEBEBE]",
      status === "rescheduled" && "border-[#C59D5F]/50 text-[#C59D5F]/80",
      status === "cancelled" && "border-red-400/40 text-red-300",
      status === "completed" && "border-[#ADADAD]/30 text-[#ADADAD]",
    )}
  >
    {STATUS_LABELS[status]}
  </span>
);

type Panel = "none" | "cancel" | "reschedule";

export const AppointmentCard: React.FC<{
  appointment: ManagedAppointment;
  salon: SalonSettings;
  onCancel: (reason: string) => Promise<void>;
  onReschedule: (startsAt: string) => Promise<void>;
}> = ({ appointment, salon, onCancel, onReschedule }) => {
  const [panel, setPanel] = useState<Panel>("none");
  const [reason, setReason] = useState("");
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<AvailableSlot | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const start = formatParts(appointment.startsAt, salon.timeZone);
  const end = formatParts(appointment.endsAt, salon.timeZone);
  const canChange = Boolean(appointment.changeableUntil);
  const canReschedule =
    canChange && appointment.serviceId && appointment.employeeId;

  const open = (next: Panel) => {
    setError(null);
    setSlot(null);
    if (next === "reschedule" && !date) {
      setDate(
        firstOpenDay(salon, bookableDays(salon)) ??
          localDate(new Date(), salon.timeZone),
      );
    }
    setPanel(panel === next ? "none" : next);
  };

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      setPanel("none");
      setSlot(null);
      setReason("");
    } catch (reasonError) {
      setError(
        reasonError instanceof Error
          ? reasonError.message
          : "Coś poszło nie tak. Spróbuj ponownie.",
      );
      setRefreshKey((key) => key + 1);
      setSlot(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="flex flex-col bg-gradient-to-br from-[#000000] to-[#434343] font-robotoCondensed">
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:gap-8">
        <div className="flex shrink-0 items-baseline gap-3 md:w-48 md:flex-col md:items-start md:gap-0">
          <span className="font-exo text-5xl font-black leading-none text-[#C59D5F]">
            {start.day}
          </span>
          <span className="text-lg capitalize text-white">
            {start.month} {start.year}
          </span>
          <span className="text-base capitalize text-[#ADADAD]">
            {start.weekday}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-bold text-white">
              {appointment.serviceName}
            </h3>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="text-lg text-[#BEBEBE]">
            {start.time}–{end.time}
            {appointment.employeeName && ` · ${appointment.employeeName}`}
            {appointment.price !== null && ` · ${appointment.price} zł`}
          </p>
          <p className="text-sm text-[#ADADAD]">
            {canChange
              ? `Zmiany możliwe do ${formatDateTime(appointment.changeableUntil!, salon.timeZone)}`
              : "Termin na zmiany online minął — w razie potrzeby zadzwoń do salonu."}
          </p>
        </div>
        {canChange && (
          <div className="flex shrink-0 gap-3">
            {canReschedule && (
              <button
                type="button"
                aria-expanded={panel === "reschedule"}
                onClick={() => open("reschedule")}
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "rounded-none font-robotoCondensed text-base text-white",
                )}
              >
                Przełóż
              </button>
            )}
            <button
              type="button"
              aria-expanded={panel === "cancel"}
              onClick={() => open("cancel")}
              className="px-2 text-base text-[#ADADAD] underline-offset-4 transition-colors hover:text-red-300 hover:underline"
            >
              Anuluj
            </button>
          </div>
        )}
      </div>

      {panel !== "none" && (
        <div className="flex flex-col gap-6 border-t-2 border-[#C59D5F]/20 p-6">
          {error && <Notice tone="error">{error}</Notice>}

          {panel === "cancel" && (
            <>
              <label className="flex flex-col gap-2">
                <span className="text-base text-[#ADADAD]">
                  Powód anulowania{" "}
                  <span className="text-[#ADADAD]/60">(opcjonalnie)</span>
                </span>
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  maxLength={200}
                  rows={2}
                  className="w-full resize-y border-b-2 border-[#C59D5F]/30 bg-transparent py-2 text-lg text-white outline-none transition-colors duration-300 focus:border-[#C59D5F]"
                />
              </label>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(() => onCancel(reason.trim()))}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "lg" }),
                    "rounded-none font-robotoCondensed text-lg",
                  )}
                >
                  {busy ? "Anuluję..." : "Tak, anuluj wizytę"}
                </button>
                <button
                  type="button"
                  onClick={() => setPanel("none")}
                  className="px-2 text-lg text-[#BEBEBE] hover:text-white"
                >
                  Wróć
                </button>
              </div>
            </>
          )}

          {panel === "reschedule" &&
            appointment.serviceId &&
            appointment.employeeId && (
              <>
                <p className="text-lg text-[#BEBEBE]">
                  Wybierz nowy termin u{" "}
                  <span className="text-white">
                    {appointment.employeeName ?? "tego samego specjalisty"}
                  </span>
                  .
                </p>
                <SlotPicker
                  salon={salon}
                  serviceId={appointment.serviceId}
                  employeeId={appointment.employeeId}
                  date={date}
                  onDateChange={(day) => {
                    setDate(day);
                    setSlot(null);
                  }}
                  selected={slot?.startsAt ?? null}
                  onSelect={setSlot}
                  refreshKey={refreshKey}
                />
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    disabled={!slot || busy}
                    onClick={() =>
                      slot && run(() => onReschedule(slot.startsAt))
                    }
                    className={cn(
                      buttonVariants({ variant: "primary", size: "lg" }),
                      "rounded-none font-robotoCondensed text-lg",
                    )}
                  >
                    {busy
                      ? "Przekładam..."
                      : slot
                        ? `Przełóż na ${formatDateTime(slot.startsAt, salon.timeZone)}`
                        : "Wybierz nowy termin"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("none")}
                    className="px-2 text-lg text-[#BEBEBE] hover:text-white"
                  >
                    Wróć
                  </button>
                </div>
              </>
            )}
        </div>
      )}
    </article>
  );
};

export const PastAppointmentRow: React.FC<{
  appointment: ManagedAppointment;
  timeZone: string;
}> = ({ appointment, timeZone }) => (
  <li className="flex flex-col gap-1 border-b border-[#C59D5F]/10 py-4 font-robotoCondensed md:flex-row md:items-center md:justify-between">
    <div className="flex flex-col">
      <span className="text-lg text-white">{appointment.serviceName}</span>
      <span className="text-base text-[#ADADAD]">
        {capitalize(formatDateTime(appointment.startsAt, timeZone))}
        {appointment.employeeName && ` · ${appointment.employeeName}`}
      </span>
    </div>
    <StatusBadge status={appointment.status} />
  </li>
);
