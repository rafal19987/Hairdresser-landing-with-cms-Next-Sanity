import { defineArrayMember, defineField, defineType } from "sanity";
import { PresentationIcon } from "@sanity/icons/Presentation";

export default defineType({
  name: "servicesSection",
  title: "Services Section",
  type: "object",
  icon: PresentationIcon,
  fields: [
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [defineArrayMember({ type: "service" })],
    }),
  ],
  preview: {
    select: {
      media: "image",
    },
    prepare({ media }) {
      return {
        title: "Services Section",
        media: media || PresentationIcon,
      };
    },
  },
});
