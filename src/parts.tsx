import { horizonAt, type Sample, type Stats } from "./sky";

export function SkyView({ cur, flat, prof }: { cur: Sample; flat: number; prof?: number[] }) {
  const W = 360, Ht = 130, top = 40, bot = -15;
  const y = (el: number) => ((top - Math.max(bot, Math.min(top, el))) / (top - bot)) * Ht;
  const pts = Array.from({ length: 37 }, (_, i) => `${i * 10},${y(horizonAt(i * 10, flat, prof))}`).join(" ");
  const dot = (az: number, el: number, up: boolean, c: string, label: string, r: number) => (
    <g opacity={up ? 1 : 0.4}>
      <circle cx={az} cy={y(el)} r={r} fill={c} stroke="#44403c" strokeWidth="0.5" />
      <text x={Math.min(az + r + 3, W - 30)} y={y(el) + 3} fontSize="9" fill="#e7e5e4">{label}</text>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${Ht}`} className="w-full border border-stone-300 bg-stone-900">
      <polygon points={`0,${Ht} ${pts} ${W},${Ht}`} fill="#57534e" stroke="#d6d3d1" strokeWidth="0.7" />
      {[0, 90, 180, 270].map((a, i) => <text key={a} x={a + 3} y={Ht - 4} fontSize="9" fill="#e7e5e4">{"NESW"[i]}</text>)}
      {dot(cur.sun.az, cur.sun.el, cur.sunUp, "#fbbf24", "Sun", 6)}
      {dot(cur.earth.az, cur.earth.el, cur.earthUp, "#60a5fa", "Earth", 4)}
    </svg>
  );
}

export function Timeline({ data, offset, setOffset }: { data: Sample[]; offset: number; setOffset: (n: number) => void }) {
  const W = 600, Ht = 110;
  const all = data.flatMap((p) => [p.sun.el, p.earth.el]);
  const lo = Math.min(...all, 0) - 2, hi = Math.max(...all, 0) + 2;
  const x = (i: number) => (i / (data.length - 1)) * W;
  const y = (v: number) => Ht - ((v - lo) / (hi - lo)) * Ht;
  const line = (k: "sun" | "earth") => data.map((p, i) => `${x(i).toFixed(1)},${y(p[k].el).toFixed(1)}`).join(" ");
  return (
    <div>
      <p className="text-xs text-stone-500 mb-1">Elevation over 30 days. Click to jump.</p>
      <svg viewBox={`0 0 ${W} ${Ht}`} className="w-full border border-stone-300 cursor-pointer"
        onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setOffset(Math.round(((e.clientX - r.left) / r.width) * (data.length - 1))); }}>
        <line x1="0" x2={W} y1={y(0)} y2={y(0)} stroke="#a8a29e" strokeDasharray="3 3" />
        <polyline points={line("sun")} fill="none" stroke="#d97706" strokeWidth="1.2" />
        <polyline points={line("earth")} fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1={x(offset)} x2={x(offset)} y1="0" y2={Ht} stroke="#44403c" />
      </svg>
      <p className="text-xs mt-1"><span className="text-amber-600">Sun</span> · <span className="text-blue-600">Earth</span> · dashed = 0°</p>
    </div>
  );
}

export function Compare({ a, b }: { a: Stats | null; b: Stats | null }) {
  if (!a || !b) return null;
  const rows: { label: string; va: number; vb: number; unit: string; better: "high" | "low" }[] = [
    { label: "Sun up", va: a.sunPct, vb: b.sunPct, unit: "%", better: "high" },
    { label: "Earth up", va: a.earthPct, vb: b.earthPct, unit: "%", better: "high" },
    { label: "Sun and Earth together", va: a.bothPct, vb: b.bothPct, unit: "%", better: "high" },
    { label: "Longest Sun gap", va: a.darkH, vb: b.darkH, unit: " h", better: "low" },
    { label: "Longest Earth gap", va: a.noEarthH, vb: b.noEarthH, unit: " h", better: "low" },
    { label: "Peak Sun elevation", va: +a.maxSun.toFixed(1), vb: +b.maxSun.toFixed(1), unit: "°", better: "high" },
  ];
  return (
    <section className="border border-stone-300 bg-white p-4">
      <h2 className="font-semibold mb-2">A vs B (30-day window)</h2>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-stone-500"><th>Metric</th><th>A</th><th>B</th><th>B − A</th></tr></thead>
        <tbody className="[&_td]:py-1 [&_tr]:border-t [&_tr]:border-stone-200">
          {rows.map((r) => {
            const d = +(r.vb - r.va).toFixed(1);
            const good = d === 0 ? "" : (d > 0) === (r.better === "high") ? "text-green-700" : "text-red-700";
            return (
              <tr key={r.label}>
                <td>{r.label}</td><td>{r.va}{r.unit}</td><td>{r.vb}{r.unit}</td>
                <td className={good}>{d > 0 ? "+" : ""}{d}{r.unit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-stone-500 mt-2">Green = B is better for power or comms, red = worse.</p>
    </section>
  );
}

export function Explain() {
  return (
    <div className="px-6 py-4 bg-stone-100 border-b border-stone-300 text-sm max-w-4xl space-y-2">
      <p><b>Why the poles are hard.</b> The Moon's axis is tilted only about 1.5°, so near the south pole the Sun circles the horizon and never climbs higher than a few degrees. Hills and crater rims decide whether a spot gets light, so moving a few kilometers or a few days can flip it from sunlit to dark.</p>
      <p><b>Power.</b> Solar panels need the Sun above the local horizon. A low Sun gives weak power and long shadows. No atmosphere means no twilight: sunset is abrupt.</p>
      <p><b>Communication.</b> Direct-to-Earth links need Earth above the horizon. From the pole Earth hugs the horizon and swings with libration (the Moon's wobble), so Earth comes and goes over each month.</p>
      <p><b>Reading the tool.</b> The dark band under the sky is terrain. A body is "up" when it is above that band. "Longest gap" is the longest stretch with no Sun or no Earth in the 30-day window.</p>
    </div>
  );
}
