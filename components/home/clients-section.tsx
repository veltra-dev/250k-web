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
      className="flex flex-col items-center justify-center min-h-[100px] px-4 py-5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {clients.map((client) => (
            <ClientPlaceholder key={client.name} name={client.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
