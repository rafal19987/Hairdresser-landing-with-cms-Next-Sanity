"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { useSession } from "@/lib/account/session";

export const Header: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const session = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 flex w-dvw items-center justify-center gap-8 py-4 transition-all duration-500 ${
        isScrolled ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="container flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="font-exo text-3xl font-bold leading-none text-white transition-all duration-150 hover:text-[#C59D5F]"
        >
          Rêve
        </Link>
        {children}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/konto"
            className="relative py-1 font-robotoCondensed text-lg text-[#BEBEBE] transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#C59D5F] after:transition-all after:duration-300 after:content-[''] hover:text-white hover:after:w-full"
          >
            {session ? "Moje konto" : "Zaloguj się"}
          </Link>
          <Link
            href={`/book`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "rounded-0 hidden items-center justify-center px-6 font-robotoCondensed text-lg md:flex",
            )}
          >
            Zarezerwuj wizytę
          </Link>
        </div>
        <div className="flex md:hidden">
          <Menu className="text-[#C59D5F]" />
        </div>
      </div>
    </header>
  );
};
