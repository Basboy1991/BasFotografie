import type { StructureResolver } from "sanity/structure";

const portfolioCategories = [
  { title: "Kinderen", value: "Kinderen" },
  { title: "Gezinnen", value: "Gezinnen" },
  { title: "Huisdieren", value: "Huisdieren" },
  { title: "Portretten", value: "Portretten" },
  { title: "Privéarchief", value: "Privearchief" },
] as const;

export const portfolioStructure: StructureResolver = (S) =>
  S.list()
    .title("Bas Fotografie")
    .items([
      S.listItem()
        .title("Website-instellingen")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.listItem()
        .title("Portfolio")
        .schemaType("portfolioItem")
        .child(
          S.list()
            .title("Portfolio")
            .items([
              S.documentTypeListItem("portfolioItem").title("Alle foto's"),
              S.divider(),
              ...portfolioCategories.map(({ title, value }) =>
                S.listItem()
                  .title(title)
                  .schemaType("portfolioItem")
                  .child(
                    S.documentList()
                      .title(title)
                      .schemaType("portfolioItem")
                      .filter('_type == "portfolioItem" && category == $category')
                      .params({ category: value })
                      .defaultOrdering([{ field: "order", direction: "asc" }]),
                  ),
              ),
            ]),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !["siteSettings", "portfolioItem"].includes(item.getId() ?? ""),
      ),
    ]);
