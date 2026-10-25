import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

export default defineType({
  name: "site",
  title: "Site",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "navigation", title: "Navigation" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "general",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      group: "general",
    }),
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "array",
      of: [
        defineField({
          name: "block",
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
      group: "general",
    }),
    defineField({
      name: "ogimage",
      title: "Open Graph Image",
      type: "image",
      options: { hotspot: true },
      group: "general",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Site settings",
    }),
  },
});
