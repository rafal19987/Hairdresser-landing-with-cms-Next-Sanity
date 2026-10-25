import { defineField, defineType } from "sanity";
import { DocumentVideoIcon } from "@sanity/icons/DocumentVideo";

export default defineType({
  name: "video",
  type: "object",
  icon: DocumentVideoIcon,
  fields: [
    defineField({
      name: "videoLabel",
      type: "string",
    }),
    defineField({
      name: "url",
      type: "string",
      title: "URL",
    }),
  ],
  preview: {
    select: {
      title: "videoLabel",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title || "Untitled",
        subtitle: "Video",
        media: media || DocumentVideoIcon,
      };
    },
  },
});
