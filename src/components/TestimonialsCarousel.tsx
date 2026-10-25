"use client";

import Image from "next/image";
import { PortableText } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ui/carousel";
import { TestimonialsProps } from "./Testimonials";

export const TestimonialsCarousel: React.FC<{
  testimonials: TestimonialsProps["testimonials"];
}> = ({ testimonials }) => {
  return (
    <Carousel
      className="w-full"
      opts={{ align: "start", loop: true }}
      orientation="horizontal"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      data-aos="fade-down"
      data-aos-delay={`200`}
    >
      <CarouselContent className="py-4">
        {testimonials.map((testimonial) => (
          <CarouselItem
            key={testimonial.name}
            className="relative basis-full md:basis-1/2 lg:basis-1/4"
          >
            <article className="flex h-full min-h-20 w-full cursor-grab flex-col items-start justify-between gap-4 bg-gradient-to-br from-[#000000] to-[#434343] px-4 py-4">
              <div className="flex w-full items-start justify-between">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: parseInt(testimonial.rating) },
                      (_, i) => (
                        <svg
                          key={i}
                          width="18"
                          height="17"
                          viewBox="0 0 18 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.55696 14.1975L12.707 16.7075C13.467 17.1675 14.397 16.4875 14.197 15.6275L13.097 10.9075L16.767 7.7275C17.437 7.1475 17.077 6.0475 16.197 5.9775L11.367 5.5675L9.47696 1.1075C9.13696 0.2975 7.97696 0.2975 7.63696 1.1075L5.74696 5.5575L0.916957 5.9675C0.0369575 6.0375 -0.323043 7.1375 0.346957 7.7175L4.01696 10.8975L2.91696 15.6175C2.71696 16.4775 3.64696 17.1575 4.40696 16.6975L8.55696 14.1975Z"
                            fill="#C59D5F"
                          />
                        </svg>
                      ),
                    )}
                  </div>
                  <h3 className="font-robotoCondensed text-xl font-bold">
                    {testimonial.name}
                  </h3>
                </div>
                <div className="relative size-14">
                  <Image
                    src={urlFor(testimonial.avatar.asset).url()}
                    alt={testimonial.avatar.asset.alt || "Avatar"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="prose font-robotoCondensed prose-p:border-l prose-p:border-[#C59D5F]/50 prose-p:pl-4 prose-p:text-base prose-p:text-[#BEBEBE]">
                <PortableText value={testimonial.opinion} />
              </div>
              <span className="text-base text-[#BEBEBE]">
                {Intl.DateTimeFormat("pl-PL", {
                  month: "long",
                  day: "2-digit",
                  year: "numeric",
                }).format(new Date(testimonial.date))}
              </span>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute -bottom-12 right-11 flex h-12 w-4 items-center justify-center gap-4">
        <CarouselPrevious className="size-10 rounded-none border border-transparent bg-gradient-to-br from-[#000000] to-[#434343] bg-[300%] p-4 shadow-lg transition-all duration-300 hover:border-[#C59D5F]" />
        <CarouselNext className="size-10 rounded-none border border-transparent bg-gradient-to-br from-[#000000] to-[#434343] p-4 shadow-none transition-all duration-300 hover:border-[#C59D5F]" />
      </div>
    </Carousel>
  );
};
