const BCB_BASE = "https://api.bcb.gov.br/dados/serie/bcdata.sgs";

async function fetchBcbSeries(series: number): Promise<number | null> {
  try {
    const res = await fetch(
      `${BCB_BASE}.${series}/dados/ultimos/1?formato=json`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const arr = await res.json();
    console.log(arr);
    const item = Array.isArray(arr) ? arr[0] : null;
    const valor = item?.valor;
    return valor != null ? Number(valor) : null;
  } catch {
    return null;
  }
}

export interface CommoditiesData {
  usdBrl: number | null;
  soja: number | null;
  milho: number | null;
  algodao: number | null;
  cafe: number | null;
  acucar: number | null;
}

const SERIES = {
  USD_BRL: 10813,
  SOJA: 21619,
  MILHO: 21620,
  /* Séries adicionais BCB quando disponíveis; por ora null */
  ALGODAO: null as number | null,
  CAFE: null as number | null,
  ACUCAR: null as number | null,
} as const;

export async function getCommodities(): Promise<CommoditiesData> {
  const [usdBrl, soja, milho] = await Promise.all([
    fetchBcbSeries(SERIES.USD_BRL),
    fetchBcbSeries(SERIES.SOJA),
    fetchBcbSeries(SERIES.MILHO),
  ]);
  return {
    usdBrl,
    soja,
    milho,
    algodao:
      SERIES.ALGODAO != null ? await fetchBcbSeries(SERIES.ALGODAO) : null,
    cafe: SERIES.CAFE != null ? await fetchBcbSeries(SERIES.CAFE) : null,
    acucar: SERIES.ACUCAR != null ? await fetchBcbSeries(SERIES.ACUCAR) : null,
  };
}
