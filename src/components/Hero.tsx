import Image from "next/image";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn, toHref } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";

export interface SanityComponent {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  description: string;
}

export interface HeroProps extends SanityComponent {
  coveImage: { asset: { url: string; alt: string } };
  text: { headline: string; smallHeadline: string; description: string };
  showScrollDown: boolean;
  cta: {
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
}

export const Hero: React.FC<{
  data: HeroProps;
}> = ({ data }) => {
  return (
    <section className="relative grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="absolute -z-10 h-full w-full lg:relative lg:h-auto lg:w-auto">
        <Image
          src={urlFor(data.coveImage.asset).url()}
          alt={data.coveImage.asset.alt}
          fill
          priority
          className="absolute -z-10 h-full w-full object-cover lg:relative"
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-12">
        <div>
          <small className="block text-center font-robotoCondensed text-3xl font-thin text-white">
            {data.text.smallHeadline}
          </small>
          <h1 className="text-center font-exo text-5xl font-black text-white transition-all duration-300 lg:text-7xl xl:text-8xl 2xl:text-9xl">
            {data.text.headline}
          </h1>
          <p className="text-center font-robotoCondensed text-2xl font-normal text-[#ADADAD]">
            {data.text.description}
          </p>
        </div>
        <Link
          href={toHref(data.cta.url)}
          className={cn(
            buttonVariants({ variant: data.cta.variant, size: "lg" }),
            "font-robotoCondensed text-lg",
          )}
        >
          {data.cta.label}
        </Link>
      </div>
      {data.showScrollDown && (
        <div className="absolute bottom-12 left-0 right-0 mx-auto flex flex-col items-center justify-normal gap-2">
          <span className="font-robotoCondensed text-sm text-[#ADADAD]">
            Przewiń
          </span>
          <div className="flex h-14 w-8 flex-col items-center justify-end overflow-hidden rounded-full bg-[#4A4A4A] p-[2px]">
            <div className="h-full w-full animate-bounce rounded-full bg-[#010101]"></div>
          </div>
        </div>
      )}
    </section>
  );
};
