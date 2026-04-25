"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/sanity.config";

export default function StudioEmbed() {
  return <NextStudio config={config} scheme="light" />;
}
