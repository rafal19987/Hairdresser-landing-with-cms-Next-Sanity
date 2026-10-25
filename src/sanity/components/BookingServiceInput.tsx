"use client";

import { useEffect, useState } from "react";
import { set, unset, type StringInputProps } from "sanity";
import { Card, Select, Stack, Text } from "@sanity/ui";
import { bookingApi } from "@/lib/booking/api";
import type { BookableService } from "@/lib/booking/types";

// Options come from the booking API, so editors pick a service instead of pasting its id
export const BookingServiceInput = ({
  value,
  onChange,
  readOnly,
}: StringInputProps) => {
  const [services, setServices] = useState<BookableService[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bookingApi
      .getServices()
      .then(setServices)
      .catch(() =>
        setError("Nie udało się pobrać usług z systemu rezerwacji."),
      );
  }, []);

  const isMissing = Boolean(
    value && services && !services.some((service) => service.uuid === value),
  );

  return (
    <Stack space={2}>
      <Select
        value={value ?? ""}
        disabled={readOnly || (!services && !error)}
        onChange={(event) =>
          onChange(
            event.currentTarget.value
              ? set(event.currentTarget.value)
              : unset(),
          )
        }
      >
        <option value="">— Bez powiązania (przycisk używa adresu URL) —</option>
        {isMissing && value && (
          <option value={value}>Niedostępna usługa ({value})</option>
        )}
        {services?.map((service) => (
          <option key={service.uuid} value={service.uuid}>
            {service.name}
          </option>
        ))}
      </Select>
      {error && (
        <Card padding={2} tone="critical" radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      )}
      {isMissing && (
        <Card padding={2} tone="caution" radius={2}>
          <Text size={1}>
            Ta usługa nie jest teraz dostępna do rezerwacji online, więc
            przycisk otworzy ogólną stronę rezerwacji.
          </Text>
        </Card>
      )}
    </Stack>
  );
};
