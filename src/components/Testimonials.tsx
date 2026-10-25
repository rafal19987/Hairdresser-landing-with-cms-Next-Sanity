import type { SanityComponent } from "./Hero";
import type { PortableTextBlock } from "sanity";
import { PortableText } from "next-sanity";
import { TestimonialsCarousel } from "@components/TestimonialsCarousel";
import { SectionWrapper } from "@components/SectionWrapper";

export interface TestimonialsProps extends SanityComponent {
  heading: string;
  content: PortableTextBlock[];
  testimonials: {
    name: string;
    opinion: PortableTextBlock[];
    date: string;
    rating: string;
    avatar: { asset: { url: string; alt: string } };
  }[];
}

export const Testimonials: React.FC<{ data: TestimonialsProps }> = ({
  data,
}) => {
  return (
    <SectionWrapper>
      <div className="container flex flex-col items-center justify-center gap-12 lg:gap-24">
        <div className="prose flex flex-col items-center justify-center prose-headings:text-white prose-h2:text-4xl prose-p:text-[#BEBEBE] prose-strong:text-base prose-strong:font-normal prose-strong:text-[#C59D5F]">
          <h2>{data.heading}</h2>
          <PortableText value={data.content} />
        </div>
        <div className="w-full">
          <TestimonialsCarousel testimonials={data.testimonials} />
        </div>
      </div>
    </SectionWrapper>
  );
};
