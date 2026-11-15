import { memo, useMemo, useState } from "react";
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
import { useLocale } from "../../i18n";
import type { MissionProfile } from "../../lib/mission";
import MissionAssessment from "../planning/ScenarioAssessment";
import OperationalWindows from "../planning/OperationalWindows";

const styles = {
  root: "min-w-0 space-y-4 rounded-sm border border-[var(--line)] border-t-2 border-t-[var(--green)] bg-[var(--surface)] p-4 shadow-[0_8px_24px_rgba(27,48,38,0.045)] md:p-5",
  head: "flex items-center justify-between",
  title: "text-base font-semibold text-[var(--ink)]",
  tabs: "flex gap-1 border-b border-[var(--line)] text-xs",
  tab: "border-b-2 border-transparent px-2 py-1.5 text-[var(--muted)] transition hover:text-[var(--ink)]",
  tabOn: "border-b-2 border-[var(--signal)] px-2 py-1.5 font-semibold text-[var(--green-strong)]",
  now: "font-mono text-xs text-[var(--muted)]",
  error: "text-sm text-[var(--signal)]",
};

interface Props {
  title: string; sites: Site[]; s: Scenario; set: (s: Scenario) => void;
  r: ScenarioData; mask: number[] | null; offset: number; setOffset: (n: number) => void; profile: MissionProfile;
}

function Panel({ title, sites, s, set, r, mask, offset, setOffset, profile }: Props) {
  const { locale, t } = useLocale();
  const [view, setView] = useState<"sky" | "moon">("sky");
  const cur = r.data[offset];
  const selectedSite = useMemo(() => sites.find((site) => site.id === s.site), [sites, s.site]);
  const timelineData = useMemo(() => r.data.slice(0, HOURS + 1), [r.data]);
  return (
    <section className={styles.root}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.tabs}>
          {(["sky", "moon"] as const).map((v) => (
            <button key={v} className={view === v ? styles.tabOn : styles.tab} onClick={() => setView(v)}>
              {v === "sky" ? t("sky2d") : t("moon3d")}
            </button>
          ))}
        </div>
      </div>
      <SiteForm sites={sites} s={s} set={set} hasMask={!!mask} />
      <SourceNote site={selectedSite} mask={mask} />
      {r.pending && <p className={styles.now} role="status">{t("calculating")}</p>}
      {!r.pending && (!cur || !r.st) ? <p className={styles.error}>{t("invalidDate")}</p> : cur && r.st && (
        <>
          <p className={styles.now}>{t("now")}: {iso(cur.t, locale)}</p>
          <SkyView cur={cur} flat={s.flat} prof={mask ?? undefined} />
          {view === "moon" && <MoonView3D lat={s.lat} lon={s.lon} t={cur.t} />}
          <StatsTable data={r.data} offset={offset} st={r.st} />
          <MissionAssessment data={r.data} profile={profile} />
          <Timeline data={timelineData} offset={offset} setOffset={setOffset} />
          <OperationalWindows data={r.data} offset={offset} profile={profile} />
        </>
      )}
    </section>
  );
}

export default memo(Panel);
