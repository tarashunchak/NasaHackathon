import { horizonAt, type Sample } from "../sky";

const styles = {
  svg: "w-full overflow-hidden rounded-xl border border-slate-800",
  c: { sky: "#020617", ground: "#1e293b", edge: "#64748b", text: "#94a3b8", sun: "#fbbf24", earth: "#38bdf8", stroke: "#0f172a" },
};

interface Props { cur: Sample; flat: number; prof?: number[] }

export default function SkyView({ cur, flat, prof }: Props) {
  const W = 360, Ht = 130, top = 40, bot = -15, c = styles.c;
  const y = (el: number) => ((top - Math.max(bot, Math.min(top, el))) / (top - bot)) * Ht;
  const pts = Array.from({ length: 37 }, (_, i) => `${i * 10},${y(horizonAt(i * 10, flat, prof))}`).join(" ");
  const dot = (az: number, el: number, up: boolean, color: string, label: string, r: number) => (
    <g opacity={up ? 1 : 0.35}>
      <circle cx={az} cy={y(el)} r={r} fill={color} stroke={c.stroke} strokeWidth="0.5" />
      <text x={Math.min(az + r + 3, W - 30)} y={y(el) + 3} fontSize="9" fill={c.text}>{label}</text>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${Ht}`} className={styles.svg}>
      <rect width={W} height={Ht} fill={c.sky} />
      <polygon points={`0,${Ht} ${pts} ${W},${Ht}`} fill={c.ground} stroke={c.edge} strokeWidth="0.7" />
      {[0, 90, 180, 270].map((a, i) => <text key={a} x={a + 3} y={Ht - 4} fontSize="9" fill={c.text}>{"NESW"[i]}</text>)}
      {dot(cur.sun.az, cur.sun.el, cur.sunUp, c.sun, "Sun", 6)}
      {dot(cur.earth.az, cur.earth.el, cur.earthUp, c.earth, "Earth", 4)}
    </svg>
  );
}
