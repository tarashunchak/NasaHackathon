import type { Site } from "../../data";

const styles = {
  root: "text-xs leading-relaxed text-slate-500",
  link: "text-slate-300 underline decoration-slate-600 underline-offset-2 hover:text-white",
};

interface Props { site?: Site; mask: number[] | null }

export default function SourceNote({ site, mask }: Props) {
  return (
    <p className={styles.root}>
      {site
        ? <>Coordinates: <a className={styles.link} href={site.sourceUrl} target="_blank" rel="noreferrer">{site.source}</a>. {site.note} </>
        : "Coordinates entered by hand. "}
      Terrain: {mask ? `LOLA-derived mask, ${mask.length} azimuths.` : "no mask for this site, flat horizon used, so terrain shadows are not modelled."}
    </p>
  );
}
