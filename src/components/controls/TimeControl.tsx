const styles = {
  root: "flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3",
  button: "w-20 rounded-full bg-amber-400 px-4 py-1.5 text-sm font-medium text-slate-950 transition hover:bg-amber-300",
  slider: "flex-1 accent-amber-400",
  label: "w-28 text-right text-sm tabular-nums text-slate-300",
};

interface Props { offset: number; max: number; playing: boolean; onPlay: () => void; onChange: (n: number) => void }

export default function TimeControl({ offset, max, playing, onPlay, onChange }: Props) {
  return (
    <div className={styles.root}>
      <button className={styles.button} onClick={onPlay}>{playing ? "Pause" : "Play"}</button>
      <input type="range" className={styles.slider} min={0} max={max} value={offset} onChange={(e) => onChange(Number(e.target.value))} />
      <span className={styles.label}>+{Math.floor(offset / 24)} d {offset % 24} h</span>
    </div>
  );
}
