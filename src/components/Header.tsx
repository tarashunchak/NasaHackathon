const styles = {
  root: "sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur",
  inner: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4",
  title: "text-lg font-semibold tracking-tight text-white",
  subtitle: "text-sm text-slate-400",
  button: "rounded-full border border-slate-700 px-4 py-1.5 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-900",
};

interface Props { explain: boolean; onToggle: () => void }

export default function Header({ explain, onToggle }: Props) {
  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <div>
          <h1 className={styles.title}>Lunar site check</h1>
          <p className={styles.subtitle}>Sun and Earth at a landing site. Two scenarios, one timeline. UTC.</p>
        </div>
        <button className={styles.button} onClick={onToggle}>{explain ? "Hide" : "How it works"}</button>
      </div>
    </header>
  );
}
