"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_QUERY = "(min-width: 768px)";

function getSnapshot() {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches;
}

function subscribe(callback: () => void) {
  const m = window.matchMedia(DESKTOP_QUERY);
  m.addEventListener("change", callback);
  return () => m.removeEventListener("change", callback);
}

/** True when viewport is at least 768px (Tailwind md). */
export function useDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
