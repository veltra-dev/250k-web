/** Splits solution section titles so the trailing brand "K" can use accent color (e.g. "-K" products, "250K Academy"). */
export function splitBrandKTitle(title: string): {
  before: string;
  accent: string | null;
  after: string;
} {
  if (title.endsWith("K")) {
    return { before: title.slice(0, -1), accent: "K", after: "" };
  }
  if (title.startsWith("250K")) {
    return { before: "250", accent: "K", after: title.slice(4) };
  }
  return { before: title, accent: null, after: "" };
}
