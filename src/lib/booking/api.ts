import type {
  AvailableSlot,
  BookableEmployee,
  BookableService,
  BookingPayload,
  BookingResult,
  ManagedAppointments,
  SalonSettings,
} from "@/lib/booking/types";

// Called from the browser: inside Docker the API is not reachable under this address from the server
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export class BookingApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new BookingApiError(
      "Nie udało się połączyć z systemem rezerwacji. Spróbuj ponownie za chwilę.",
      0,
    );
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message;
    throw new BookingApiError(
      response.status === 429
        ? "Zbyt wiele prób w krótkim czasie. Spróbuj ponownie za minutę."
        : message || "Coś poszło nie tak. Spróbuj ponownie.",
      response.status,
    );
  }

  return body.data as T;
};

export const bookingApi = {
  getSalon: () => request<SalonSettings>("/salon"),

  getServices: () => request<BookableService[]>("/booking/services"),

  getEmployees: (serviceId: string) =>
    request<{ employees: BookableEmployee[] }>(
      `/booking/services/${serviceId}/employees`,
    ).then((data) => data.employees),

  getSlots: (serviceId: string, date: string, employeeId?: string) => {
    const params = new URLSearchParams({ serviceId, date });
    if (employeeId) params.set("employeeId", employeeId);

    return request<{ slots: AvailableSlot[] }>(`/booking/slots?${params}`).then(
      (data) => data.slots,
    );
  },

  createBooking: (payload: BookingPayload) =>
    request<BookingResult>("/booking/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// The emailed link and the client account expose the same operations on different paths
export const createAppointmentsApi = (
  basePath: string,
  headers: Record<string, string>,
) => ({
  list: () =>
    request<ManagedAppointments>(`${basePath}/appointments`, { headers }),

  cancel: (uuid: string, reason?: string) =>
    request<unknown>(`${basePath}/appointments/${uuid}/cancel`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ reason: reason || undefined }),
    }),

  reschedule: (uuid: string, startsAt: string) =>
    request<unknown>(`${basePath}/appointments/${uuid}/reschedule`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ startsAt }),
    }),
});

export type AppointmentsApi = ReturnType<typeof createAppointmentsApi>;

export const manageLinkApi = {
  forToken: (token: string) =>
    createAppointmentsApi("/booking/manage", { "X-Booking-Token": token }),

  sendLink: (email: string) =>
    request<unknown>("/booking/manage/link", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};

export const toErrorMessage = (error: unknown): string =>
  error instanceof BookingApiError
    ? error.message
    : "Coś poszło nie tak. Spróbuj ponownie.";
