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

export type ApiSender = <T>(path: string, init?: RequestInit) => Promise<T>;

// Most endpoints wrap their payload in `data`; client auth endpoints return it directly
export const request = async <T>(
  path: string,
  init?: RequestInit,
  unwrap = true,
): Promise<T> => {
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

  return (unwrap ? body?.data : body) as T;
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

  // A logged-in client books through an authorized sender, guests through the plain one
  createBooking: (payload: BookingPayload, send: ApiSender = request) =>
    send<BookingResult>("/booking/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// The emailed link and the client account expose the same operations on different paths
export const createAppointmentsApi = (basePath: string, send: ApiSender) => ({
  list: () => send<ManagedAppointments>(`${basePath}/appointments`),

  cancel: (uuid: string, reason?: string) =>
    send<unknown>(`${basePath}/appointments/${uuid}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({ reason: reason || undefined }),
    }),

  // Unlike the public slots, these do not count the appointment itself as busy
  rescheduleSlots: (uuid: string, date: string) =>
    send<{ slots: AvailableSlot[] }>(
      `${basePath}/appointments/${uuid}/slots?date=${date}`,
    ).then((data) => data.slots),

  reschedule: (uuid: string, startsAt: string) =>
    send<unknown>(`${basePath}/appointments/${uuid}/reschedule`, {
      method: "PATCH",
      body: JSON.stringify({ startsAt }),
    }),
});

export type AppointmentsApi = ReturnType<typeof createAppointmentsApi>;

export const manageLinkApi = {
  forToken: (token: string) =>
    createAppointmentsApi("/booking/manage", (path, init) =>
      request(path, {
        ...init,
        headers: { ...init?.headers, "X-Booking-Token": token },
      }),
    ),

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
