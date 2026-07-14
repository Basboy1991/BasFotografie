import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { portfolioStructure } from "./sanity/studioStructure";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || "k2m6gkis";
const dataset =
  process.env.SANITY_STUDIO_DATASET || process.env.PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "bas_fotografie",
  title: "Bas Fotografie CMS",
  projectId,
  dataset,
  plugins: [structureTool({ structure: portfolioStructure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
