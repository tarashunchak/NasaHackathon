import { useLocale } from "../../i18n";

const styles = {
  root: "border-y border-[var(--line)] bg-[var(--surface-alt)]",
  inner: "mx-auto grid max-w-[1480px] gap-4 px-4 py-5 text-sm leading-relaxed text-[var(--muted)] md:grid-cols-2 md:px-8",
  heading: "mb-1 font-semibold text-[var(--green-strong)]",
};

const items = [
  ["explainPolesTitle", "explainPolesBody"],
  ["explainPowerTitle", "explainPowerBody"],
  ["explainCommsTitle", "explainCommsBody"],
  ["explainReadingTitle", "explainReadingBody"],
] as const;

export default function Explain() {
  const { t } = useLocale();
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        {items.map(([heading, body]) => (
          <div key={heading}><h3 className={styles.heading}>{t(heading)}</h3><p>{t(body)}</p></div>
        ))}
      </div>
    </section>
  );
}
