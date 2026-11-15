import { memo } from "react";
import type { Stats } from "../../sky";
import { useLocale } from "../../i18n";

const styles = {
  root: "border-t-2 border-t-[var(--signal)] bg-[var(--surface)] px-4 py-4 font-mono",
  title: "mb-3 text-base font-semibold text-[var(--ink)]",
  table: "w-full table-fixed text-sm",
  head: "text-left text-xs uppercase text-[var(--muted)]",
  row: "border-t border-[var(--line)]",
  cell: "break-words py-2 text-[var(--ink)]",
  value: "whitespace-nowrap py-2 font-mono tabular-nums text-[11px] text-[var(--ink)]",
  good: "text-[var(--green)]",
  bad: "text-[var(--signal)]",
  note: "mt-3 text-xs text-[var(--muted)]",
};

interface Props { a: Stats | null; b: Stats | null }

function Compare({ a, b }: Props) {
  const { locale, t } = useLocale();
  if (!a || !b) return null;
  const hourUnit = locale === "uk" ? " год" : " h";
  const rows = [
    { label: t("sunUp"), va: a.sunPct, vb: b.sunPct, unit: "%", high: true },
    { label: t("earthUp"), va: a.earthPct, vb: b.earthPct, unit: "%", high: true },
    { label: t("bothUp"), va: a.bothPct, vb: b.bothPct, unit: "%", high: true },
    { label: t("longestSunGap"), va: a.darkH, vb: b.darkH, unit: hourUnit, high: false },
    { label: t("longestEarthGap"), va: a.noEarthH, vb: b.noEarthH, unit: hourUnit, high: false },
    { label: t("peakSunElevation"), va: +a.maxSun.toFixed(1), vb: +b.maxSun.toFixed(1), unit: "°", high: true },
  ];
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{t("comparisonTitle")}</h2>
      <table className={styles.table}>
        <colgroup><col className="w-[48%]" /><col className="w-[17%]" /><col className="w-[17%]" /><col className="w-[18%]" /></colgroup>
        <thead><tr className={styles.head}><th>{t("metric")}</th><th>A</th><th>B</th><th>B − A</th></tr></thead>
        <tbody>
          {rows.map((r) => {
            const d = +(r.vb - r.va).toFixed(1);
            const cls = d === 0 ? "" : (d > 0) === r.high ? styles.good : styles.bad;
            return (
              <tr key={r.label} className={styles.row}>
                <td className={styles.cell}>{r.label}</td><td className={styles.value}>{r.va}{r.unit}</td>
                <td className={styles.value}>{r.vb}{r.unit}</td><td className={`${styles.value} ${cls}`}>{d > 0 ? "+" : ""}{d}{r.unit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className={styles.note}>{t("betterNote")}</p>
    </section>
  );
}

export default memo(Compare);
