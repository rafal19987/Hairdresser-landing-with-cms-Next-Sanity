import { defineField, defineType } from "sanity";
import { EqualIcon } from "@sanity/icons/Equal";

export default defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: EqualIcon,
  fields: [
    defineField({
      name: "main",
      title: "Main",
      type: "array",
      of: [{ type: "reference", to: [{ type: "page" }] }],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Navigation",
        media: EqualIcon,
      };
    },
  },
});
