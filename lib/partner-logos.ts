export interface PartnerLogo {
  src: string;
  alt: string;
}

/** Logos em `public/images/parceiros` — ordem de exibição no carrossel. */
export const PARTNER_LOGOS: PartnerLogo[] = [
  { src: "/images/parceiros/agriotech.png", alt: "Agriotech" },
  { src: "/images/parceiros/basf.png", alt: "BASF" },
  { src: "/images/parceiros/bayer.png", alt: "Bayer" },
  { src: "/images/parceiros/koppert.png", alt: "Koppert" },
  { src: "/images/parceiros/morgan.png", alt: "Morgan" },
  { src: "/images/parceiros/petrovina.png", alt: "Petrovina" },
  { src: "/images/parceiros/pioneer.png", alt: "Pioneer" },
  { src: "/images/parceiros/syngenta.png", alt: "Syngenta" },
];
