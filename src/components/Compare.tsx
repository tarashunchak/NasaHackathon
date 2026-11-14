import type { Stats } from "../sky";

const styles = {
  root: "rounded-2xl border border-slate-800 bg-slate-900 p-5",
  title: "mb-3 text-base font-semibold text-white",
  table: "w-full text-sm",
  head: "text-left text-xs uppercase tracking-wide text-slate-500",
  row: "border-t border-slate-800",
  cell: "py-2 text-slate-200",
  good: "text-emerald-400",
  bad: "text-rose-400",
  note: "mt-3 text-xs text-slate-500",
};

interface Props { a: Stats | null; b: Stats | null }

export default function Compare({ a, b }: Props) {
  if (!a || !b) return null;
  const rows = [
    { label: "Sun up", va: a.sunPct, vb: b.sunPct, unit: "%", high: true },
    { label: "Earth up", va: a.earthPct, vb: b.earthPct, unit: "%", high: true },
    { label: "Sun and Earth together", va: a.bothPct, vb: b.bothPct, unit: "%", high: true },
    { label: "Longest Sun gap", va: a.darkH, vb: b.darkH, unit: " h", high: false },
    { label: "Longest Earth gap", va: a.noEarthH, vb: b.noEarthH, unit: " h", high: false },
    { label: "Peak Sun elevation", va: +a.maxSun.toFixed(1), vb: +b.maxSun.toFixed(1), unit: "°", high: true },
  ];
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>A vs B, 30-day window</h2>
      <table className={styles.table}>
        <thead><tr className={styles.head}><th>Metric</th><th>A</th><th>B</th><th>B − A</th></tr></thead>
        <tbody>
          {rows.map((r) => {
            const d = +(r.vb - r.va).toFixed(1);
            const cls = d === 0 ? "" : (d > 0) === r.high ? styles.good : styles.bad;
            return (
              <tr key={r.label} className={styles.row}>
                <td className={styles.cell}>{r.label}</td><td className={styles.cell}>{r.va}{r.unit}</td>
                <td className={styles.cell}>{r.vb}{r.unit}</td><td className={`${styles.cell} ${cls}`}>{d > 0 ? "+" : ""}{d}{r.unit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className={styles.note}>Green: B is better for power or comms. Red: worse.</p>
    </section>
  );
}
