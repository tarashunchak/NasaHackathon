import { useEffect, useState } from "react";
import { loadSites, type Site } from "./data";
import Planner from "./pages/Planner";
import { useLocale } from "./i18n";

const styles = {
  message: "min-h-screen bg-[var(--canvas)] p-6 font-mono text-sm text-[var(--muted)]",
  error: "min-h-screen bg-[var(--canvas)] p-6 font-mono text-sm text-[var(--signal)]",
};

export default function App() {
  const { t } = useLocale();
  const [sites, setSites] = useState<Site[] | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => { loadSites().then(setSites).catch((e) => setErr(String(e))); }, []);
  if (err) return <p className={styles.error}>{t("loadSitesError")}{err}</p>;
  if (!sites?.length) return <p className={styles.message}>{t("loadingSites")}</p>;
  return <Planner sites={sites} />;
}
