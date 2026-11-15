import { series, stats, type Sample, type Stats } from "../sky";
import { HOURS, HR } from "../constants";

export interface ScenarioWorkerRequest {
  lat: number;
  lon: number;
  base: string;
  flat: number;
  mask: number[] | null;
}

export interface ScenarioWorkerResult {
  data: Sample[];
  st: Stats | null;
}

interface WorkerScope {
  onmessage: ((event: MessageEvent<ScenarioWorkerRequest>) => void) | null;
  postMessage: (message: ScenarioWorkerResult) => void;
}

const workerScope = self as unknown as WorkerScope;

workerScope.onmessage = ({ data: request }) => {
  const timestamp = Date.parse(`${request.base}:00Z`);
  if (!Number.isFinite(timestamp)) {
    workerScope.postMessage({ data: [], st: null });
    return;
  }

  const start = timestamp - (timestamp % HR);
  const data = series(request.lat, request.lon, start, HOURS + 240, request.flat, request.mask ?? undefined);
  workerScope.postMessage({ data, st: stats(data.slice(0, HOURS + 1)) });
};