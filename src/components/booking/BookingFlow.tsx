"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookingApiError, bookingApi } from "@/lib/booking/api";
import {
  bookableDays,
  formatLongDate,
  isSalonClosed,
} from "@/lib/booking/dates";
import type {
  AvailableSlot,
  BookableEmployee,
  BookableService,
  BookingResult,
  SalonSettings,
} from "@/lib/booking/types";
import { DayPicker } from "@/components/booking/DayPicker";
import {
  BookingForm,
  type BookingFormValues,
} from "@/components/booking/BookingForm";
import {
  BookingConfirmation,
  type BookingSummary,
} from "@/components/booking/BookingConfirmation";
import {
  Notice,
  OptionCard,
  StepSection,
  employeeName,
  formatDuration,
  formatPrice,
} from "@/components/booking/StepSection";
import {
  OptionCardSkeleton,
  Shimmer,
  SlotGridSkeleton,
} from "@/components/booking/Skeleton";

const SERVICE_CARD_HEIGHT = "min-h-[126px]";
const EMPLOYEE_CARD_HEIGHT = "min-h-[94px]";

interface SelectedSlot {
  time: string;
  startsAt: string;
  userServiceId: string;
}

const errorMessage = (error: unknown) =>
  error instanceof BookingApiError
    ? error.message
    : "Coś poszło nie tak. Spróbuj ponownie.";

export const BookingFlow: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("service");
  const employeeId = searchParams.get("employee");
  const requestedDate = searchParams.get("date");

  const [salon, setSalon] = useState<SalonSettings | null>(null);
  const [services, setServices] = useState<BookableService[] | null>(null);
  const [employees, setEmployees] = useState<BookableEmployee[] | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[] | null>(null);
  const [slot, setSlot] = useState<SelectedSlot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slotsVersion, setSlotsVersion] = useState(0);
  const [result, setResult] = useState<{
    booking: BookingResult;
    summary: BookingSummary;
  } | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const updateQuery = useCallback(
    (changes: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      router.replace(`${pathname}?${params}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    Promise.all([bookingApi.getSalon(), bookingApi.getServices()])
      .then(([salonSettings, bookableServices]) => {
        setSalon(salonSettings);
        setServices(bookableServices);
      })
      .catch((error) => setLoadError(errorMessage(error)));
  }, []);

  const service = services?.find((item) => item.uuid === serviceId) ?? null;
  const employee =
    employees?.find((item) => item.employeeId === employeeId) ?? null;

  const days = useMemo(() => (salon ? bookableDays(salon) : []), [salon]);
  const date = useMemo(() => {
    if (!salon) return null;
    if (requestedDate && days.includes(requestedDate)) return requestedDate;
    return days.find((day) => !isSalonClosed(salon, day)) ?? null;
  }, [days, requestedDate, salon]);

  useEffect(() => {
    setEmployees(null);
    if (!service) return;

    let cancelled = false;
    bookingApi
      .getEmployees(service.uuid)
      .then((list) => !cancelled && setEmployees(list))
      .catch((error) => !cancelled && setSlotsError(errorMessage(error)));

    return () => {
      cancelled = true;
    };
  }, [service]);

  // Previous slots stay on screen while the next day loads, so the layout does not jump
  useEffect(() => {
    setSlot(null);
    setSlotsError(null);
    if (!service || !date) {
      setSlots(null);
      return;
    }

    setSlotsLoading(true);
    if (!employees) return;

    let cancelled = false;
    bookingApi
      .getSlots(service.uuid, date, employee?.employeeId)
      .then((list) => !cancelled && setSlots(list))
      .catch((error) => !cancelled && setSlotsError(errorMessage(error)))
      .finally(() => !cancelled && setSlotsLoading(false));

    return () => {
      cancelled = true;
    };
  }, [service, date, employee, employees, slotsVersion]);

  const selectSlot = (available: AvailableSlot) => {
    setSubmitError(null);
    setSlot({
      time: available.time,
      startsAt: available.startsAt,
      userServiceId: available.userServiceIds[0],
    });
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const slotEmployee =
    employees?.find((item) => item.userServiceId === slot?.userServiceId) ??
    null;

  const submit = async (values: BookingFormValues) => {
    if (!service || !slot || !date || !salon) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const booking = await bookingApi.createBooking({
        userServiceId: slot.userServiceId,
        startsAt: slot.startsAt,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim() || undefined,
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        note: values.note.trim() || undefined,
      });

      setResult({
        booking,
        summary: {
          serviceName: service.name,
          employee: slotEmployee ? employeeName(slotEmployee) : "—",
          date: formatLongDate(date, salon.timeZone),
          time: slot.time,
          price: slotEmployee
            ? `${slotEmployee.price} zł`
            : formatPrice(service.minPrice, service.maxPrice),
          email: values.email.trim(),
        },
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(
        error instanceof BookingApiError && error.status === 409
          ? "Ten termin został właśnie zajęty. Wybierz inny."
          : errorMessage(error),
      );
      if (error instanceof BookingApiError && error.status === 409) {
        setSlotsVersion((version) => version + 1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <BookingConfirmation
        result={result.booking}
        summary={result.summary}
        onBookAnother={() => {
          setResult(null);
          updateQuery({ service: null, employee: null, date: null });
        }}
      />
    );
  }

  if (loadError) return <Notice tone="error">{loadError}</Notice>;

  if (!salon || !services) {
    return (
      <div aria-busy className="flex flex-col">
        <StepSection number="01" title="Usługa">
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i}>
                <OptionCardSkeleton lines={3} className={SERVICE_CARD_HEIGHT} />
              </li>
            ))}
          </ul>
        </StepSection>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <Notice>
        Rezerwacja online jest chwilowo niedostępna. Zadzwoń do salonu, a
        chętnie umówimy wizytę.
      </Notice>
    );
  }

  return (
    <div className="flex flex-col">
      <StepSection
        number="01"
        title="Usługa"
        summary={service?.name}
        onEdit={
          service
            ? () => updateQuery({ service: null, employee: null })
            : undefined
        }
      >
        {!service && (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((item) => (
              <li key={item.uuid}>
                <OptionCard
                  className={SERVICE_CARD_HEIGHT}
                  onClick={() =>
                    updateQuery({ service: item.uuid, employee: null })
                  }
                >
                  <span className="text-xl font-bold text-white">
                    {item.name}
                  </span>
                  {item.description && (
                    <span className="text-base text-[#BEBEBE]">
                      {item.description}
                    </span>
                  )}
                  <span className="mt-auto text-base text-[#C59D5F]">
                    {formatPrice(item.minPrice, item.maxPrice)} ·{" "}
                    {formatDuration(item.minDuration, item.maxDuration)}
                  </span>
                </OptionCard>
              </li>
            ))}
          </ul>
        )}
      </StepSection>

      {service && (
        <StepSection
          number="02"
          title="Specjalista"
          summary={employee ? employeeName(employee) : "Dowolna osoba"}
        >
          {employees ? (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <li>
                <OptionCard
                  className={EMPLOYEE_CARD_HEIGHT}
                  selected={!employee}
                  onClick={() => updateQuery({ employee: null })}
                >
                  <span className="text-xl font-bold text-white">
                    Dowolna osoba
                  </span>
                  <span className="text-base text-[#BEBEBE]">
                    Pokażemy wszystkie wolne terminy
                  </span>
                </OptionCard>
              </li>
              {employees.map((item) => (
                <li key={item.userServiceId}>
                  <OptionCard
                    className={EMPLOYEE_CARD_HEIGHT}
                    selected={employee?.employeeId === item.employeeId}
                    onClick={() => updateQuery({ employee: item.employeeId })}
                  >
                    <span className="text-xl font-bold text-white">
                      {employeeName(item)}
                    </span>
                    <span className="text-base text-[#C59D5F]">
                      {item.price} zł · {item.duration} min
                    </span>
                  </OptionCard>
                </li>
              ))}
            </ul>
          ) : (
            <ul
              aria-busy
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {Array.from({ length: 4 }, (_, i) => (
                <li key={i}>
                  <OptionCardSkeleton className={EMPLOYEE_CARD_HEIGHT} />
                </li>
              ))}
            </ul>
          )}
        </StepSection>
      )}

      {service && (
        <StepSection
          number="03"
          title="Termin"
          summary={
            slot && date
              ? `${formatLongDate(date, salon.timeZone)}, ${slot.time}`
              : null
          }
        >
          <div className="flex flex-col gap-6">
            <DayPicker
              salon={salon}
              days={days}
              selected={date}
              onSelect={(day) => updateQuery({ date: day })}
            />
            {slotsError && <Notice tone="error">{slotsError}</Notice>}
            {!slotsError && !slots && <SlotGridSkeleton />}
            {!slotsError && slots && (
              <div
                aria-busy={slotsLoading}
                className={cn(
                  "relative overflow-hidden transition-opacity duration-300",
                  slotsLoading && "pointer-events-none opacity-40",
                )}
              >
                {slotsLoading && <Shimmer />}
                {slots.length === 0 && (
                  <Notice>
                    Brak wolnych terminów w tym dniu. Wybierz inny dzień
                    {employee ? " lub dowolną osobę" : ""}.
                  </Notice>
                )}
                {slots.length > 0 && (
                  <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
                    {slots.map((available) => {
                      const selected = slot?.startsAt === available.startsAt;
                      return (
                        <li key={available.startsAt}>
                          <button
                            type="button"
                            aria-pressed={selected}
                            onClick={() => selectSlot(available)}
                            className={cn(
                              "w-full border py-2 font-robotoCondensed text-lg transition-all duration-300",
                              selected
                                ? "border-[#C59D5F] bg-[#C59D5F] text-black"
                                : "border-[#C59D5F]/40 text-white hover:border-[#C59D5F] hover:bg-[#C59D5F] hover:text-black",
                            )}
                          >
                            {available.time}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </StepSection>
      )}

      {service && slot && (
        <div ref={formRef} className="scroll-mt-28">
          <StepSection
            number="04"
            title="Twoje dane"
            summary={
              slotEmployee
                ? `${employeeName(slotEmployee)} · ${slotEmployee.price} zł`
                : null
            }
          >
            <div className="flex flex-col gap-6">
              {submitError && <Notice tone="error">{submitError}</Notice>}
              <BookingForm submitting={submitting} onSubmit={submit} />
            </div>
          </StepSection>
        </div>
      )}
    </div>
  );
};
