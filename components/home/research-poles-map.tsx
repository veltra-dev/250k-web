"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export function ResearchPolesMap() {
  const [MapComponent, setMapComponent] =
    useState<React.ComponentType<{}> | null>(null);

  useEffect(() => {
    void import("./research-poles-map-inner").then((mod) =>
      setMapComponent(() => mod.ResearchPolesMapInner),
    );
  }, []);

  if (!MapComponent) {
    return (
      <div className="min-h-[360px] md:min-h-[500px] w-full border border-border bg-muted/30 flex items-center justify-center text-muted-foreground">
        Carregando mapa…
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border border-border bg-card">
      <MapComponent />
    </div>
  );
}
