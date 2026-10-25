import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

export default defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "coveImage",
      title: "Cover Image",
      type: "image",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "object",
      fields: [
        defineField({
          name: "smallHeadline",
          title: "Small Headline",
          type: "string",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string",
        }),
      ],
    }),
    // defineField({
    //   name: "headline",
    //   title: "Headline",
    //   type: "array",
    //   of: [
    //     {
    //       type: "block",
    //       styles: [
    //         { title: "Normal", value: "normal" },
    //         { title: "H1", value: "h1" },
    //         { title: "H2", value: "h2" },
    //       ],
    //     },
    //   ],
    // }),
    defineField({
      name: "cta",
      title: "Cta",
      type: "button",
    }),
    defineField({
      name: "showScrollDown",
      title: "Show Scroll Down",
      type: "boolean",
    }),
  ],
  preview: {
    select: {
      media: "image",
    },
    prepare({ media }) {
      return {
        title: "Hero Section",
        media: media || DocumentTextIcon,
      };
    },
  },
});
