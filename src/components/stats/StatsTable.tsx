import { nextChange, fmtH, type Sample, type Stats } from "../../sky";
import { useLocale } from "../../i18n";

const styles = {
  table: "w-full table-fixed font-mono text-sm",
  head: "text-left text-xs uppercase text-[var(--muted)]",
  row: "border-t border-[var(--line)]",
  cell: "py-2 pr-2 font-mono tabular-nums text-xs text-[var(--ink)]",
  value: "whitespace-nowrap py-2 pr-2 font-mono tabular-nums text-xs text-[var(--ink)]",
  label: "break-words py-2 pr-2 text-xs text-[var(--muted)]",
};

interface Props { data: Sample[]; offset: number; st: Stats }

export default function StatsTable({ data, offset, st }: Props) {
  const { locale, t } = useLocale();
  const cur = data[offset];
  const status = (key: "sunUp" | "earthUp") => {
    const n = nextChange(data, offset, key);
    const event = n.up ? `${t("aboveHorizon")}; ${t("sets")}` : `${t("belowHorizon")}; ${t("rises")}`;
    const time = n.hours === null ? `${t("moreThan")} ${fmtH(n.atLeast, locale)}` : `${t("in")} ${fmtH(n.hours, locale)}`;
    return `${event} ${time}`;
  };
  const rows: [string, string, string][] = [
    [t("elevation"), `${cur.sun.el.toFixed(2)}°`, `${cur.earth.el.toFixed(2)}°`],
    [t("azimuth"), `${cur.sun.az.toFixed(1)}°`, `${cur.earth.az.toFixed(1)}°`],
    [t("status"), status("sunUp"), status("earthUp")],
    [t("next30Days"), `${st.sunPct}%`, `${st.earthPct}%`],
    [t("longestGap"), fmtH(st.darkH, locale), fmtH(st.noEarthH, locale)],
    [t("peakSunElevation"), `${st.maxSun.toFixed(1)}°`, ""],
  ];
  return (
    <table className={styles.table}>
      <colgroup><col className="w-[42%]" /><col className="w-[29%]" /><col className="w-[29%]" /></colgroup>
      <thead><tr className={styles.head}><th></th><th>{t("sun")}</th><th>{t("earth")}</th></tr></thead>
      <tbody>
        {rows.map(([l, a, b]) => (
          <tr key={l} className={styles.row}>
            <td className={styles.label}>{l}</td>
            <td className={l === t("status") ? styles.cell : styles.value}>{a}</td>
            <td className={l === t("status") ? styles.cell : styles.value}>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
