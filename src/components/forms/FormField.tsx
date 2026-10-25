import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^[+\d\s()-]{6,30}$/;

export const Field: React.FC<{
  label: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, error, optional, hint, children }) => (
  <label className="flex flex-col gap-2 font-robotoCondensed">
    <span className="text-base text-[#ADADAD]">
      {label}
      {optional && <span className="text-[#ADADAD]/60"> (opcjonalnie)</span>}
    </span>
    {children}
    {hint && !error && (
      <span className="text-sm text-[#ADADAD]/70">{hint}</span>
    )}
    {error && <span className="text-sm text-red-300">{error}</span>}
  </label>
);

export const inputClass = (error?: string) =>
  cn(
    "w-full border-b-2 bg-transparent py-2 font-robotoCondensed text-lg text-white outline-none transition-colors duration-300 placeholder:text-[#ADADAD]/50 read-only:text-[#ADADAD]",
    error ? "border-red-400" : "border-[#C59D5F]/30 focus:border-[#C59D5F]",
  );

export const Checkbox: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}> = ({ checked, onChange, children }) => (
  <label className="flex cursor-pointer items-start gap-3 font-robotoCondensed text-base text-[#BEBEBE]">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="peer sr-only"
    />
    <span
      aria-hidden
      className="mt-0.5 flex size-5 shrink-0 items-center justify-center border border-[#C59D5F]/60 transition-colors duration-300 peer-checked:bg-[#C59D5F] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C59D5F]/60"
    >
      {checked && (
        <svg
          viewBox="0 0 12 10"
          className="size-3 fill-none stroke-black stroke-2"
        >
          <path d="M1 5l3.5 3.5L11 1" />
        </svg>
      )}
    </span>
    <span>{children}</span>
  </label>
);

export const primaryButtonClass = cn(
  buttonVariants({ variant: "primary", size: "lg" }),
  "w-full rounded-none font-robotoCondensed text-lg md:w-fit",
);
