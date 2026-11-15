import { useLocale } from "../../i18n";

const styles = {
  root: "fixed bottom-2 left-1/2 z-30 w-[96vw] max-w-[1480px] -translate-x-1/2 rounded-sm border border-[var(--line)] bg-[var(--header-bg)] px-3 py-2 shadow-[0_-8px_24px_rgba(27,48,38,0.08)] backdrop-blur-xl",
  inner: "mx-auto flex w-full max-w-[1480px] flex-wrap items-center gap-2 md:px-8",
  button: "min-w-16 rounded-sm bg-[var(--signal)] px-2 py-1.5 text-sm font-semibold text-[var(--surface)] transition hover:brightness-95",
  speed: "rounded-sm border border-[var(--line-strong)] bg-[var(--surface)] px-2 py-1.5 font-mono text-xs text-[var(--ink)] outline-none focus:border-[var(--signal)]",
  slider: "min-w-16 flex-1 accent-[var(--green)]",
  label: "w-auto whitespace-nowrap text-right font-mono text-sm tabular-nums text-[var(--green-strong)]",
};

export type PlaybackSpeed = 0.25 | 0.5 | 1 | 2;

interface Props {
  offset: number;
  max: number;
  playing: boolean;
  speed: PlaybackSpeed;
  onPlay: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onChange: (n: number) => void;
}

export default function TimeControl({ offset, max, playing, speed, onPlay, onSpeedChange, onChange }: Props) {
  const { locale, t } = useLocale();
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <button className={styles.button} onClick={onPlay}>{playing ? t("pause") : t("play")}</button>
        <select className={styles.speed} aria-label={t("playbackSpeed")} value={speed} onChange={(event) => onSpeedChange(Number(event.target.value) as PlaybackSpeed)}>
          <option value={0.25}>0.25×</option>
          <option value={0.5}>0.5×</option>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
        </select>
        <input type="range" className={styles.slider} min={0} max={max} value={offset} aria-label={t("timeRange")} onChange={(e) => onChange(Number(e.target.value))} />
        <span className={styles.label}>+{Math.floor(offset / 24)} {locale === "uk" ? "дн" : "d"} {offset % 24} {locale === "uk" ? "год" : "h"}</span>
      </div>
    </div>
  );
}
