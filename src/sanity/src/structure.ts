import { singleton } from "@/sanity/src/utils";
import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { EqualIcon } from "@sanity/icons/Equal";
// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "site", "Site settings").icon(CogIcon),
      S.divider(),

      S.documentTypeListItem("page").title("Pages").icon(DocumentsIcon),
      S.divider(),

      S.documentTypeListItem("navigation").title("Navigation").icon(EqualIcon),
    ]);
