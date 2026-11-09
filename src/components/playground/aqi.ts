import tokens from '../../data/tokens.json';

export type Band = { label: string; short: string; bg: string; fg: string };

// The same lookup as the app's aqiInfo() and the dashboard's aqiInfo().
export function band(aqi: number | null | undefined): Band {
  if (aqi == null || Number.isNaN(aqi)) return tokens.aqi.unknown;
  return tokens.aqi.bands.find((b) => b.max == null || aqi <= b.max) ?? tokens.aqi.unknown;
}
