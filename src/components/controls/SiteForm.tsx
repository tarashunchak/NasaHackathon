import { memo } from "react";
import type { Site } from "../../data";
import type { Scenario } from "../../types";
import { CUSTOM } from "../../constants";
import { fromSite } from "../../utils";
import { useLocale } from "../../i18n";
import HorizonUpload from "./HorizonUpload";

const styles = {
  grid: "grid grid-cols-2 gap-3 text-xs font-medium text-[var(--muted)]",
  full: "col-span-2",
  input: "mt-1 w-full rounded-sm border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--signal)] disabled:opacity-50",
};

interface Props { sites: Site[]; s: Scenario; set: (s: Scenario) => void; hasMask: boolean }

function SiteForm({ sites, s, set, hasMask }: Props) {
  const { locale, t } = useLocale();
  const pick = (id: string) => {
    const x = sites.find((q) => q.id === id);
    set(x ? fromSite(x, s.base) : { ...s, site: CUSTOM });
  };
  const num = (k: "lat" | "lon" | "flat", v: string) =>
    set({ ...s, [k]: Number(v), ...(k === "flat" ? {} : { site: CUSTOM }) });

  return (
    <div className={styles.grid}>
      <label className={styles.full}>{t("site")}
        <select className={styles.input} value={s.site} onChange={(e) => pick(e.target.value)}>
          {sites.map((x) => <option key={x.id} value={x.id}>{locale === "uk" ? x.nameUk ?? x.name : x.name}</option>)}
          <option value={CUSTOM}>{t("customCoordinates")}</option>
        </select>
      </label>
      <label>{t("latitude")}
        <input type="number" step="0.001" className={`${styles.input} font-mono tabular-nums`} value={s.lat} onChange={(e) => num("lat", e.target.value)} />
      </label>
      <label>{t("longitude")}
        <input type="number" step="0.001" className={`${styles.input} font-mono tabular-nums`} value={s.lon} onChange={(e) => num("lon", e.target.value)} />
      </label>
      <label>{t("startDate")}
        <input type="datetime-local" className={styles.input} value={s.base} onChange={(e) => set({ ...s, base: e.target.value })} />
      </label>
      <label>{t("flatHorizon")}
        <input type="number" step="0.5" min="0" max="30" className={`${styles.input} font-mono tabular-nums`} value={s.flat} disabled={hasMask} onChange={(e) => num("flat", e.target.value)} />
      </label>
      {s.site === CUSTOM && <HorizonUpload values={s.horizon} onChange={(horizon) => set({ ...s, horizon })} />}
    </div>
  );
}

export default memo(SiteForm);
