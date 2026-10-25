import { defineArrayMember, defineType } from "sanity";
import services from "./services";
import illustrationWithContent from "./illustrationWithContent";
import frequentlyAskedQuestions from "./frequentlyAskedQuestions";
import featuresNumbers from "./featuresNumbers";
import hero from "./hero";
import testimonials from "./testimonials";

export const sectionTypes = [
  hero,
  featuresNumbers,
  illustrationWithContent,
  services,
  frequentlyAskedQuestions,
  testimonials,
];

export default defineType({
  name: "components",
  title: "Components",
  type: "array",
  of: sectionTypes.map((section) => defineArrayMember({ type: section.name })),
  options: {
    layout: "list",
    insertMenu: {
      filter: true,
      showIcons: true,
      groups: [
        {
          name: "landing",
          title: "Landing",
          of: [
            "hero",
            "featuresNumbers",
            "illustrationWithContent",
            "servicesSection",
            "frequentlyAskedQuestions",
            "testimonials",
          ],
        },
      ],
      views: [
        { name: "list" },
        {
          name: "grid",
          previewImageUrl: (schemaTypeName) => `/static/${schemaTypeName}.png`,
        },
      ],
    },
  },
});
