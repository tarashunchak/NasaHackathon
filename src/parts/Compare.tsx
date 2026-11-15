import { memo, useMemo } from "react";
import type { Stats } from "../sky";

const styles = {
  section: "border border-stone-300 bg-white p-4",
  heading: "font-semibold mb-2",
  table: "w-full text-sm",
  head: "text-left text-stone-500",
  body: "[&_td]:py-1 [&_tr]:border-t [&_tr]:border-stone-200",
  note: "text-xs text-stone-500 mt-2",
  better: "text-green-700",
  worse: "text-red-700",
};

interface Props {
  a: Stats | null;
  b: Stats | null;
}

function Compare({ a, b }: Props) {
  const rows = useMemo(() => {
    if (!a || !b) return null;
    return [
      { label: "Sun up", va: a.sunPct, vb: b.sunPct, unit: "%", better: "high" },
      { label: "Earth up", va: a.earthPct, vb: b.earthPct, unit: "%", better: "high" },
      { label: "Sun and Earth together", va: a.bothPct, vb: b.bothPct, unit: "%", better: "high" },
      { label: "Longest Sun gap", va: a.darkH, vb: b.darkH, unit: " h", better: "low" },
      { label: "Longest Earth gap", va: a.noEarthH, vb: b.noEarthH, unit: " h", better: "low" },
      { label: "Peak Sun elevation", va: +a.maxSun.toFixed(1), vb: +b.maxSun.toFixed(1), unit: "°", better: "high" },
    ] as const;
  }, [a, b]);

  if (!rows) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>A vs B (30-day window)</h2>
      <table className={styles.table}>
        <thead><tr className={styles.head}><th>Metric</th><th>A</th><th>B</th><th>B − A</th></tr></thead>
        <tbody className={styles.body}>
          {rows.map((row) => {
            const difference = +(row.vb - row.va).toFixed(1);
            const resultStyle = difference === 0 ? "" : (difference > 0) === (row.better === "high") ? styles.better : styles.worse;
            return (
              <tr key={row.label}>
                <td>{row.label}</td><td>{row.va}{row.unit}</td><td>{row.vb}{row.unit}</td>
                <td className={resultStyle}>{difference > 0 ? "+" : ""}{difference}{row.unit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className={styles.note}>Green = B is better for power or comms, red = worse.</p>
    </section>
  );
}

export default memo(Compare);
