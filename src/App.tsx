import { useEffect, useState } from "react";
import { loadSites, type Site } from "./data";
import Planner from "./pages/Planner";

const styles = {
  message: "min-h-screen bg-slate-950 p-6 text-slate-300",
  error: "min-h-screen bg-slate-950 p-6 text-rose-400",
};

export default function App() {
  const [sites, setSites] = useState<Site[] | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => { loadSites().then(setSites).catch((e) => setErr(String(e))); }, []);
  if (err) return <p className={styles.error}>Could not load site data: {err}</p>;
  if (!sites?.length) return <p className={styles.message}>Loading site data…</p>;
  return <Planner sites={sites} />;
}
