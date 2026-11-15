import { memo, useState } from "react";
import type { Site } from "../../data";
import type { Scenario } from "../../types";
import type { Sample } from "../../sky";
import { useLocale } from "../../i18n";
import { missionPeriod, type MissionProfile } from "../../lib/mission";

const styles = {
  root: "border-t border-[var(--line)] px-1 py-3",
  header: "text-sm font-semibold text-[var(--ink)]",
  actions: "mt-3 flex flex-wrap gap-2",
  button: "rounded-sm border border-[var(--line-strong)] px-3 py-2 text-xs font-medium text-[var(--green-strong)] transition hover:border-[var(--signal)] hover:text-[var(--signal)]",
  link: "mt-3 w-full rounded-sm border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2 font-mono text-xs text-[var(--ink)]",
  status: "mt-2 text-xs text-[var(--green)]",
};

interface Props {
  sites: Site[];
  scenarioA: Scenario;
  scenarioB: Scenario;
  dataA: Sample[];
  dataB: Sample[];
  profile: MissionProfile;
}

function csvCell(value: string | number | boolean) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function ShareExport({ sites, scenarioA, scenarioB, dataA, dataB, profile }: Props) {
  const { locale, t } = useLocale();
  const [shareUrl, setShareUrl] = useState("");
  const [message, setMessage] = useState("");

  const createShareLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("state", JSON.stringify({ a: scenarioA, b: scenarioB, profile }));
    url.searchParams.set("lang", locale);
    const link = url.toString();
    setShareUrl(link);
    setMessage(t("shareLinkReady"));
    try {
      await navigator.clipboard.writeText(link);
      setMessage(t("shareLinkCopied"));
    } catch {
      // The visible link remains available when clipboard access is blocked.
    }
  };

  const exportCsv = () => {
    const headers = [t("csvScenario"), t("csvSite"), t("csvTime"), t("csvSunElevation"), t("csvSunAzimuth"), t("csvSunVisible"), t("csvEarthElevation"), t("csvEarthAzimuth"), t("csvEarthVisible"), t("csvPowerWindow")];
    const rows = [headers.map(csvCell).join(",")];
    const scenarios = [
      { label: t("scenarioA"), scenario: scenarioA, data: dataA },
      { label: t("scenarioB"), scenario: scenarioB, data: dataB },
    ];
    for (const item of scenarios) {
      const site = sites.find((candidate) => candidate.id === item.scenario.site);
      const name = item.scenario.site === "custom" ? t("csvNoSite") : locale === "uk" ? site?.nameUk ?? site?.name ?? item.scenario.site : site?.name ?? item.scenario.site;
      for (const sample of missionPeriod(item.data)) {
        rows.push([
          item.label, name, new Date(sample.t).toISOString(), sample.sun.el.toFixed(2), sample.sun.az.toFixed(1), sample.sunUp,
          sample.earth.el.toFixed(2), sample.earth.az.toFixed(1), sample.earthUp,
          sample.sunUp && sample.sun.el >= profile.minSunElevation,
        ].map(csvCell).join(","));
      }
    }

    const blob = new Blob(["\uFEFF", rows.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `lunar-planner-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  return (
    <section className={styles.root} aria-labelledby="share-export-title">
      <h2 id="share-export-title" className={styles.header}>{t("shareExport")}</h2>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={createShareLink}>{t("copyShareLink")}</button>
        <button type="button" className={styles.button} onClick={exportCsv}>{t("exportCsv")}</button>
      </div>
      {shareUrl && <>
        <p className={styles.status} aria-live="polite">{message}</p>
        <input className={styles.link} aria-label={t("shareLinkLabel")} readOnly value={shareUrl} onFocus={(event) => event.currentTarget.select()} />
      </>}
    </section>
  );
}

export default memo(ShareExport);