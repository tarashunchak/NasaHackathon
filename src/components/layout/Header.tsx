import { useLocale } from "../../i18n";
import { useTheme } from "../../theme";
import ProtractorRocket from "../brand/ProtractorRocket";

const styles = {
  root: "sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-md",
  inner: "mx-auto flex w-full max-w-[1480px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8",
  title: "text-lg font-semibold text-[var(--ink)]",
  subtitle: "mt-0.5 text-sm text-[var(--muted)]",
  brand: "flex min-w-0 items-center gap-3",
  actions: "flex shrink-0 flex-wrap items-center gap-2",
  languages: "flex rounded-sm border border-[var(--line-strong)] p-0.5 text-xs",
  language: "rounded-sm px-2 py-1 text-[var(--muted)] transition hover:text-[var(--ink)]",
  languageOn: "rounded-sm bg-[var(--green)] px-2 py-1 text-[var(--canvas)]",
  themes: "flex rounded-sm border border-[var(--line-strong)] p-0.5 text-xs",
  theme: "rounded-sm px-2 py-1 text-[var(--muted)] transition hover:text-[var(--ink)]",
  themeOn: "rounded-sm bg-[var(--surface-alt)] px-2 py-1 font-medium text-[var(--ink)]",
  button: "w-32 shrink-0 whitespace-nowrap rounded-sm border border-[var(--line-strong)] px-3 py-1.5 text-center text-sm text-[var(--green-strong)] transition hover:border-[var(--green)] hover:bg-[var(--surface)]",
};

interface Props { explain: boolean; onToggle: () => void }

export default function Header({ explain, onToggle }: Props) {
  const { locale, setLocale, t } = useLocale();
  const { theme, setTheme } = useTheme();
  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <ProtractorRocket />
          <div>
            <h1 className={styles.title}>{t("appTitle")}</h1>
            <p className={styles.subtitle}>{t("appSubtitle")}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.languages} role="group" aria-label={t("language")}>
            <button type="button" className={locale === "uk" ? styles.languageOn : styles.language} aria-pressed={locale === "uk"} onClick={() => setLocale("uk")}>UA</button>
            <button type="button" className={locale === "en" ? styles.languageOn : styles.language} aria-pressed={locale === "en"} onClick={() => setLocale("en")}>EN</button>
          </div>
          <div className={styles.themes} role="group" aria-label={t("theme")}>
            <button type="button" className={theme === "light" ? styles.themeOn : styles.theme} aria-pressed={theme === "light"} onClick={() => setTheme("light")}>{t("lightTheme")}</button>
            <button type="button" className={theme === "dark" ? styles.themeOn : styles.theme} aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>{t("darkTheme")}</button>
          </div>
          <button className={styles.button} onClick={onToggle}>{explain ? t("hide") : t("howItWorks")}</button>
        </div>
      </div>
    </header>
  );
}
