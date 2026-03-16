"use client";

import type { ComponentType, SVGProps } from "react";
import {
  IconCurrencyDollar,
  IconPlant2,
  IconWheat,
  IconCircleDot,
  IconCoffee,
  IconCandy,
} from "@tabler/icons-react";
import type { CommoditiesData } from "@/lib/commodities";

function formatValue(value: number | null): string {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

const ITEMS: Array<{
  key: keyof CommoditiesData;
  label: string;
  get: (d: CommoditiesData) => number | null;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  {
    key: "usdBrl",
    // label: "Dólar (USD/BRL)",
    label: "Dólar",
    get: (d) => d.usdBrl,
    Icon: IconCurrencyDollar,
  },
  { key: "soja", label: "Soja", get: (d) => d.soja, Icon: IconPlant2 },
  { key: "milho", label: "Milho", get: (d) => d.milho, Icon: IconWheat },
  {
    key: "algodao",
    label: "Algodão",
    get: (d) => d.algodao,
    Icon: IconCircleDot,
  },
  { key: "cafe", label: "Café", get: (d) => d.cafe, Icon: IconCoffee },
  { key: "acucar", label: "Açúcar", get: (d) => d.acucar, Icon: IconCandy },
];

const SEGMENT_COUNT = 10;

function CommodityChip({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number | null;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  return (
    <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-primary/5 px-2 py-1 text-[0.65rem]">
      <Icon
        className="size-3 text-primary shrink-0"
        strokeWidth={1.5}
        aria-hidden
      />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-primary">
        R$ {formatValue(value)}
      </span>
    </span>
  );
}

export function CommoditiesWidget({ data }: { data: CommoditiesData }) {
  return (
    <div className="sticky top-12 z-40 w-full overflow-hidden rounded-lg bg-muted py-3 shadow-sm">
      <p className="sr-only">
        Mercado e commodities: Dólar {formatValue(data.usdBrl)}, Soja{" "}
        {formatValue(data.soja)}, Milho {formatValue(data.milho)}, Algodão{" "}
        {formatValue(data.algodao)}, Café {formatValue(data.cafe)}, Açúcar{" "}
        {formatValue(data.acucar)}.{/* Fonte: Banco Central do Brasil. */}
      </p>
      <div className="flex w-max relative isolate will-change-transform gap-4 animate-commodities-scroll">
        {Array.from({ length: SEGMENT_COUNT }, (_, segmentIndex) => (
          <div
            key={segmentIndex}
            className="flex shrink-0 min-w-0 items-center gap-4"
            aria-hidden={segmentIndex > 0}
          >
            {ITEMS.map(({ key, label, get, Icon }) => {
              const value = get(data);
              if (value == null) return null;
              return (
                <CommodityChip
                  key={`${segmentIndex}-${key}`}
                  label={label}
                  value={value}
                  Icon={Icon}
                />
              );
            })}
          </div>
        ))}
      </div>
      {/* <p className="text-center text-xs text-muted-foreground mt-2">
        Fonte: Banco Central do Brasil
      </p> */}
    </div>
  );
}
