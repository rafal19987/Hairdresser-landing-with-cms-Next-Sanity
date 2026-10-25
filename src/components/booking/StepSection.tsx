import { cn } from "@/lib/utils";

export const StepSection: React.FC<{
  number: string;
  title: string;
  summary?: string | null;
  onEdit?: () => void;
  children?: React.ReactNode;
}> = ({ number, title, summary, onEdit, children }) => (
  <section className="relative border-b-2 border-[#C59D5F]/20 py-8">
    <header className="flex flex-wrap items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-4">
        <span className="font-exo text-3xl font-black leading-none text-[#C59D5F]">
          {number}
        </span>
        <h2 className="font-robotoCondensed text-2xl font-bold text-white">
          {title}
        </h2>
      </div>
      {summary && (
        <div className="flex items-baseline gap-4 font-robotoCondensed text-lg">
          <span className="text-[#BEBEBE]">{summary}</span>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-base text-[#C59D5F] underline-offset-4 hover:underline"
            >
              Zmień
            </button>
          )}
        </div>
      )}
    </header>
    {children && <div className="mt-6">{children}</div>}
  </section>
);

export const OptionCard: React.FC<{
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ selected, disabled, className, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={selected}
    className={cn(
      "flex h-full w-full flex-col items-start gap-2 border bg-gradient-to-br from-[#000000] to-[#434343] p-4 text-left font-robotoCondensed transition-all duration-300",
      selected
        ? "border-[#C59D5F]"
        : "border-transparent hover:border-[#C59D5F]/60",
      disabled && "cursor-not-allowed opacity-40 hover:border-transparent",
      className,
    )}
  >
    {children}
  </button>
);

export const Notice: React.FC<{
  tone?: "info" | "error";
  children: React.ReactNode;
}> = ({ tone = "info", children }) => (
  <p
    role={tone === "error" ? "alert" : "status"}
    className={cn(
      "border-l-2 py-2 pl-4 font-robotoCondensed text-lg",
      tone === "error"
        ? "border-red-500 text-red-300"
        : "border-[#C59D5F]/50 text-[#BEBEBE]",
    )}
  >
    {children}
  </p>
);

export const formatPrice = (min: number, max: number) =>
  min === max ? `${min} zł` : `${min}–${max} zł`;

export const formatDuration = (min: number, max: number) =>
  min === max ? `${min} min` : `${min}–${max} min`;

export const employeeName = (employee: {
  firstName: string | null;
  lastName: string | null;
}) =>
  [employee.firstName, employee.lastName].filter(Boolean).join(" ") ||
  "Specjalista";
