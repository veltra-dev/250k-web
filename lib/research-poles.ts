export interface ResearchPole {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

/** Research centers (polos de pesquisa) da 250k em Mato Grosso, Brasil */
export const researchPoles: ResearchPole[] = [
  { id: "sinop", name: "Sinop (Matriz)", lat: -11.8642, lng: -55.4972 },
  { id: "sorriso", name: "Sorriso", lat: -12.5422, lng: -55.7211 },
  { id: "vera", name: "Vera", lat: -12.3186, lng: -55.3175 },
  { id: "boa-esperanca", name: "Boa Esperança", lat: -12.9, lng: -55.3 },
  { id: "alta-floresta", name: "Alta Floresta", lat: -9.8756, lng: -56.0861 },
  { id: "porto", name: "Porto", lat: -11.871, lng: -57.201 },
  { id: "matupa", name: "Matupá", lat: -10.0592, lng: -54.2331 },
];
