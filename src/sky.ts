import * as A from "astronomy-engine";

const D = Math.PI / 180;
const AU = 149597870.7; // km
const R_MOON = 1737.4; // km, same sphere LOLA coordinates refer to
const R_SUN = 695700; // km
const H = 36e5;

type V = [number, number, number];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const norm = (a: V) => Math.sqrt(dot(a, a));
const R3 = (v: V, t: number): V => [Math.cos(t) * v[0] + Math.sin(t) * v[1], -Math.sin(t) * v[0] + Math.cos(t) * v[1], v[2]];
const R1 = (v: V, t: number): V => [v[0], Math.cos(t) * v[1] + Math.sin(t) * v[2], -Math.sin(t) * v[1] + Math.cos(t) * v[2]];

const cache = new Map<number, { sun: V; earth: V }>();

/** Sun and Earth position vectors (km) in the Moon body-fixed frame (IAU rotation model,
 *  mean-Earth/polar-axis like), origin at the Moon's centre. */
export function bodyFixed(t: number) {
  const hit = cache.get(t);
  if (hit) return hit;
  const date = new Date(t);
  const ax = A.RotationAxis(A.Body.Moon, date); // ra in hours, dec and spin (prime meridian W) in degrees
  const a = ax.ra * 15 * D, d = ax.dec * D, w = ax.spin * D;
  const toBF = (v: V): V => R3(R1(R3(v, a + Math.PI / 2), Math.PI / 2 - d), w);
  const m = A.GeoVector(A.Body.Moon, date, false);
  const s = A.GeoVector(A.Body.Sun, date, false);
  const moon: V = [m.x * AU, m.y * AU, m.z * AU];
  const sun: V = [s.x * AU, s.y * AU, s.z * AU];
  const v = { earth: toBF([-moon[0], -moon[1], -moon[2]]), sun: toBF(sub(sun, moon)) };
  if (cache.size > 6000) cache.clear();
  cache.set(t, v);
  return v;
}

export interface Look { el: number; az: number; rad: number }
export type Body = "sun" | "earth";

/** Topocentric elevation/azimuth (no refraction, parallax included). lat/lon: selenographic deg. */
export function look(lat: number, lon: number, body: Body, t: number): Look {
  const φ = lat * D, λ = lon * D;
  const up: V = [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)];
  const east: V = [-Math.sin(λ), Math.cos(λ), 0];
  const north: V = [-Math.sin(φ) * Math.cos(λ), -Math.sin(φ) * Math.sin(λ), Math.cos(φ)];
  const pos: V = [up[0] * R_MOON, up[1] * R_MOON, up[2] * R_MOON];
  const d = sub(bodyFixed(t)[body], pos);
  const r = norm(d);
  return {
    el: Math.asin(dot(d, up) / r) / D,
    az: (Math.atan2(dot(d, east), dot(d, north)) / D + 360) % 360,
    rad: body === "sun" ? Math.asin(R_SUN / r) / D : 0,
  };
}

export function horizonAt(az: number, flat: number, mask?: number[]) {
  if (!mask) return flat;
  const n = mask.length, x = (az / 360) * n, i = Math.floor(x) % n, f = x - Math.floor(x);
  return mask[i] * (1 - f) + mask[(i + 1) % n] * f;
}

export interface Sample { t: number; sun: Look; earth: Look; sunUp: boolean; earthUp: boolean }

export function series(lat: number, lon: number, start: number, hours: number, flat: number, mask?: number[]): Sample[] {
  const out: Sample[] = [];
  for (let i = 0; i <= hours; i++) {
    const t = start + i * H;
    const sun = look(lat, lon, "sun", t), earth = look(lat, lon, "earth", t);
    out.push({
      t, sun, earth,
      sunUp: sun.el + sun.rad > horizonAt(sun.az, flat, mask), // upper limb
      earthUp: earth.el > horizonAt(earth.az, flat, mask),
    });
  }
  return out;
}

export interface Stats { sunPct: number; earthPct: number; maxSun: number; darkH: number; noEarthH: number; bothPct: number }

export function stats(s: Sample[]): Stats {
  const n = s.length;
  const run = (f: (p: Sample) => boolean) => {
    let best = 0, cur = 0;
    for (const p of s) { if (!f(p)) best = Math.max(best, ++cur); else cur = 0; }
    return best;
  };
  const pct = (f: (p: Sample) => boolean) => Math.round((100 * s.filter(f).length) / n);
  return {
    sunPct: pct((p) => p.sunUp), earthPct: pct((p) => p.earthUp), bothPct: pct((p) => p.sunUp && p.earthUp),
    maxSun: Math.max(...s.map((p) => p.sun.el)),
    darkH: run((p) => p.sunUp), noEarthH: run((p) => p.earthUp),
  };
}

export function nextChange(s: Sample[], i: number, key: "sunUp" | "earthUp") {
  const up = s[i][key];
  for (let j = i + 1; j < s.length; j++) if (s[j][key] !== up) return { up, hours: j - i, atLeast: 0 };
  return { up, hours: null as number | null, atLeast: s.length - 1 - i };
}

export function fmtH(h: number | null) {
  if (h === null) return "n/a";
  const d = Math.floor(h / 24), r = h % 24;
  return d ? `${d} d ${r} h` : `${r} h`;
}
