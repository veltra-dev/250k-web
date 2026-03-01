"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export function ResearchPolesMap() {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<{}> | null>(null);

  useEffect(() => {
    void import("./research-poles-map-inner").then((mod) =>
      setMapComponent(() => mod.ResearchPolesMapInner)
    );
  }, []);

  if (!MapComponent) {
    return (
      <div
        className="w-full rounded-xl border border-border bg-muted/30 flex items-center justify-center text-muted-foreground"
        style={{ minHeight: 360 }}
      >
        Carregando mapa…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <MapComponent />
    </div>
  );
}
