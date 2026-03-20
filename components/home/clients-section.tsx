import { clients } from "@/lib/clients";

function ClientPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex min-h-[100px] w-[180px] shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-card px-4 py-5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
      title={name}
    >
      <span className="text-2xl font-bold text-primary/60 mb-1">{initials}</span>
      <span className="text-xs font-medium text-center leading-tight line-clamp-2">
        {name}
      </span>
    </div>
  );
}

export function ClientsSection() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-2">
          Empresas que confiam na 250k
        </h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
          Produtores e cooperativas que escolheram nossa consultoria para
          resultados no campo.
        </p>
        <div className="flex gap-4 overflow-x-auto pb-2 md:gap-6">
          {clients.map((client) => (
            <ClientPlaceholder key={client.name} name={client.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
