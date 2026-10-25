import { type SchemaTypeDefinition } from "sanity";
import page from "@/sanity/schemaTypes/documents/page";
import navigation from "@/sanity/schemaTypes/documents/navigation";
import site from "@/sanity/schemaTypes/documents/site";
import video from "@/sanity/schemaTypes/objects/video";
import service from "@/sanity/schemaTypes/objects/service";
import components, { sectionTypes } from "@/sanity/schemaTypes/modules";
import seo from "@/sanity/schemaTypes/objects/seo";
import button from "@/sanity/schemaTypes/objects/button";
import portableText from "@/sanity/schemaTypes/objects/portableText";
import paragraph from "@/sanity/schemaTypes/objects/paragraph";
import headlineWithText from "@/sanity/schemaTypes/objects/headlineWithText";
import testimonial from "@/sanity/schemaTypes/objects/testimonial";

const documentTypes = [page, navigation, site];
const singleTypes = [service, video, headlineWithText, testimonial];
const Components = [components, ...sectionTypes];
const ui = [seo, button, portableText, paragraph];

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...documentTypes, ...singleTypes, ...Components, ...ui],
};
