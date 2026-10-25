import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";

export default defineType({
  name: "illustrationWithContent",
  title: "Illustration with content",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "desktopImageDisplayOrder",
      title: "Desktop image display order",
      type: "string",
      options: {
        list: ["right", "left"],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "right",
    }),
    defineField({
      name: "mobileImageDisplayOrder",
      title: "Mobile image display order",
      type: "string",
      options: {
        list: ["top", "bottom"],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "top",
    }),
    defineField({
      name: "illustration",
      title: "Illustration",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "portableText",
    }),
  ],
  preview: {
    select: {
      media: "image",
    },
    prepare({ media }) {
      return {
        title: "Illustration with content",
        media: media || ImagesIcon,
      };
    },
  },
});
