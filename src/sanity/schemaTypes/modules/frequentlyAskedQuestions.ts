import { defineType, defineField } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

export default defineType({
  name: "frequentlyAskedQuestions",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "heading",
      type: "string",
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "questions",
      type: "array",
      of: [
        {
          type: "object",
          name: "question",
          fields: [
            { name: "question", type: "string" },
            { name: "answer", type: "text" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title,
        subtitle: "FAQ",
        media: media,
      };
    },
  },
});
