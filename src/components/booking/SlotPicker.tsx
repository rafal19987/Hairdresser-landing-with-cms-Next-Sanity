"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { bookingApi, toErrorMessage } from "@/lib/booking/api";
import { bookableDays } from "@/lib/booking/dates";
import type { AvailableSlot, SalonSettings } from "@/lib/booking/types";
import { DayPicker } from "@/components/booking/DayPicker";
import { Notice } from "@/components/booking/StepSection";
import { Shimmer, SlotGridSkeleton } from "@/components/booking/Skeleton";

export const SlotPicker: React.FC<{
  salon: SalonSettings;
  serviceId: string;
  employeeId?: string;
  date: string | null;
  onDateChange: (date: string) => void;
  selected: string | null;
  onSelect: (slot: AvailableSlot) => void;
  // False while data the slots depend on is still loading
  ready?: boolean;
  // Bump to reload slots, e.g. after a booking conflict
  refreshKey?: number;
  emptyHint?: string;
  // Replaces the public slots endpoint, e.g. when rescheduling
  loadSlots?: (date: string) => Promise<AvailableSlot[]>;
}> = ({
  salon,
  serviceId,
  employeeId,
  date,
  onDateChange,
  selected,
  onSelect,
  ready = true,
  refreshKey = 0,
  emptyHint,
  loadSlots,
}) => {
  const days = useMemo(() => bookableDays(salon), [salon]);
  const [slots, setSlots] = useState<AvailableSlot[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Kept in a ref, so a new function identity on re-render does not refetch
  const loadSlotsRef = useRef(loadSlots);

  // Declared before the fetching effect, so it runs first after each render
  useEffect(() => {
    loadSlotsRef.current = loadSlots;
  });

  // Previous slots stay on screen while the next day loads, so the layout does not jump
  useEffect(() => {
    setError(null);
    if (!date) {
      setSlots(null);
      return;
    }

    setLoading(true);
    if (!ready) return;

    let cancelled = false;
    (loadSlotsRef.current
      ? loadSlotsRef.current(date)
      : bookingApi.getSlots(serviceId, date, employeeId)
    )
      .then((list) => !cancelled && setSlots(list))
      .catch((reason) => !cancelled && setError(toErrorMessage(reason)))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [serviceId, employeeId, date, ready, refreshKey]);

  return (
    <div className="flex flex-col gap-6">
      <DayPicker
        salon={salon}
        days={days}
        selected={date}
        onSelect={onDateChange}
      />
      {error && <Notice tone="error">{error}</Notice>}
      {!error && !slots && <SlotGridSkeleton />}
      {!error && slots && (
        <div
          aria-busy={loading}
          className={cn(
            "relative overflow-hidden transition-opacity duration-300",
            loading && "pointer-events-none opacity-40",
          )}
        >
          {loading && <Shimmer />}
          {slots.length === 0 && (
            <Notice>
              Brak wolnych terminów w tym dniu. Wybierz inny dzień
              {emptyHint ? ` ${emptyHint}` : ""}.
            </Notice>
          )}
          {slots.length > 0 && (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
              {slots.map((available) => {
                const isSelected = selected === available.startsAt;
                return (
                  <li key={available.startsAt}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onSelect(available)}
                      className={cn(
                        "w-full border py-2 font-robotoCondensed text-lg transition-all duration-300",
                        isSelected
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
  );
};
