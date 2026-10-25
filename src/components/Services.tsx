import Link from "next/link";
import type { SanityComponent } from "./Hero";
import { buttonVariants } from "./ui/button";
import { cn, toHref } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

export interface ServicesProps extends SanityComponent {
  services: {
    bookingServiceId?: string;
    letter: string;
    heading: string;
    description: string;
    button: {
      label: string;
      url: string;
      variant:
        | "default"
        | "link"
        | "outline"
        | "primary"
        | "secondary"
        | "ghost"
        | null
        | undefined;
    };
    image: { asset: { url: string; alt: string } };
  }[];
}
export const Services: React.FC<{ data: ServicesProps }> = ({ data }) => {
  return (
    <section>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.services.map((service, idx) => (
          <li
            key={idx}
            className="flex flex-col items-center justify-center py-12"
            style={{
              backgroundImage: `url(${service.image?.asset ? urlFor(service.image.asset).url() : ""})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className="font-exo text-[16rem] font-normal leading-none text-[#C59D5F]">
              {service.letter}
            </span>
            <div className="flex flex-col items-center justify-center gap-4 px-4 py-8">
              <h3 className="text-center font-robotoCondensed text-2xl font-bold text-white">
                {service.heading}
              </h3>
              <p className="text-center font-robotoCondensed text-base text-[#BEBEBE]">
                {service.description}
              </p>
              <Link
                href={
                  service.bookingServiceId
                    ? `/book?service=${service.bookingServiceId}`
                    : toHref(service.button?.url)
                }
                className={cn(
                  buttonVariants({
                    variant: service.button?.variant,
                    size: "lg",
                  }),
                  "rounded-0 font-robotoCondensed text-lg",
                )}
              >
                {service.button?.label}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
