import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { NavigationItem } from "./NavigationItem";

const getNavigation = async () => {
  return await client.fetch(
    groq`*[_type == "navigation"][0]{
      main[]-> {
        slug
      }
    }.main[].slug.current`,
  );
};

export const Navigation: React.FC = async () => {
  const navigation = await getNavigation();
  return (
    <nav className="hidden items-center justify-center gap-8 md:flex">
      {navigation?.map((slug: string) => (
        <NavigationItem key={slug} slug={slug} />
      ))}
    </nav>
  );
};
