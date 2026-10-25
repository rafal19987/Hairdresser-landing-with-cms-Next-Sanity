"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavigationItem: React.FC<{ slug: string }> = ({ slug }) => {
  const pathname = usePathname();
  const isActive = pathname === `${slug === "/" ? "/" : `/${slug}`}`;

  return (
    <Link
      href={slug}
      key={slug}
      className={`relative py-1 font-robotoCondensed text-lg before:absolute before:right-0 before:top-0 before:h-[2px] before:w-0 before:bg-[#C59D5F] before:transition-all before:duration-300 before:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#C59D5F] after:transition-all after:duration-300 after:content-[''] hover:before:w-full hover:after:w-full ${
        isActive ? "text-white before:w-full after:w-full" : "text-[#BEBEBE]"
      }`}
    >
      {slug === "/"
        ? "Strona główna"
        : `${slug.charAt(0).toUpperCase()}${slug.slice(1).replace(/-/g, " ")}`}
    </Link>
  );
};
