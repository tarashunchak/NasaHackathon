import * as THREE from "three";

const D = Math.PI / 180;

/** Texture lookup order: your own file first, then a public sample from the three.js repo. */
export const MOON_TEXTURE = {
  local: `${import.meta.env.BASE_URL}textures/moon.jpg`,
  remote: "https://raw.githubusercontent.com/mrdoob/three.js/refs/heads/master/examples/textures/planets/moon_1024.jpg",
  /** Rotate the map about the pole if features sit at the wrong longitude (check Tycho, Mare Tranquillitatis). */
  lonOffsetDeg: 0,
};

// Moon body-fixed (x: lon 0, y: lon 90E, z: north) to three.js (y up); keeps handedness
export const toThree = (v: number[]) => new THREE.Vector3(v[0], v[2], -v[1]);

export const ll = (lat: number, lon: number, r = 1) =>
  toThree([Math.cos(lat * D) * Math.cos(lon * D), Math.cos(lat * D) * Math.sin(lon * D), Math.sin(lat * D)]).multiplyScalar(r);

export function graticule(color: number) {
  const g = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45 });
  const loop = (pts: THREE.Vector3[]) => g.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat));
  for (let lat = -60; lat <= 60; lat += 30) loop(Array.from({ length: 90 }, (_, i) => ll(lat, i * 4, 1.002)));
  for (let lon = 0; lon < 180; lon += 30)
    loop(Array.from({ length: 120 }, (_, i) => {
      const a = i * 3;
      return ll(a <= 90 ? a : a <= 270 ? 180 - a : a - 360, a <= 90 || a > 270 ? lon : lon + 180, 1.002);
    }));
  return g;
}

export const ball = (color: number, r: number) =>
  new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), new THREE.MeshBasicMaterial({ color }));

export const line = (color: number) =>
  new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 1, 0)]), new THREE.LineBasicMaterial({ color }));

export function loadMoonTexture(onLoad: (t: THREE.Texture) => void) {
  const loader = new THREE.TextureLoader();
  const urls = [MOON_TEXTURE.local, MOON_TEXTURE.remote];
  const next = (i: number) => {
    if (i >= urls.length) return;
    loader.load(urls[i], (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; onLoad(t); }, undefined, () => next(i + 1));
  };
  next(0);
}
