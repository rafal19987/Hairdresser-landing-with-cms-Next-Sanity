import { defineField, defineType } from "sanity";
import { BookingServiceInput } from "@/sanity/components/BookingServiceInput";

export default defineType({
  name: "service",
  title: "Service",
  type: "object",
  fields: [
    defineField({
      name: "letter",
      title: "Letter",
      type: "string",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "button",
      title: "Button",
      type: "button",
    }),
    defineField({
      name: "bookingServiceId",
      title: "Usługa w systemie rezerwacji",
      description:
        "Przycisk otworzy rezerwację z wybraną usługą. Bez powiązania używa adresu URL przycisku.",
      type: "string",
      components: { input: BookingServiceInput },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
  ],
});
