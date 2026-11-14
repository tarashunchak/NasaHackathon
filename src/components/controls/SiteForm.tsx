import type { Site } from "../../data";
import type { Scenario } from "../../types";
import { CUSTOM } from "../../constants";
import { fromSite } from "../../utils";

const styles = {
  grid: "grid grid-cols-2 gap-3 text-xs font-medium text-slate-400",
  full: "col-span-2",
  input: "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-amber-400 disabled:opacity-40",
};

interface Props { sites: Site[]; s: Scenario; set: (s: Scenario) => void; hasMask: boolean }

export default function SiteForm({ sites, s, set, hasMask }: Props) {
  const pick = (id: string) => {
    const x = sites.find((q) => q.id === id);
    set(x ? fromSite(x, s.base) : { ...s, site: CUSTOM });
  };
  const num = (k: "lat" | "lon" | "flat", v: string) =>
    set({ ...s, [k]: Number(v), ...(k === "flat" ? {} : { site: CUSTOM }) });

  return (
    <div className={styles.grid}>
      <label className={styles.full}>Site
        <select className={styles.input} value={s.site} onChange={(e) => pick(e.target.value)}>
          {sites.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          <option value={CUSTOM}>Custom coordinates</option>
        </select>
      </label>
      <label>Latitude (°)
        <input type="number" step="0.001" className={styles.input} value={s.lat} onChange={(e) => num("lat", e.target.value)} />
      </label>
      <label>Longitude (°E)
        <input type="number" step="0.001" className={styles.input} value={s.lon} onChange={(e) => num("lon", e.target.value)} />
      </label>
      <label>Start date (UTC)
        <input type="datetime-local" className={styles.input} value={s.base} onChange={(e) => set({ ...s, base: e.target.value })} />
      </label>
      <label>Flat horizon (°)
        <input type="number" step="0.5" min="0" max="30" className={styles.input} value={s.flat} disabled={hasMask} onChange={(e) => num("flat", e.target.value)} />
      </label>
    </div>
  );
}
