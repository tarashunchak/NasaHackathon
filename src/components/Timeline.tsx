import type { Sample } from "../sky";

const styles = {
  caption: "mb-1 text-xs text-slate-500",
  svg: "w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950",
  legend: "mt-1 flex gap-4 text-xs text-slate-400",
  sun: "text-amber-400",
  earth: "text-sky-400",
  c: { zero: "#475569", sun: "#fbbf24", earth: "#38bdf8", cursor: "#e2e8f0" },
};

interface Props { data: Sample[]; offset: number; setOffset: (n: number) => void }

export default function Timeline({ data, offset, setOffset }: Props) {
  const W = 600, Ht = 110, c = styles.c;
  const all = data.flatMap((p) => [p.sun.el, p.earth.el]);
  const lo = Math.min(...all, 0) - 2, hi = Math.max(...all, 0) + 2;
  const x = (i: number) => (i / (data.length - 1)) * W;
  const y = (v: number) => Ht - ((v - lo) / (hi - lo)) * Ht;
  const line = (k: "sun" | "earth") => data.map((p, i) => `${x(i).toFixed(1)},${y(p[k].el).toFixed(1)}`).join(" ");
  return (
    <div>
      <p className={styles.caption}>Elevation over 30 days. Click to jump.</p>
      <svg viewBox={`0 0 ${W} ${Ht}`} className={styles.svg}
        onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setOffset(Math.round(((e.clientX - r.left) / r.width) * (data.length - 1))); }}>
        <line x1="0" x2={W} y1={y(0)} y2={y(0)} stroke={c.zero} strokeDasharray="3 3" />
        <polyline points={line("sun")} fill="none" stroke={c.sun} strokeWidth="1.3" />
        <polyline points={line("earth")} fill="none" stroke={c.earth} strokeWidth="1.3" />
        <line x1={x(offset)} x2={x(offset)} y1="0" y2={Ht} stroke={c.cursor} />
      </svg>
      <div className={styles.legend}><span className={styles.sun}>● Sun</span><span className={styles.earth}>● Earth</span><span>dashed = 0°</span></div>
    </div>
  );
}
