const SAO_PAULO = { lat: -23.55, lng: -46.63 };

export interface WeatherData {
  temperature: number;
  condition: string;
  code: number;
}

const WMO_CODES: Record<number, string> = {
  0: "Céu limpo",
  1: "Principalmente limpo",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina gelada",
  51: "Garoa leve",
  53: "Garoa",
  55: "Garoa forte",
  61: "Chuva leve",
  63: "Chuva",
  65: "Chuva forte",
  71: "Neve leve",
  73: "Neve",
  75: "Neve forte",
  77: "Grãos de neve",
  80: "Pancadas de chuva leve",
  81: "Pancadas de chuva",
  82: "Pancadas de chuva forte",
  85: "Pancadas de neve leve",
  86: "Pancadas de neve forte",
  95: "Trovoada",
  96: "Trovoada com granizo leve",
  99: "Trovoada com granizo forte",
};

export async function getWeather(): Promise<WeatherData | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(SAO_PAULO.lat));
    url.searchParams.set("longitude", String(SAO_PAULO.lng));
    url.searchParams.set("current", "temperature_2m,weather_code");

    const res = await fetch(url.toString(), {
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const cur = data?.current;
    if (!cur) return null;
    const code = Number(cur.weather_code) || 0;
    return {
      temperature: Number(cur.temperature_2m) ?? 0,
      condition: WMO_CODES[code] || "—",
      code,
    };
  } catch {
    return null;
  }
}
