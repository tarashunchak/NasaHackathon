import { useEffect, useState } from "react";
import type { Sample, Stats } from "../sky";
import type { Scenario } from "../types";
import type { ScenarioWorkerRequest, ScenarioWorkerResult } from "../workers/scenario.worker";

export interface ScenarioData extends ScenarioWorkerResult { pending: boolean }

export function useScenarioData(s: Scenario, mask: number[] | null): ScenarioData {
  const [result, setResult] = useState<ScenarioData>({ data: [], st: null, pending: true });

  useEffect(() => {
    const request: ScenarioWorkerRequest = { lat: s.lat, lon: s.lon, base: s.base, flat: s.flat, mask };
    if (!Number.isFinite(Date.parse(`${request.base}:00Z`))) {
      setResult({ data: [], st: null, pending: false });
      return;
    }

    let active = true;
    setResult((current) => ({ ...current, pending: true }));
    const worker = new Worker(new URL("../workers/scenario.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (event: MessageEvent<ScenarioWorkerResult>) => {
      if (active) setResult({ ...event.data, pending: false });
    };
    worker.onerror = () => {
      if (active) setResult({ data: [], st: null, pending: false });
    };
    worker.postMessage(request);

    return () => {
      active = false;
      worker.terminate();
    };
  }, [s.lat, s.lon, s.base, s.flat, mask]);

  return result;
}
