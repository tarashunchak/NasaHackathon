import { memo, useMemo } from "react";
import type { Sample } from "../../sky";
import { assessMission, type MissionProfile } from "../../lib/mission";
import { useLocale } from "../../i18n";

const styles = {
  root: "border-l-2 border-[var(--line-strong)] pl-3 font-mono",
  pass: "text-xs font-semibold uppercase text-[var(--green)]",
  review: "text-xs font-semibold uppercase text-[var(--signal)]",
  results: "mt-2 grid gap-2 text-xs sm:grid-cols-2",
  label: "text-[var(--muted)]",
  value: "mt-0.5 font-mono tabular-nums text-[var(--ink)]",
  statusPass: "text-[var(--green)]",
  statusMiss: "text-[var(--signal)]",
};

interface Props {
  data: Sample[];
  profile: MissionProfile;
}

function ScenarioAssessment({ data, profile }: Props) {
  const { locale, t } = useLocale();
  const assessment = useMemo(() => assessMission(data, profile), [data, profile]);
  const number = useMemo(() => new Intl.NumberFormat(locale === "uk" ? "uk-UA" : "en-US", { maximumFractionDigits: 1 }), [locale]);
  const unit = t("hourUnit");

  return (
    <section className={styles.root} aria-live="polite">
      <h3 className={assessment.passes ? styles.pass : styles.review}>{assessment.passes ? t("missionPass") : t("missionReview")}</h3>
      <dl className={styles.results}>
        <div>
          <dt className={styles.label}>{t("poweredHours")}</dt>
          <dd className={styles.value}>{number.format(assessment.poweredHours)} / {profile.minPoweredHours} {unit} · <span className={assessment.powerPass ? styles.statusPass : styles.statusMiss}>{assessment.powerPass ? t("meets") : t("misses")}</span></dd>
        </div>
        <div>
          <dt className={styles.label}>{t("earthOutage")}</dt>
          <dd className={styles.value}>{number.format(assessment.maxEarthGapHours)} / {profile.maxEarthGapHours} {unit} · <span className={assessment.commsPass ? styles.statusPass : styles.statusMiss}>{assessment.commsPass ? t("meets") : t("misses")}</span></dd>
        </div>
      </dl>
    </section>
  );
}

export default memo(ScenarioAssessment);