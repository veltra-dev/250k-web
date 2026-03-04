export interface ResearchPole {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

/** Research centers (polos de pesquisa) da 250k em Mato Grosso, Brasil */
export const researchPoles: ResearchPole[] = [
  { id: "sinop", name: "Sinop (Matriz)", lat: -11.8508625, lng: -55.5330494 },
  { id: "sorriso", name: "Sorriso", lat: -12.5474376, lng: -55.8048681 },
  {
    id: "vera",
    name: "Vera",
    lat: -12.2875548,
    lng: -55.2987647,
  },
  {
    id: "boa-esperanca",
    name: "Boa Esperança",
    lat: -13.5086319,
    lng: -55.1514344,
  },
  {
    id: "alta-floresta",
    name: "Alta Floresta",
    lat: -9.8674987,
    lng: -56.0846284,
  },
  { id: "porto", name: "Porto", lat: -11.871, lng: -57.201 },
  {
    id: "matupa",
    name: "Matupá",
    lat: -10.1694673,
    lng: -54.924403,
  },
];
