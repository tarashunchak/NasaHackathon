import { useCallback, useDeferredValue, useEffect, useState } from "react";
import type { Site } from "../data";
import { HOURS } from "../constants";
import { CUSTOM } from "../constants";
import { fromSite, tomorrow } from "../utils";
import { useMask } from "../hooks/useMask";
import { useScenarioData } from "../hooks/useScenarioData";
import Header from "../components/layout/Header";
import Explain from "../components/layout/Explain";
import TimeControl, { type PlaybackSpeed } from "../components/controls/TimeControl";
import Panel from "../components/scenario/Panel";
import Compare from "../components/stats/Compare";
import { useLocale } from "../i18n";
import MissionProfile from "../components/planning/MissionProfile";
import { DEFAULT_MISSION_PROFILE, type MissionProfile as MissionProfileValue } from "../lib/mission";
import { readSharedState } from "../lib/share";
import ShareExport from "../components/planning/ShareExport";

const styles = {
  root: "min-h-screen bg-transparent text-[var(--ink)]",
  main: "mx-auto w-full max-w-[1480px] space-y-5 px-4 pt-5 pb-28 md:px-8 md:pt-7 md:pb-24",
  grid: "grid gap-4 xl:grid-cols-2",
};

export default function Planner({ sites }: { sites: Site[] }) {
  const { t } = useLocale();
  const [shared] = useState(() => readSharedState(sites));
  const [a, setA] = useState(() => shared?.a ?? fromSite(sites[0], tomorrow()));
  const [b, setB] = useState(() => shared?.b ?? fromSite(sites[Math.min(1, sites.length - 1)], tomorrow()));
  const [offset, setOffset] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [explain, setExplain] = useState(false);
  const [profile, setProfile] = useState<MissionProfileValue>(shared?.profile ?? DEFAULT_MISSION_PROFILE);
  const displayOffset = useDeferredValue(offset);
  const loadedMaskA = useMask(a.site), loadedMaskB = useMask(b.site);
  const ma = a.site === CUSTOM ? a.horizon ?? null : loadedMaskA;
  const mb = b.site === CUSTOM ? b.horizon ?? null : loadedMaskB;
  const ra = useScenarioData(a, ma), rb = useScenarioData(b, mb);
  const togglePlaying = useCallback(() => setPlaying((value) => !value), []);
  const toggleExplain = useCallback(() => setExplain((value) => !value), []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setOffset((o) => (o >= HOURS ? 0 : o + 2)), 70 / speed);
    return () => clearInterval(id);
  }, [playing, speed]);

  return (
    <div className={styles.root}>
      <Header explain={explain} onToggle={toggleExplain} />
      {explain && <Explain />}
      <main className={styles.main}>
        <TimeControl offset={offset} max={HOURS} playing={playing} speed={speed} onPlay={togglePlaying} onSpeedChange={setSpeed} onChange={setOffset} />
        <MissionProfile profile={profile} onChange={setProfile} />
        <div className={styles.grid}>
          <Panel title={t("scenarioA")} sites={sites} s={a} set={setA} r={ra} mask={ma} offset={displayOffset} setOffset={setOffset} profile={profile} />
          <Panel title={t("scenarioB")} sites={sites} s={b} set={setB} r={rb} mask={mb} offset={displayOffset} setOffset={setOffset} profile={profile} />
        </div>
        <Compare a={ra.st} b={rb.st} />
        <ShareExport sites={sites} scenarioA={a} scenarioB={b} dataA={ra.data} dataB={rb.data} profile={profile} />
      </main>
    </div>
  );
}
