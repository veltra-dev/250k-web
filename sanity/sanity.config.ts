import { buildTheme } from "@sanity/ui/theme";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * Studio theme using the current (non-deprecated) API: buildTheme from @sanity/ui/theme.
 * - Primary/accent uses orange hue (close to brand #b14f32).
 * - Light mode is forced via the Studio `scheme` prop in the embed (see studio-embed.tsx).
 */
const studioTheme = buildTheme({
  color: {
    base: {
      primary: { _hue: "orange" },
      "*": {
        focusRing: ["orange/500", "orange/400"],
        link: { fg: ["orange/600", "orange/400"] },
      },
    },
  },
});

export default defineConfig({
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
  theme: studioTheme,
});
