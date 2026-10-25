import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { Hero } from "@/components/Hero";
import { FeaturesNumbers } from "@/components/FeaturesNumbers";
import { FAQ } from "@/components/FAQ";
import { IllustrationWithContent } from "@/components/IllustrationWithContent";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";

type Props = { params: Promise<{ slug?: string[] }> };

type SanitySection = { _type: string; _key?: string };

// CMS sections arrive untyped; each component declares the shape it expects
const renderSection = <P,>(Component: React.FC<{ data: P }>) =>
  function Section(section: SanitySection) {
    return <Component data={section as unknown as P} />;
  };

// Keys are section type names from Sanity
const SECTION_COMPONENTS: Record<
  string,
  (section: SanitySection) => React.ReactNode
> = {
  hero: renderSection(Hero),
  featuresNumbers: renderSection(FeaturesNumbers),
  frequentlyAskedQuestions: renderSection(FAQ),
  illustrationWithContent: renderSection(IllustrationWithContent),
  servicesSection: renderSection(Services),
  testimonials: renderSection(Testimonials),
};

const getAllPagesSlugs = groq`
   *[_type == "page"]{
    "slug": slug.current
  }[].slug
`;

const getPageBySlug = groq`
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    body[]{...,
      _type == "image" => {..., asset->}
    }
  }
`;

const getPageMetadata = groq`
  *[_type == "page" && slug.current == $slug]{
    seo
  }[0].seo
`;

const fetchAllPagesSlugs = async () => {
  return await client.fetch(getAllPagesSlugs, {}, { cache: "no-cache" });
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: segments } = await params;
  const slug = segments ? `${segments.join("/")}` : "/";
  const metadata = await client.fetch(
    getPageMetadata,
    { slug },
    { cache: "no-cache" },
  );

  if (!metadata) return {};

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      images: metadata.ogImage?.asset.url,
    },
    authors: {
      name: metadata.author,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const pageSlug = slug ? slug.join("/") : "/";
  const page = await client.fetch(
    getPageBySlug,
    { slug: pageSlug },
    { cache: "no-cache" },
  );

  if (!page) return notFound();

  return (
    <div>
      {(page.body ?? []).map((section: SanitySection, index: number) => {
        const render = SECTION_COMPONENTS[section._type];
        return render ? (
          <Fragment key={section._key ?? `${section._type}-${index}`}>
            {render(section)}
          </Fragment>
        ) : null;
      })}
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await fetchAllPagesSlugs();
  return slugs.map((slug: string) => ({
    slug: slug ? slug.split("/") : ["/"],
  }));
}
