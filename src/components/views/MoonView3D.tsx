import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { bodyFixed } from "../../sky";
import { MOON_TEXTURE, ball, createSunTexture, graticule, line, ll, loadEarthTexture, loadMoonTexture, toThree } from "../../lib/moon3d";
import { useLocale } from "../../i18n";

const styles = {
  box: "relative h-80 w-full overflow-hidden rounded-sm border border-[#35443a] bg-[#111914]",
  hint: "pointer-events-none absolute bottom-2 left-2 right-2 bg-[#111914]/85 px-2 py-1 text-xs text-[#e2e8df]",
  fallback: "absolute inset-0 grid place-items-center px-6 text-center text-sm text-[#d3ddd2]",
  c: { moon: 0xa2a89c, grid: 0x7d8b7c, sun: 0xe6b45e, earth: 0x91a879, site: 0xc85a36, ring: 0xd7ded3 },
};

interface Props { lat: number; lon: number; t: number }
interface Scene3D {
  camera: THREE.PerspectiveCamera; controls: OrbitControls; light: THREE.DirectionalLight;
  sun: THREE.Mesh; earth: THREE.Mesh; marker: THREE.Mesh; ring: THREE.Mesh; sunLine: THREE.Line; earthLine: THREE.Line;
}

export default function MoonView3D({ lat, lon, t }: Props) {
  const { t: translate } = useLocale();
  const box = useRef<HTMLDivElement>(null);
  const o = useRef<Scene3D | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setUnavailable(true);
      return;
    }
    setUnavailable(false);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; controls.minDistance = 1.6; controls.maxDistance = 10;

    const moonMat = new THREE.MeshStandardMaterial({ color: styles.c.moon, roughness: 1 });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), moonMat);
    moon.rotation.y = (MOON_TEXTURE.lonOffsetDeg * Math.PI) / 180;
    scene.add(moon);
    loadMoonTexture((tex) => { moonMat.map = tex; moonMat.color.set(0xffffff); moonMat.needsUpdate = true; });

    scene.add(graticule(styles.c.grid));
    scene.add(new THREE.AmbientLight(0xffffff, 0.04));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    scene.add(light);
    const sun = ball(0xffffff, 0.12), earth = ball(styles.c.earth, 0.08), marker = ball(styles.c.site, 0.025);
    const sunMaterial = sun.material as THREE.MeshBasicMaterial;
    const earthMaterial = earth.material as THREE.MeshBasicMaterial;
    sunMaterial.map = createSunTexture();
    sunMaterial.needsUpdate = true;
    let disposed = false;
    loadEarthTexture((texture) => {
      if (disposed) { texture.dispose(); return; }
      earthMaterial.map = texture;
      earthMaterial.color.set(0xffffff);
      earthMaterial.needsUpdate = true;
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.105, 48), new THREE.MeshBasicMaterial({ color: styles.c.ring, side: THREE.DoubleSide }));
    const sunLine = line(styles.c.sun), earthLine = line(styles.c.earth);
    scene.add(sun, earth, marker, ring, sunLine, earthLine);
    o.current = { camera, controls, light, sun, earth, marker, ring, sunLine, earthLine };

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight; camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
    return () => {
      disposed = true;
      sunMaterial.map?.dispose();
      earthMaterial.map?.dispose();
      renderer.setAnimationLoop(null);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
      o.current = null;
    };
  }, []);

  // Fly to the site when it changes (offset keeps the camera off the exact pole axis)
  useEffect(() => {
    const s = o.current; if (!s) return;
    s.camera.position.copy(ll(lat, lon, 3.2)).add(new THREE.Vector3(0.4, 0, 0.4));
    s.controls.update();
  }, [lat, lon]);

  useEffect(() => {
    const s = o.current; if (!s) return;
    const b = bodyFixed(t);
    const sd = toThree(b.sun).normalize(), ed = toThree(b.earth).normalize();
    const p = ll(lat, lon, 1.01);
    s.light.position.copy(sd).multiplyScalar(10);
    s.sun.position.copy(sd).multiplyScalar(5);
    s.earth.position.copy(ed).multiplyScalar(4);
    s.marker.position.copy(p);
    s.ring.position.copy(p);
    s.ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.clone().normalize());
    s.sunLine.geometry.setFromPoints([p, s.sun.position]);
    s.earthLine.geometry.setFromPoints([p, s.earth.position]);
  }, [lat, lon, t]);

  return (
    <div ref={box} className={styles.box}>
      {unavailable
        ? <p className={styles.fallback}>{translate("webglUnavailable")}</p>
        : <p className={styles.hint}>{translate("rotateHint")}</p>}
    </div>
  );
}
