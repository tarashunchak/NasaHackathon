import { memo, useMemo } from "react";
import { horizonAt, type Sample } from "../sky";

const styles = {
  svg: "w-full border border-stone-300 bg-stone-900",
  colors: {
    edge: "#d6d3d1",
    text: "#e7e5e4",
    stroke: "#44403c",
    sun: "#fbbf24",
    earth: "#60a5fa",
  },
};

interface Props {
  cur: Sample;
  flat: number;
  prof?: number[];
}

function SkyView({ cur, flat, prof }: Props) {
  const width = 360;
  const height = 130;
  const top = 40;
  const bottom = -15;
  const y = (elevation: number) => ((top - Math.max(bottom, Math.min(top, elevation))) / (top - bottom)) * height;
  const points = useMemo(
    () => Array.from({ length: 37 }, (_, index) => `${index * 10},${y(horizonAt(index * 10, flat, prof))}`).join(" "),
    [flat, prof],
  );
  const dot = (azimuth: number, elevation: number, up: boolean, color: string, label: string, radius: number) => (
    <g opacity={up ? 1 : 0.4}>
      <circle cx={azimuth} cy={y(elevation)} r={radius} fill={color} stroke={styles.colors.stroke} strokeWidth="0.5" />
      <text x={Math.min(azimuth + radius + 3, width - 30)} y={y(elevation) + 3} fontSize="9" fill={styles.colors.text}>{label}</text>
    </g>
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg}>
      <polyline points={points} fill="none" stroke={styles.colors.edge} strokeWidth="1.2" />
      {[0, 90, 180, 270].map((azimuth, index) => <text key={azimuth} x={azimuth + 3} y={height - 4} fontSize="9" fill={styles.colors.text}>{"NESW"[index]}</text>)}
      {dot(cur.sun.az, cur.sun.el, cur.sunUp, styles.colors.sun, "Sun", 6)}
      {dot(cur.earth.az, cur.earth.el, cur.earthUp, styles.colors.earth, "Earth", 4)}
    </svg>
  );
}

export default memo(SkyView);
