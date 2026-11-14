import { useMemo } from "react";
import { series, stats, type Sample, type Stats } from "../sky";
import { HOURS, HR } from "../constants";
import type { Scenario } from "../types";

export interface ScenarioData { data: Sample[]; st: Stats | null }

export function useScenarioData(s: Scenario, mask: number[] | null): ScenarioData {
  return useMemo(() => {
    const t0 = Date.parse(s.base + ":00Z");
    if (isNaN(t0)) return { data: [], st: null };
    const start = t0 - (t0 % HR);
    const data = series(s.lat, s.lon, start, HOURS + 240, s.flat, mask ?? undefined);
    return { data, st: stats(data.slice(0, HOURS + 1)) };
  }, [s.lat, s.lon, s.base, s.flat, mask]);
}
