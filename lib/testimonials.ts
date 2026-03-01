export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "A 250k nos ajudou a estruturar o planejamento da safra e os resultados superaram as expectativas. Equipe técnica de alto nível.",
    name: "Carlos Mendes",
    role: "Produtor",
    company: "Fazenda Santa Maria",
  },
  {
    id: "2",
    quote:
      "Consultoria objetiva e alinhada ao nosso negócio. O acompanhamento de indicadores trouxe mais clareza para as decisões.",
    name: "Ana Paula Silva",
    role: "Gerente agrícola",
    company: "Cooperativa Agro Centro",
  },
  {
    id: "3",
    quote:
      "Recomendo a 250k para quem busca gestão profissional e foco em resultados. Parceria que faz diferença no campo.",
    name: "Roberto Oliveira",
    role: "Diretor",
    company: "Agrícola do Cerrado",
  },
  {
    id: "4",
    quote:
      "O apoio técnico e a análise de mercado foram fundamentais para nossa estratégia de comercialização nesta safra.",
    name: "Fernanda Costa",
    role: "Coordenadora",
    company: "Grupo Agronegócio Sul",
  },
];
