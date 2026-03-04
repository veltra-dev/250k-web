import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImage } from "./types";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: SanityImage | undefined | null): ReturnType<typeof builder.image> {
  if (!source?.asset?._ref) {
    return builder.image("");
  }
  return builder.image(source);
}
