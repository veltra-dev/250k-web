import { Archivo } from "next/font/google";

/** Archivo variable (wght + wdth) for /solucoes section titles — use fontVariationSettings for 800 + max width. */
export const archivoSolutionTitle = Archivo({
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
  display: "swap",
});
