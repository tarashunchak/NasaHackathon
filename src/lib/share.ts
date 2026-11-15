import { CUSTOM } from "../constants";
import { fromSite, tomorrow } from "../utils";
import type { Site } from "../data";
import { DEFAULT_MISSION_PROFILE, type MissionProfile } from "./mission";
import type { Scenario } from "../types";

export interface SharedState {
  a: Scenario;
  b: Scenario;
  profile: MissionProfile;
}

function validHorizon(value: unknown): value is number[] {
  return Array.isArray(value) && value.length >= 12 && value.length <= 4096
    && value.every((angle) => typeof angle === "number" && Number.isFinite(angle) && angle >= -90 && angle <= 90);
}

function restoreScenario(value: unknown, fallback: Scenario, sites: Site[]): Scenario {
  if (!value || typeof value !== "object") return fallback;
  const scenario = value as Record<string, unknown>;
  const validSite = scenario.site === CUSTOM || sites.some((site) => site.id === scenario.site);
  const validBase = typeof scenario.base === "string" && Number.isFinite(Date.parse(scenario.base));
  const validCoordinates = typeof scenario.lat === "number" && Number.isFinite(scenario.lat) && Math.abs(scenario.lat) <= 90
    && typeof scenario.lon === "number" && Number.isFinite(scenario.lon) && Math.abs(scenario.lon) <= 360;
  const validFlat = typeof scenario.flat === "number" && Number.isFinite(scenario.flat) && scenario.flat >= 0 && scenario.flat <= 30;
  if (!validSite || !validBase || !validCoordinates || !validFlat) return fallback;
  return {
    site: scenario.site as string,
    lat: scenario.lat as number,
    lon: scenario.lon as number,
    base: scenario.base as string,
    flat: scenario.flat as number,
    horizon: validHorizon(scenario.horizon) ? scenario.horizon : undefined,
  };
}

function restoreProfile(value: unknown): MissionProfile {
  if (!value || typeof value !== "object") return DEFAULT_MISSION_PROFILE;
  const profile = value as Record<string, unknown>;
  const minSunElevation = typeof profile.minSunElevation === "number" && Number.isFinite(profile.minSunElevation)
    ? Math.max(-10, Math.min(90, profile.minSunElevation)) : DEFAULT_MISSION_PROFILE.minSunElevation;
  const minPoweredHours = typeof profile.minPoweredHours === "number" && Number.isFinite(profile.minPoweredHours)
    ? Math.max(0, Math.min(720, profile.minPoweredHours)) : DEFAULT_MISSION_PROFILE.minPoweredHours;
  const maxEarthGapHours = typeof profile.maxEarthGapHours === "number" && Number.isFinite(profile.maxEarthGapHours)
    ? Math.max(0, Math.min(720, profile.maxEarthGapHours)) : DEFAULT_MISSION_PROFILE.maxEarthGapHours;
  return { minSunElevation, minPoweredHours, maxEarthGapHours };
}

export function readSharedState(sites: Site[]): SharedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = new URLSearchParams(window.location.search).get("state");
    if (!raw) return null;
    const shared = JSON.parse(raw) as Record<string, unknown>;
    const base = tomorrow();
    return {
      a: restoreScenario(shared.a, fromSite(sites[0], base), sites),
      b: restoreScenario(shared.b, fromSite(sites[Math.min(1, sites.length - 1)], base), sites),
      profile: restoreProfile(shared.profile),
    };
  } catch {
    return null;
  }
}