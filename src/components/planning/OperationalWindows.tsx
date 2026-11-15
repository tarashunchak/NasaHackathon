import { memo, useMemo } from "react";
import type { Sample } from "../../sky";
import { getVisibilityWindows, missionPeriod, type MissionProfile, type VisibilityWindow } from "../../lib/mission";
import { useLocale } from "../../i18n";

const styles = {
  root: "border-t border-[var(--line)] pt-3",
  heading: "text-sm font-semibold text-[var(--ink)]",
  groups: "mt-3 grid gap-3 md:grid-cols-3",
  group: "min-w-0 border-l border-[var(--line-strong)] pl-3",
  label: "text-xs font-semibold text-[var(--green-strong)]",
  list: "mt-2 space-y-2",
  window: "text-xs text-[var(--muted)]",
  time: "break-words font-mono tabular-nums text-[var(--ink)]",
  duration: "whitespace-nowrap font-mono tabular-nums text-[var(--muted)]",
  empty: "mt-2 text-xs text-[var(--muted)]",
  note: "mt-3 text-xs text-[var(--muted)]",
};

interface Props {
  data: Sample[];
  offset: number;
  profile: MissionProfile;
}

function OperationalWindows({ data, offset, profile }: Props) {
  const { locale, t } = useLocale();
  const periods = useMemo(() => {
    const samples = missionPeriod(data);
    const powered = (sample: Sample) => sample.sunUp && sample.sun.el >= profile.minSunElevation;
    return [
      { key: "solarWindows", windows: getVisibilityWindows(samples, powered) },
      { key: "contactWindows", windows: getVisibilityWindows(samples, (sample) => sample.earthUp) },
      { key: "jointWindows", windows: getVisibilityWindows(samples, (sample) => powered(sample) && sample.earthUp) },
    ] as const;
  }, [data, profile.minSunElevation]);
  const now = data[Math.min(offset, data.length - 1)]?.t ?? 0;
  const dateTime = useMemo(() => new Intl.DateTimeFormat(locale === "uk" ? "uk-UA" : "en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "UTC",
  }), [locale]);
  const number = useMemo(() => new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-US", { maximumFractionDigits: 1 }), [locale]);
  const upcomingPeriods = useMemo(
    () => periods.map((period) => ({ ...period, upcoming: period.windows.filter((window) => window.end > now).slice(0, 3) })),
    [periods, now],
  );

  const formatWindow = (window: VisibilityWindow) => {
    const active = window.start <= now && window.end > now;
    const start = active ? t("activeNow") : dateTime.format(new Date(window.start));
    const end = window.continues ? t("periodContinues") : dateTime.format(new Date(window.end));
    return <p className={styles.window}><span className={styles.time}>{start} – {end}</span><br /><span className={styles.duration}>{number.format(window.hours)} {t("hourUnit")}</span></p>;
  };

  return (
    <section className={styles.root} aria-labelledby="operational-windows-title">
      <h3 id="operational-windows-title" className={styles.heading}>{t("operationalWindows")}</h3>
      <div className={styles.groups}>
        {upcomingPeriods.map(({ key, upcoming }) => {
          return (
            <div key={key} className={styles.group}>
              <h4 className={styles.label}>{t(key)}</h4>
              {upcoming.length ? <div className={styles.list}>{upcoming.map((window) => <div key={window.start}>{formatWindow(window)}</div>)}</div> : <p className={styles.empty}>{t("noWindows")}</p>}
            </div>
          );
        })}
      </div>
      <p className={styles.note}>{t("resolutionNote")}</p>
    </section>
  );
}

export default memo(OperationalWindows);