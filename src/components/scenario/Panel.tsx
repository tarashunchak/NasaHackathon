import { useState } from "react";
import type { Site } from "../../data";
import type { Scenario } from "../../types";
import type { ScenarioData } from "../../hooks/useScenarioData";
import { HOURS } from "../../constants";
import { iso } from "../../utils";
import SiteForm from "../controls/SiteForm";
import SourceNote from "./SourceNote";
import SkyView from "../views/SkyView";
import MoonView3D from "../views/MoonView3D";
import StatsTable from "../stats/StatsTable";
import Timeline from "../views/Timeline";

const styles = {
  root: "space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5",
  head: "flex items-center justify-between",
  title: "text-base font-semibold text-white",
  tabs: "flex gap-1 rounded-full border border-slate-700 p-0.5 text-xs",
  tab: "rounded-full px-3 py-1 text-slate-400 transition hover:text-white",
  tabOn: "rounded-full bg-slate-700 px-3 py-1 text-white",
  now: "text-xs text-slate-500",
  error: "text-sm text-rose-400",
};

interface Props {
  title: string; sites: Site[]; s: Scenario; set: (s: Scenario) => void;
  r: ScenarioData; mask: number[] | null; offset: number; setOffset: (n: number) => void;
}

export default function Panel({ title, sites, s, set, r, mask, offset, setOffset }: Props) {
  const [view, setView] = useState<"sky" | "moon">("sky");
  const cur = r.data[offset];
  return (
    <section className={styles.root}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.tabs}>
          {(["sky", "moon"] as const).map((v) => (
            <button key={v} className={view === v ? styles.tabOn : styles.tab} onClick={() => setView(v)}>
              {v === "sky" ? "Sky" : "3D Moon"}
            </button>
          ))}
        </div>
      </div>
      <SiteForm sites={sites} s={s} set={set} hasMask={!!mask} />
      <SourceNote site={sites.find((x) => x.id === s.site)} mask={mask} />
      {!cur || !r.st ? <p className={styles.error}>Pick a valid date.</p> : (
        <>
          <p className={styles.now}>Now: {iso(cur.t)}</p>
          {view === "sky"
            ? <SkyView cur={cur} flat={s.flat} prof={mask ?? undefined} />
            : <MoonView3D lat={s.lat} lon={s.lon} t={cur.t} />}
          <StatsTable data={r.data} offset={offset} st={r.st} />
          <Timeline data={r.data.slice(0, HOURS + 1)} offset={offset} setOffset={setOffset} />
        </>
      )}
    </section>
  );
}
