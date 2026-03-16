"use client";

import { useState, useEffect } from "react";
import {
  IconCloud,
  IconSun,
  IconCloudRain,
  IconSnowflake,
  IconBolt,
  IconMapPin,
} from "@tabler/icons-react";
import {
  useShowAfterHeroHalf,
  getFloatingVisibilityClassName,
} from "@/hooks/use-show-after-hero-half";
import { WMO_CODES } from "@/lib/weather";
import { cn } from "@/lib/utils";

const SINOP_MT = { lat: -11.8642, lng: -55.5036 };

interface OpenMeteoCurrent {
  temperature_2m: number;
  weather_code: number;
}

function getWeatherIcon(code: number) {
  if (code === 0) return IconSun;
  if (code >= 1 && code <= 3) return IconCloud;
  if (code >= 51 && code <= 82) return IconCloudRain;
  if (code >= 71 && code <= 86) return IconSnowflake;
  if (code >= 95 && code <= 99) return IconBolt;
  return IconCloud;
}

export function FloatingWeatherWidget() {
  const visible = useShowAfterHeroHalf();
  const [temp, setTemp] = useState<number | null>(null);
  const [code, setCode] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(SINOP_MT.lat));
    url.searchParams.set("longitude", String(SINOP_MT.lng));
    url.searchParams.set("current", "temperature_2m,weather_code");

    fetch(url.toString())
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("fetch"))))
      .then((data: { current?: OpenMeteoCurrent }) => {
        if (cancelled || !data?.current) return;
        const cur = data.current;
        setTemp(Number(cur.temperature_2m));
        setCode(Number(cur.weather_code) || 0);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const condition = WMO_CODES[code] ?? "—";
  const Icon = getWeatherIcon(code);

  return (
    <div
      aria-label="Clima em Sinop, MT"
      className={cn(
        "fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-border bg-muted/85 py-2 px-3 shadow-lg backdrop-blur transition-all duration-300",
        getFloatingVisibilityClassName(visible),
      )}
    >
      {loading ? (
        <span className="text-sm text-muted-foreground">Carregando...</span>
      ) : error ? (
        <span className="text-sm text-muted-foreground">
          Clima indisponível
        </span>
      ) : (
        <>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground">
            <Icon className="size-4" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[0.65rem] text-muted-foreground font-semibold">
              <IconMapPin className="size-3 shrink-0" />
              <span>Sinop, MT</span>
            </p>
            <p className="text-sm font-bold tabular-nums text-foreground leading-none">
              {temp != null ? `${Math.round(temp)}°C` : "—"}
            </p>
            {/* <p className="truncate text-xs text-muted-foreground">
              {condition}
            </p> */}
          </div>
        </>
      )}
    </div>
  );
}
