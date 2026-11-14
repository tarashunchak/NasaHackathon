import { useEffect, useState } from "react";
import type { Site } from "../data";
import { HOURS } from "../constants";
import { fromSite, tomorrow } from "../utils";
import { useMask } from "../hooks/useMask";
import { useScenarioData } from "../hooks/useScenarioData";
import Header from "./Header";
import Explain from "./Explain";
import TimeControl from "./TimeControl";
import Panel from "./Panel";
import Compare from "./Compare";

const styles = {
  root: "min-h-screen bg-slate-950 text-slate-200",
  main: "mx-auto max-w-7xl space-y-6 px-6 py-6",
  grid: "grid gap-6 lg:grid-cols-2",
};

export default function Planner({ sites }: { sites: Site[] }) {
  const [a, setA] = useState(fromSite(sites[0], tomorrow()));
  const [b, setB] = useState(fromSite(sites[Math.min(1, sites.length - 1)], tomorrow()));
  const [offset, setOffset] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [explain, setExplain] = useState(false);
  const ma = useMask(a.site), mb = useMask(b.site);
  const ra = useScenarioData(a, ma), rb = useScenarioData(b, mb);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setOffset((o) => (o >= HOURS ? 0 : o + 2)), 70);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className={styles.root}>
      <Header explain={explain} onToggle={() => setExplain(!explain)} />
      {explain && <Explain />}
      <main className={styles.main}>
        <TimeControl offset={offset} max={HOURS} playing={playing} onPlay={() => setPlaying(!playing)} onChange={setOffset} />
        <div className={styles.grid}>
          <Panel title="Scenario A" sites={sites} s={a} set={setA} r={ra} mask={ma} offset={offset} setOffset={setOffset} />
          <Panel title="Scenario B" sites={sites} s={b} set={setB} r={rb} mask={mb} offset={offset} setOffset={setOffset} />
        </div>
        <Compare a={ra.st} b={rb.st} />
      </main>
    </div>
  );
}
