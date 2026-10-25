"use client";

import { useCallback, useMemo, useState } from "react";
import { manageLinkApi } from "@/lib/booking/api";
import { AppointmentsManager } from "@/components/appointments/AppointmentsManager";
import { ManageLinkRequest } from "@/components/appointments/ManageLinkRequest";

export const ManageByLink: React.FC<{ token: string }> = ({ token }) => {
  const api = useMemo(() => manageLinkApi.forToken(token), [token]);
  const [expired, setExpired] = useState(false);
  const handleUnauthorized = useCallback(() => setExpired(true), []);

  if (expired) return <ManageLinkRequest expired />;

  return <AppointmentsManager api={api} onUnauthorized={handleUnauthorized} />;
};
