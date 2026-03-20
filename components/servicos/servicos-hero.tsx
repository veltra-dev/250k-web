import Image from "next/image";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&fit=crop&q=80&auto=format";

export function ServicosHero() {
  return (
    <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={DEFAULT_HERO_IMAGE}
          alt="Campo agrícola"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-primary/70" aria-hidden />
      </div>
      <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
          Conheça nossos serviços
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/95 max-w-2xl mx-auto drop-shadow-sm">
          Tecnologia e inovação no campo para produtividade e sustentabilidade
        </p>
      </div>
    </section>
  );
}
