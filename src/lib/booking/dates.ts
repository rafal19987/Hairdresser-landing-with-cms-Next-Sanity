import type { SalonSettings } from "@/lib/booking/types";

const DAY_MS = 24 * 60 * 60 * 1000;

// YYYY-MM-DD in the salon time zone
export const localDate = (date: Date, timeZone: string): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone }).format(date);

export const addDays = (date: string, days: number): string =>
  new Date(Date.parse(`${date}T00:00:00.000Z`) + days * DAY_MS)
    .toISOString()
    .slice(0, 10);

// Noon UTC keeps the calendar day stable when formatting in any European zone
const noon = (date: string) => new Date(`${date}T12:00:00.000Z`);

export const formatDay = (date: string, timeZone: string) => {
  const day = noon(date);

  return {
    weekday: new Intl.DateTimeFormat("pl-PL", { weekday: "short", timeZone })
      .format(day)
      .replace(".", ""),
    day: new Intl.DateTimeFormat("pl-PL", { day: "numeric", timeZone }).format(
      day,
    ),
    month: new Intl.DateTimeFormat("pl-PL", { month: "short", timeZone })
      .format(day)
      .replace(".", ""),
  };
};

export const formatLongDate = (date: string, timeZone: string): string =>
  new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone,
  }).format(noon(date));

export const isoDayOfWeek = (date: string): number =>
  noon(date).getUTCDay() || 7;

export const isSalonClosed = (salon: SalonSettings, date: string): boolean => {
  const specialDay = salon.specialDays.find((day) => day.date === date);
  if (specialDay) return specialDay.isClosed || specialDay.hours.length === 0;

  return !salon.openingHours.some(
    (hours) => hours.dayOfWeek === isoDayOfWeek(date),
  );
};

export const bookableDays = (salon: SalonSettings, now = new Date()) => {
  const today = localDate(now, salon.timeZone);

  return Array.from({ length: salon.maxBookingDaysAhead + 1 }, (_, i) =>
    addDays(today, i),
  );
};
