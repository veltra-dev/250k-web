"use client";

import dynamic from "next/dynamic";

const StudioEmbed = dynamic(() => import("./studio-embed"), { ssr: false });

export function StudioClient() {
  return <StudioEmbed />;
}
