import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { cn } from "@/lib/utils";
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

export const Navigation: React.FC<{ variant?: "desktop" | "mobile" }> = async ({
  variant = "desktop",
}) => {
  const navigation = await getNavigation();
  const isMobile = variant === "mobile";

  return (
    <nav
      className={cn(
        isMobile
          ? "flex flex-col items-start gap-6"
          : "hidden items-center justify-center gap-8 md:flex",
      )}
    >
      {navigation?.map((slug: string) => (
        <NavigationItem
          key={slug}
          slug={slug}
          className={isMobile ? "font-exo text-4xl font-bold" : undefined}
        />
      ))}
    </nav>
  );
};
