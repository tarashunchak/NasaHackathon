import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { bodyFixed } from "../../sky";
import { MOON_TEXTURE, ball, graticule, line, ll, loadMoonTexture, toThree } from "../../lib/moon3d";

const styles = {
  box: "relative h-80 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950",
  hint: "pointer-events-none absolute bottom-2 left-3 text-xs text-slate-500",
  c: { moon: 0x9ca3af, grid: 0x94a3b8, sun: 0xfbbf24, earth: 0x38bdf8, site: 0xf43f5e, ring: 0xe2e8f0 },
};

interface Props { lat: number; lon: number; t: number }
interface Scene3D {
  camera: THREE.PerspectiveCamera; controls: OrbitControls; light: THREE.DirectionalLight;
  sun: THREE.Mesh; earth: THREE.Mesh; marker: THREE.Mesh; ring: THREE.Mesh; sunLine: THREE.Line; earthLine: THREE.Line;
}

export default function MoonView3D({ lat, lon, t }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const o = useRef<Scene3D | null>(null);

  useEffect(() => {
    const el = box.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
    const sun = ball(styles.c.sun, 0.12), earth = ball(styles.c.earth, 0.08), marker = ball(styles.c.site, 0.025);
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
    return () => { renderer.setAnimationLoop(null); ro.disconnect(); controls.dispose(); renderer.dispose(); el.removeChild(renderer.domElement); o.current = null; };
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
    s.sunLine.geometry.setFromPoints([p, p.clone().add(sd.clone().multiplyScalar(2))]);
    s.earthLine.geometry.setFromPoints([p, p.clone().add(ed.clone().multiplyScalar(2))]);
  }, [lat, lon, t]);

  return (
    <div ref={box} className={styles.box}>
      <p className={styles.hint}>Drag to rotate, scroll to zoom. Red dot: site. Ring: local horizon. Sun and Earth not to scale.</p>
    </div>
  );
}
