import { HOURS } from "../constants";
import type { Sample } from "../sky";

const HOUR_MS = 60 * 60 * 1000;

export interface MissionProfile {
  minSunElevation: number;
  minPoweredHours: number;
  maxEarthGapHours: number;
}

export interface VisibilityWindow {
  start: number;
  end: number;
  hours: number;
  continues: boolean;
}

export interface MissionAssessment {
  poweredHours: number;
  maxEarthGapHours: number;
  powerPass: boolean;
  commsPass: boolean;
  passes: boolean;
}

export const DEFAULT_MISSION_PROFILE: MissionProfile = {
  minSunElevation: 5,
  minPoweredHours: 120,
  maxEarthGapHours: 72,
};

export function missionPeriod(data: Sample[]) {
  return data.slice(0, HOURS + 1);
}

export function getVisibilityWindows(data: Sample[], isVisible: (sample: Sample) => boolean): VisibilityWindow[] {
  if (data.length < 2) return [];

  const stepMs = data[1].t - data[0].t;
  const windows: VisibilityWindow[] = [];
  let start: number | null = null;

  for (let index = 0; index < data.length; index++) {
    const visible = isVisible(data[index]);
    if (visible && start === null) start = data[index].t;
    if (start !== null && (!visible || index === data.length - 1)) {
      const end = visible ? data[index].t + stepMs : data[index].t;
      windows.push({ start, end, hours: (end - start) / HOUR_MS, continues: visible && index === data.length - 1 });
      start = null;
    }
  }

  return windows;
}

export function assessMission(data: Sample[], profile: MissionProfile): MissionAssessment {
  const period = missionPeriod(data);
  const poweredWindows = getVisibilityWindows(period, (sample) => sample.sunUp && sample.sun.el >= profile.minSunElevation);
  const poweredHours = poweredWindows.reduce((total, window) => total + window.hours, 0);
  const stepHours = period.length > 1 ? (period[1].t - period[0].t) / HOUR_MS : 1;
  let currentGap = 0;
  let maxEarthGapHours = 0;

  for (let index = 0; index < period.length - 1; index++) {
    currentGap = period[index].earthUp ? 0 : currentGap + stepHours;
    maxEarthGapHours = Math.max(maxEarthGapHours, currentGap);
  }

  const powerPass = poweredHours >= profile.minPoweredHours;
  const commsPass = maxEarthGapHours <= profile.maxEarthGapHours;
  return { poweredHours, maxEarthGapHours, powerPass, commsPass, passes: powerPass && commsPass };
}