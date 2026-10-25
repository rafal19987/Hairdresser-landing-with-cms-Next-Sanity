import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons/Link";
import { isValidUrl } from "@/sanity/utils/isValidUrl";

export default defineType({
  name: "portableText",
  title: "Portable Text",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "H5", value: "h5" },
        { title: "H6", value: "h6" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Number", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Small", value: "small" },
        ],
        annotations: [
          defineField({
            name: "link",
            title: "Link",
            type: "object",
            icon: LinkIcon,
            fields: [
              defineField({
                name: "type",
                title: "Link Type",
                type: "string",
                description: "Choose the type of link",
                options: {
                  list: ["internal", "external"],
                  layout: "radio",
                  direction: "horizontal",
                },
                initialValue: "external",
              }),
              defineField({
                name: "external",
                title: "URL",
                type: "string",
                description:
                  'The URL of the link. Ensure it starts with "https://", "mailto:" or "tel:" protocol',
                hidden: ({ parent }) => parent?.type !== "external",
                validation: (Rule) => [
                  Rule.custom((value, { parent }) => {
                    const type = (parent as { type?: string })?.type;
                    if (type === "external") {
                      if (!value) return "URL is required";
                      if (
                        !value.startsWith("https://") &&
                        !value.startsWith("mailto:") &&
                        !value.startsWith("tel:")
                      ) {
                        return 'External link must start with the "https://", "mailto:" or "tel:" protocol';
                      }
                      if (!isValidUrl(value)) return "Invalid URL";
                    }
                    return true;
                  }),
                ],
              }),
              defineField({
                name: "internal",
                title: "Internal reference to page",
                description: "Select an internal page to link to.",
                type: "reference",
                to: [{ type: "page" }],
                options: {
                  disableNew: true,
                  filter: "defined(slug.current)",
                },
                hidden: ({ parent }) => parent?.type !== "internal",
                validation: (Rule) =>
                  Rule.custom((value, { parent }) => {
                    const type = (parent as { type?: string })?.type;
                    if (type === "internal" && !value?._ref)
                      return "You have to choose internal page to link to.";
                    return true;
                  }),
              }),
            ],
          }),
        ],
      },
    },
  ],
});
