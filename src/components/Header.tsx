"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useSession } from "@/lib/account/session";

const DESKTOP_QUERY = "(min-width: 768px)";

export const Header: React.FC<{
  children?: React.ReactNode;
  mobileNavigation?: React.ReactNode;
}> = ({ children, mobileNavigation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = useSession();
  const pathname = usePathname();
  const accountLabel = session ? "Moje konto" : "Zaloguj się";

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

  useEffect(() => setIsMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const close = () => setIsMenuOpen(false);
    const handleKey = (event: KeyboardEvent) =>
      event.key === "Escape" && close();
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const handleResize = () => desktop.matches && close();
    const { overflow } = document.body.style;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    desktop.addEventListener("change", handleResize);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKey);
      desktop.removeEventListener("change", handleResize);
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 z-50 flex w-dvw items-center justify-center gap-8 py-4 transition-all duration-500 ${
        isScrolled || isMenuOpen ? "bg-black" : "bg-transparent"
      }`}
    >
      <div className="container relative z-10 flex w-full max-w-7xl items-center justify-between">
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
            {accountLabel}
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
        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="-mr-2 flex p-2 text-[#C59D5F] transition-colors hover:text-white md:hidden"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div
        id="mobile-menu"
        // Links to the current page do not change the pathname, so clicks close the menu too
        onClick={(event) =>
          (event.target as HTMLElement).closest("a") && setIsMenuOpen(false)
        }
        className={cn(
          "fixed inset-0 flex flex-col bg-black px-8 pb-10 pt-28 transition-opacity duration-300 md:hidden",
          isMenuOpen
            ? "opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        {mobileNavigation}
        <div className="mt-auto flex flex-col gap-6 border-t-2 border-[#C59D5F]/20 pt-8">
          <Link
            href="/konto"
            className="font-robotoCondensed text-2xl text-[#BEBEBE] transition-colors hover:text-white"
          >
            {accountLabel}
          </Link>
          <Link
            href="/book"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "w-full rounded-none font-robotoCondensed text-lg",
            )}
          >
            Zarezerwuj wizytę
          </Link>
        </div>
      </div>
    </header>
  );
};
