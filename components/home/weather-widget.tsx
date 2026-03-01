import { IconCloud, IconTemperature, IconMapPin } from "@tabler/icons-react";
import type { WeatherData } from "@/lib/weather";

interface WeatherWidgetProps {
  data: WeatherData | null;
}

export function WeatherWidget({ data }: WeatherWidgetProps) {
  if (!data) {
    return (
      <div className="rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-muted p-2.5">
              <IconCloud className="h-6 w-6 text-muted-foreground" size={24} />
            </div>
            <h3 className="font-semibold text-primary">Clima</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Dados indisponíveis no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-sky-50/80 to-muted overflow-hidden dark:from-sky-950/20 dark:to-muted">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <IconTemperature className="h-8 w-8 text-primary" size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">
                Clima
              </h3>
              <p className="text-3xl font-bold text-primary mt-0.5 tabular-nums">
                {data.temperature}
                <span className="text-lg font-normal text-muted-foreground ml-0.5">
                  °C
                </span>
              </p>
            </div>
          </div>
          <div className="rounded-lg bg-background/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
            {data.condition}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-border">
          <IconMapPin className="h-3.5 w-3.5 text-muted-foreground" size={14} />
          <span className="text-xs text-muted-foreground">
            São Paulo (referência)
          </span>
        </div>
      </div>
    </div>
  );
}
