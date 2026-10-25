import { cn } from "@/lib/utils";

// Shimmer overlay shared by skeletons and content that is being refreshed
export const Shimmer: React.FC = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-[#C59D5F]/10 to-transparent motion-reduce:hidden"
  />
);

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <span
    aria-hidden
    className={cn(
      "relative block overflow-hidden bg-gradient-to-br from-[#0d0d0d] to-[#2b2b2b]",
      className,
    )}
  >
    <Shimmer />
  </span>
);

// Same box as OptionCard; className sets the height of the card it stands in for
export const OptionCardSkeleton: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 2, className }) => (
  <div
    aria-hidden
    className={cn(
      "relative flex h-full flex-col gap-3 overflow-hidden border border-transparent bg-gradient-to-br from-[#0d0d0d] to-[#2b2b2b] p-4",
      className,
    )}
  >
    <Shimmer />
    <span className="block h-6 w-3/5 bg-white/10" />
    {Array.from({ length: lines - 1 }, (_, i) => (
      <span
        key={i}
        className={cn("block h-4 bg-white/5", i % 2 ? "w-1/3" : "w-4/5")}
      />
    ))}
  </div>
);

export const SlotGridSkeleton: React.FC = () => (
  <ul
    aria-hidden
    className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8"
  >
    {Array.from({ length: 16 }, (_, i) => (
      <li key={i}>
        <Skeleton className="h-[46px] border border-[#C59D5F]/10" />
      </li>
    ))}
  </ul>
);
