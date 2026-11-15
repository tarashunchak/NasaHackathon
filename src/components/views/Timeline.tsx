import { memo, useCallback, useMemo, type KeyboardEvent, type PointerEvent } from "react";
import type { Sample } from "../../sky";
import { useLocale } from "../../i18n";

const styles = {
  caption: "mb-1 text-xs text-[var(--muted)]",
  svg: "w-full cursor-grab select-none touch-pan-y rounded-sm border border-[var(--line)] bg-[var(--surface)] active:cursor-grabbing",
  legend: "mt-1 flex flex-wrap gap-4 text-xs text-[var(--muted)]",
  sun: "text-[var(--signal)]",
  earth: "text-[#647d5a]",
  c: { zero: "#aab9af", sun: "#c85a36", earth: "#71845e", cursor: "var(--chart-cursor)" },
};

interface Props { data: Sample[]; offset: number; setOffset: (n: number) => void }

function Timeline({ data, offset, setOffset }: Props) {
  const { t } = useLocale();
  const W = 600, Ht = 110, c = styles.c;
  const { x, y, sunLine, earthLine } = useMemo(() => {
    const all = data.flatMap((p) => [p.sun.el, p.earth.el]);
    const lo = Math.min(...all, 0) - 2, hi = Math.max(...all, 0) + 2;
    const getX = (i: number) => (i / (data.length - 1)) * W;
    const getY = (v: number) => Ht - ((v - lo) / (hi - lo)) * Ht;
    const makeLine = (key: "sun" | "earth") => data.map((p, i) => `${getX(i).toFixed(1)},${getY(p[key].el).toFixed(1)}`).join(" ");
    return { x: getX, y: getY, sunLine: makeLine("sun"), earthLine: makeLine("earth") };
  }, [data]);
  const setOffsetFromPointer = useCallback((event: PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    setOffset(Math.round(position * (data.length - 1)));
  }, [data.length, setOffset]);
  const handlePointerDown = useCallback((event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setOffsetFromPointer(event);
  }, [setOffsetFromPointer]);
  const handlePointerMove = useCallback((event: PointerEvent<SVGSVGElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) setOffsetFromPointer(event);
  }, [setOffsetFromPointer]);
  const handleKeyDown = useCallback((event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setOffset(Math.max(0, offset - 1));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setOffset(Math.min(data.length - 1, offset + 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      setOffset(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setOffset(data.length - 1);
    }
  }, [data.length, offset, setOffset]);
  return (
    <div>
      <p className={styles.caption}>{t("chartCaption")}</p>
      <svg
        viewBox={`0 0 ${W} ${Ht}`}
        className={styles.svg}
        role="slider"
        tabIndex={0}
        aria-label={t("chartCaption")}
        aria-valuemin={0}
        aria-valuemax={data.length - 1}
        aria-valuenow={offset}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
      >
        <line x1="0" x2={W} y1={y(0)} y2={y(0)} stroke={c.zero} strokeDasharray="3 3" />
        <polyline points={sunLine} fill="none" stroke={c.sun} strokeWidth="1.3" />
        <polyline points={earthLine} fill="none" stroke={c.earth} strokeWidth="1.3" />
        <line x1={x(offset)} x2={x(offset)} y1="0" y2={Ht} stroke={c.cursor} />
      </svg>
      <div className={styles.legend}><span className={styles.sun}>● {t("sun")}</span><span className={styles.earth}>● {t("earth")}</span><span>{t("dashedZero")}</span></div>
    </div>
  );
}

export default memo(Timeline);
