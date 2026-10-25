import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

export default defineType({
  name: "headlineWithText",
  title: "Headline with text",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "headline",
    },
    prepare({ title }) {
      return {
        title: title || "Headline with text",
        media: DocumentTextIcon,
      };
    },
  },
});
