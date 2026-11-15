import { memo } from "react";
import type { MissionProfile as MissionProfileValue } from "../../lib/mission";
import { useLocale } from "../../i18n";

const styles = {
  root: "border-y border-[var(--line)] bg-[var(--surface)] px-4 py-3",
  heading: "text-sm font-semibold text-[var(--ink)]",
  note: "mt-1 text-xs text-[var(--muted)]",
  fields: "mt-4 grid gap-3 sm:grid-cols-3",
  label: "min-w-0 break-words text-xs font-medium text-[var(--muted)]",
  input: "mt-1 w-full rounded-sm border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2 font-mono tabular-nums text-sm text-[var(--ink)] outline-none focus:border-[var(--signal)]",
};

interface Props {
  profile: MissionProfileValue;
  onChange: (profile: MissionProfileValue) => void;
}

function MissionProfile({ profile, onChange }: Props) {
  const { t } = useLocale();
  const update = (key: keyof MissionProfileValue, value: string) => onChange({ ...profile, [key]: Number(value) });

  return (
    <section className={styles.root} aria-labelledby="mission-profile-title">
      <h2 id="mission-profile-title" className={styles.heading}>{t("missionProfileTitle")}</h2>
      <p className={styles.note}>{t("missionProfileNote")}</p>
      <div className={styles.fields}>
        <label className={styles.label}>{t("minSunElevation")}
          <input className={styles.input} type="number" min="-10" max="90" step="1" value={profile.minSunElevation} onChange={(event) => update("minSunElevation", event.target.value)} />
        </label>
        <label className={styles.label}>{t("minPoweredHours")}
          <input className={styles.input} type="number" min="0" max="720" step="1" value={profile.minPoweredHours} onChange={(event) => update("minPoweredHours", event.target.value)} />
        </label>
        <label className={styles.label}>{t("maxEarthGap")}
          <input className={styles.input} type="number" min="0" max="720" step="1" value={profile.maxEarthGapHours} onChange={(event) => update("maxEarthGapHours", event.target.value)} />
        </label>
      </div>
    </section>
  );
}

export default memo(MissionProfile);