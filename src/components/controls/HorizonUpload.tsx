import { useState, type ChangeEvent } from "react";
import { useLocale } from "../../i18n";

const styles = {
  root: "col-span-2 border-t border-[var(--line)] pt-3",
  label: "text-xs font-medium text-[var(--muted)]",
  input: "mt-1 block w-full text-xs text-[var(--muted)] file:mr-3 file:rounded-sm file:border-0 file:bg-[var(--green)] file:px-3 file:py-2 file:text-[var(--canvas)]",
  hint: "mt-1 text-xs text-[var(--muted)]",
  loaded: "mt-2 text-xs text-[var(--green)]",
  clear: "mt-2 text-xs text-[var(--green-strong)] underline underline-offset-2 hover:text-[var(--signal)]",
  error: "mt-2 text-xs text-[var(--signal)]",
};

interface Props {
  values?: number[];
  onChange: (values: number[] | undefined) => void;
}

export default function HorizonUpload({ values, onChange }: Props) {
  const { t } = useLocale();
  const [error, setError] = useState("");

  const readFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError(t("horizonTooLarge"));
      return;
    }

    try {
      const parsed: unknown = JSON.parse(await file.text());
      const angles = Array.isArray(parsed) ? parsed : (parsed as { values?: unknown })?.values;
      if (!Array.isArray(angles) || angles.length < 12 || angles.length > 4096 || !angles.every((angle) => typeof angle === "number" && Number.isFinite(angle) && angle >= -90 && angle <= 90)) {
        setError(t("horizonInvalid"));
        return;
      }
      onChange(angles);
      setError("");
    } catch {
      setError(t("horizonInvalid"));
    }
  };

  return (
    <div className={styles.root}>
      <label className={styles.label}>{t("horizonUpload")}
        <input className={styles.input} type="file" accept=".json,application/json" onChange={readFile} />
      </label>
      <p className={styles.hint}>{t("horizonFormat")}</p>
      {values && <>
        <p className={styles.loaded}>{t("horizonLoaded").replace("{count}", String(values.length))}</p>
        <button type="button" className={styles.clear} onClick={() => { onChange(undefined); setError(""); }}>{t("clearHorizon")}</button>
      </>}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}