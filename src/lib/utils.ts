import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// CMS buttons store absolute URLs; links to this site become paths for client-side navigation
export function toHref(url?: string | null): string {
  if (!url) return "#";

  try {
    const target = new URL(url);
    const site = new URL(
      process.env.NEXT_PUBLIC_HOST_URL ?? "http://localhost",
    );

    return target.host === site.host
      ? `${target.pathname}${target.search}${target.hash}`
      : url;
  } catch {
    return url;
  }
}
