import { nextChange, fmtH, type Sample, type Stats } from "../../sky";

const styles = {
  table: "w-full text-sm",
  head: "text-left text-xs uppercase tracking-wide text-slate-500",
  row: "border-t border-slate-800",
  cell: "py-2 pr-2 text-slate-200",
  label: "py-2 pr-2 text-slate-400",
};

interface Props { data: Sample[]; offset: number; st: Stats }

export default function StatsTable({ data, offset, st }: Props) {
  const cur = data[offset];
  const status = (key: "sunUp" | "earthUp") => {
    const n = nextChange(data, offset, key);
    return `${n.up ? "up, sets" : "down, rises"} in ${n.hours === null ? "more than " + fmtH(n.atLeast) : fmtH(n.hours)}`;
  };
  const rows: [string, string, string][] = [
    ["Elevation", `${cur.sun.el.toFixed(2)}°`, `${cur.earth.el.toFixed(2)}°`],
    ["Azimuth", `${cur.sun.az.toFixed(1)}°`, `${cur.earth.az.toFixed(1)}°`],
    ["Status", status("sunUp"), status("earthUp")],
    ["Up, next 30 d", `${st.sunPct}%`, `${st.earthPct}%`],
    ["Longest gap", fmtH(st.darkH), fmtH(st.noEarthH)],
    ["Peak Sun elevation", `${st.maxSun.toFixed(1)}°`, ""],
  ];
  return (
    <table className={styles.table}>
      <thead><tr className={styles.head}><th></th><th>Sun</th><th>Earth</th></tr></thead>
      <tbody>
        {rows.map(([l, a, b]) => (
          <tr key={l} className={styles.row}><td className={styles.label}>{l}</td><td className={styles.cell}>{a}</td><td className={styles.cell}>{b}</td></tr>
        ))}
      </tbody>
    </table>
  );
}
