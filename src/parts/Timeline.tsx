import { memo, useCallback, useMemo } from "react";
import type { MouseEvent } from "react";
import type { Sample } from "../sky";

const styles = {
  hint: "text-xs text-stone-500 mb-1",
  chart: "w-full border border-stone-300 cursor-pointer",
  legend: "text-xs mt-1",
  sun: "text-amber-600",
  earth: "text-blue-600",
};

interface Props {
  data: Sample[];
  offset: number;
  setOffset: (n: number) => void;
}

function Timeline({ data, offset, setOffset }: Props) {
  const width = 600;
  const height = 110;
  const { x, y, sunLine, earthLine } = useMemo(() => {
    const allElevations = data.flatMap((point) => [point.sun.el, point.earth.el]);
    const low = Math.min(...allElevations, 0) - 2;
    const high = Math.max(...allElevations, 0) + 2;
    const getX = (index: number) => (index / (data.length - 1)) * width;
    const getY = (elevation: number) => height - ((elevation - low) / (high - low)) * height;
    const makeLine = (body: "sun" | "earth") => data.map((point, index) => `${getX(index).toFixed(1)},${getY(point[body].el).toFixed(1)}`).join(" ");

    return { x: getX, y: getY, sunLine: makeLine("sun"), earthLine: makeLine("earth") };
  }, [data]);
  const handleClick = useCallback((event: MouseEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setOffset(Math.round(((event.clientX - bounds.left) / bounds.width) * (data.length - 1)));
  }, [data.length, setOffset]);

  return (
    <div>
      <p className={styles.hint}>Elevation over 30 days. Click to jump.</p>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.chart} onClick={handleClick}>
        <line x1="0" x2={width} y1={y(0)} y2={y(0)} stroke="#a8a29e" strokeDasharray="3 3" />
        <polyline points={sunLine} fill="none" stroke="#d97706" strokeWidth="1.2" />
        <polyline points={earthLine} fill="none" stroke="#2563eb" strokeWidth="1.2" />
        <line x1={x(offset)} x2={x(offset)} y1="0" y2={height} stroke="#44403c" />
      </svg>
      <p className={styles.legend}><span className={styles.sun}>Sun</span> · <span className={styles.earth}>Earth</span> · dashed = 0°</p>
    </div>
  );
}

export default memo(Timeline);
