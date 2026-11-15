import { memo } from "react";
import type { Site } from "../../data";
import { useLocale } from "../../i18n";

const styles = {
  root: "break-words text-xs leading-relaxed text-[var(--muted)]",
  link: "text-[var(--green)] underline decoration-[var(--line-strong)] underline-offset-2 hover:text-[var(--signal)]",
};

interface Props { site?: Site; mask: number[] | null }

function SourceNote({ site, mask }: Props) {
  const { locale, t } = useLocale();
  const source = site ? (locale === "uk" ? site.sourceUk ?? site.source : site.source) : "";
  const note = site && (locale === "uk" ? site.noteUk ?? site.note : site.note);
  const terrain = mask
    ? t(site ? "terrainMask" : "terrainUploaded").replace("{count}", String(mask.length))
    : t("terrainMissing");
  return (
    <p className={styles.root}>
      {site
        ? <>{t("coordinateSource")} <a className={styles.link} href={site.sourceUrl} target="_blank" rel="noreferrer">{source}</a>. {note} </>
        : `${t("manualCoordinates")} `}
      {t("terrain")} {terrain}
    </p>
  );
}

export default memo(SourceNote);
