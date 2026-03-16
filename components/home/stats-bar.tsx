import {
  IconBook,
  IconUsers,
  IconThumbUp,
  IconCheck,
  IconMapPin,
} from "@tabler/icons-react";

const STATS = [
  {
    icon: IconBook,
    value: "+700",
    label: "Treinamentos",
  },
  {
    icon: IconUsers,
    value: "+5k",
    label: "Profissionais capacitados",
  },
  {
    icon: IconThumbUp,
    value: "+30k",
    label: "Seguidores",
  },
  {
    icon: IconCheck,
    value: "+20k",
    label: "Hectares atendidos",
  },
  {
    icon: IconMapPin,
    value: "+300k",
    label: "Hectares influenciados",
  },
] as const;

export function StatsBar() {
  return (
    <section className="w-full bg-accent py-10 md:py-12" aria-label="Números da 250k">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 md:gap-x-16">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center text-accent-foreground"
            >
              <div className="rounded-full bg-accent-foreground/15 p-3 mb-2">
                <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.8} />
              </div>
              <span className="text-2xl md:text-3xl font-bold tabular-nums">
                {value}
              </span>
              <span className="text-sm md:text-base font-medium opacity-95 mt-0.5 max-w-[140px]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
