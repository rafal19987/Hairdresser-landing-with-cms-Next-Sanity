"use client";

import {
  BookingApiError,
  createAppointmentsApi,
  request,
  type ApiSender,
} from "@/lib/booking/api";
import {
  clearSession,
  getSession,
  saveSession,
  type ClientSession,
  type SessionClient,
} from "@/lib/account/session";

export interface ClientProfile {
  uuid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  marketingConsent: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  marketingConsent?: boolean;
}

type Tokens = Pick<ClientSession, "accessToken" | "refreshToken">;

const post = (body: unknown): RequestInit => ({
  method: "POST",
  body: JSON.stringify(body),
});

// The API rotates refresh tokens, so parallel requests must share one refresh
let refreshing: Promise<boolean> | null = null;

const refreshTokens = (): Promise<boolean> => {
  refreshing ??= (async () => {
    const session = getSession();
    if (!session) return false;

    try {
      const tokens = await request<Tokens>(
        "/auth/client/refresh",
        post({ refreshToken: session.refreshToken }),
        false,
      );
      saveSession({ ...session, ...tokens });
      return true;
    } catch {
      clearSession();
      return false;
    }
  })().finally(() => {
    refreshing = null;
  });

  return refreshing;
};

const withToken = (init: RequestInit | undefined, token: string) => ({
  ...init,
  headers: { ...init?.headers, Authorization: `Bearer ${token}` },
});

export const authorizedSend: ApiSender = async (path, init) => {
  const session = getSession();
  if (!session) {
    throw new BookingApiError("Zaloguj się, aby kontynuować.", 401);
  }

  try {
    return await request(path, withToken(init, session.accessToken));
  } catch (error) {
    if (!(error instanceof BookingApiError) || error.status !== 401)
      throw error;
    if (!(await refreshTokens())) throw error;

    return request(path, withToken(init, getSession()!.accessToken));
  }
};

export const accountApi = {
  login: async (email: string, password: string) => {
    const session = await request<ClientSession>(
      "/auth/client/login",
      post({ email, password }),
      false,
    );
    saveSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      client: {
        uuid: session.client.uuid,
        email: session.client.email,
        firstName: session.client.firstName,
        lastName: session.client.lastName,
      },
    });
  },

  logout: async () => {
    const session = getSession();
    clearSession();
    if (session) {
      await request(
        "/auth/client/logout",
        post({ refreshToken: session.refreshToken }),
        false,
      ).catch(() => undefined);
    }
  },

  register: (payload: RegisterPayload) =>
    request<unknown>("/clients/register", post(payload)),

  verifyEmail: (token: string) =>
    request<{ linkedAppointments: number }>(`/clients/verify-email/${token}`),

  resendVerification: (email: string) =>
    request<unknown>("/clients/resend-verification", post({ email })),

  forgotPassword: (email: string) =>
    request<unknown>("/clients/forgot-password", post({ email })),

  // The backend signs the client out everywhere, so the local session is dropped too
  resetPassword: async (token: string, password: string) => {
    await request<unknown>(
      "/clients/reset-password",
      post({ token, password }),
    );
    clearSession();
  },

  getProfile: () => authorizedSend<ClientProfile>("/booking/me"),

  updateProfile: async (
    changes: Partial<Omit<ClientProfile, "uuid" | "email">>,
  ) => {
    const profile = await authorizedSend<ClientProfile>("/booking/me", {
      method: "PUT",
      body: JSON.stringify(changes),
    });
    const session = getSession();
    if (session) {
      const client: SessionClient = {
        ...session.client,
        firstName: profile.firstName,
        lastName: profile.lastName,
      };
      saveSession({ ...session, client });
    }
    return profile;
  },

  appointments: createAppointmentsApi("/booking/me", authorizedSend),
};

// Login and unverified email both answer 401 and differ only by message
export const isUnverifiedEmailError = (error: unknown): boolean =>
  error instanceof BookingApiError && /zweryfikowany/i.test(error.message);
