export interface TimeRange {
  opensAt: string;
  closesAt: string;
}

export interface SalonSettings {
  name: string;
  timeZone: string;
  maxBookingDaysAhead: number;
  openingHours: (TimeRange & { dayOfWeek: number })[];
  specialDays: { date: string; isClosed: boolean; hours: TimeRange[] }[];
}

export interface BookableService {
  uuid: string;
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  minDuration: number;
  maxDuration: number;
}

export interface BookableEmployee {
  userServiceId: string;
  employeeId: string;
  firstName: string | null;
  lastName: string | null;
  price: number;
  duration: number;
}

export interface AvailableSlot {
  time: string;
  startsAt: string;
  userServiceIds: string[];
}

export interface BookingPayload {
  userServiceId: string;
  startsAt: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  note?: string;
}

export interface BookingResult {
  uuid: string;
  status: "pending" | "confirmed";
}
