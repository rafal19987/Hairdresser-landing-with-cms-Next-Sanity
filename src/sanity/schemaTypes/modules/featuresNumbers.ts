import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export default defineType({
  name: "featuresNumbers",
  title: "Features Numbers",
  type: "object",
  fields: [
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "number",
              title: "Number",
              type: "number",
            }),
            defineField({
              name: "headline",
              title: "Headline",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .length(4)
          .warning("Only 4 features are allowed. Not less not more."),
    }),
  ],
  preview: {
    select: {
      media: "image",
    },
    prepare({ media }) {
      return {
        title: "Features Numbers Section",
        media: media || DocumentsIcon,
      };
    },
  },
});
