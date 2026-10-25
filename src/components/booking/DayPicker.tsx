"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDay, isSalonClosed } from "@/lib/booking/dates";
import type { SalonSettings } from "@/lib/booking/types";

export const DayPicker: React.FC<{
  salon: SalonSettings;
  days: string[];
  selected: string | null;
  onSelect: (date: string) => void;
}> = ({ salon, days, selected, onSelect }) => {
  const listRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) =>
    listRef.current?.scrollBy({
      left: direction * listRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Wcześniejsze dni"
        onClick={() => scroll(-1)}
        className="hidden size-10 shrink-0 items-center justify-center border border-transparent bg-gradient-to-br from-[#000000] to-[#434343] text-white transition-all duration-300 hover:border-[#C59D5F] md:flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <ul
        ref={listRef}
        className="flex snap-x gap-2 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none]"
      >
        {days.map((date) => {
          const closed = isSalonClosed(salon, date);
          const { weekday, day, month } = formatDay(date, salon.timeZone);
          const isSelected = date === selected;

          return (
            <li key={date} className="snap-start">
              <button
                type="button"
                disabled={closed}
                aria-pressed={isSelected}
                aria-label={
                  closed ? `${day} ${month} — salon zamknięty` : undefined
                }
                onClick={() => onSelect(date)}
                className={cn(
                  "relative flex w-16 flex-col items-center gap-1 py-3 font-robotoCondensed transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#C59D5F] after:transition-all after:duration-300",
                  isSelected
                    ? "text-white after:w-full"
                    : "text-[#BEBEBE] after:w-0 hover:text-white hover:after:w-full",
                  closed && "cursor-not-allowed opacity-30 hover:after:w-0",
                )}
              >
                <span className="text-sm uppercase">{weekday}</span>
                <span className="font-exo text-3xl font-bold leading-none">
                  {day}
                </span>
                <span className="text-sm">{month}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        aria-label="Późniejsze dni"
        onClick={() => scroll(1)}
        className="hidden size-10 shrink-0 items-center justify-center border border-transparent bg-gradient-to-br from-[#000000] to-[#434343] text-white transition-all duration-300 hover:border-[#C59D5F] md:flex"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
};
