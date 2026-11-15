import type { Site } from "./data";
import type { Scenario } from "./types";
import type { Locale } from "./i18n";

export const iso = (t: number, locale: Locale = "en") => new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-US", {
	dateStyle: "medium",
	timeStyle: "short",
	timeZone: "UTC",
}).format(new Date(t));
export const tomorrow = () => new Date(Date.now() + 864e5).toISOString().slice(0, 11) + "00:00";
export const fromSite = (s: Site, base: string): Scenario => ({ site: s.id, lat: s.lat, lon: s.lon, base, flat: 0 });
