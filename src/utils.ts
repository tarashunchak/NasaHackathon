import type { Site } from "./data";
import type { Scenario } from "./types";

export const iso = (t: number) => new Date(t).toISOString().slice(0, 16).replace("T", " ");
export const tomorrow = () => new Date(Date.now() + 864e5).toISOString().slice(0, 11) + "00:00";
export const fromSite = (s: Site, base: string): Scenario => ({ site: s.id, lat: s.lat, lon: s.lon, base, flat: 0 });
