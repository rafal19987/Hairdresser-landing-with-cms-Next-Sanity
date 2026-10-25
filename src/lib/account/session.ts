"use client";

import { useMemo, useSyncExternalStore } from "react";

export interface SessionClient {
  uuid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface ClientSession {
  accessToken: string;
  refreshToken: string;
  client: SessionClient;
}

const STORAGE_KEY = "reve.clientSession";
const CHANGE_EVENT = "reve:session";

const readRaw = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));

export const getSession = (): ClientSession | null => {
  const raw = readRaw();
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ClientSession;
  } catch {
    return null;
  }
};

export const saveSession = (session: ClientSession): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Private mode without storage: the session lasts only until reload
  }
  notify();
};

export const clearSession = (): void => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored
  }
  notify();
};

const subscribe = (callback: () => void) => {
  window.addEventListener(CHANGE_EVENT, callback);
  // Login or logout in another tab
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

// undefined until mounted on the client, so the server render never guesses the session
export const useSession = (): ClientSession | null | undefined => {
  const raw = useSyncExternalStore(subscribe, readRaw, () => undefined);

  return useMemo(() => {
    if (raw === undefined) return undefined;
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ClientSession;
    } catch {
      return null;
    }
  }, [raw]);
};

export const displayName = (client: SessionClient): string =>
  [client.firstName, client.lastName].filter(Boolean).join(" ") || client.email;
