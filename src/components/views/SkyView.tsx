import { memo, useMemo } from "react";
import { horizonAt, type Sample } from "../../sky";
import { useLocale } from "../../i18n";

const styles = {
  frame: "relative overflow-hidden rounded-sm border border-[#263b45] shadow-[0_8px_24px_rgba(11,25,32,0.12)]",
  svg: "block w-full",
  c: { sky: "#121a16", edge: "#64766b", text: "#d8e2d9", sun: "#e6b45e", earth: "#91a879", stroke: "#0b100d" },
};

interface Props { cur: Sample; flat: number; prof?: number[] }

function SkyView({ cur, flat, prof }: Props) {
  const { locale, t } = useLocale();
  const W = 360, Ht = 130, graphHeight = 100, top = 90, bot = -15, c = styles.c;
  const compass = locale === "uk" ? ["Пн", "Сх", "Пд", "Зх"] : ["N", "E", "S", "W"];
  const y = (el: number) => ((top - Math.max(bot, Math.min(top, el))) / (top - bot)) * graphHeight;
  const pts = useMemo(
    () => Array.from({ length: 37 }, (_, i) => `${i * 10},${y(horizonAt(i * 10, flat, prof))}`).join(" "),
    [flat, prof],
  );
  const dot = (az: number, el: number, up: boolean, color: string, label: string, r: number) => (
    <g opacity={up ? 1 : 0.35}>
      <circle cx={az} cy={y(el)} r={r} fill={color} stroke={c.stroke} strokeWidth="0.5" />
      <text x={Math.min(az + r + 3, W - 30)} y={y(el) + 3} fontSize="9" fill={c.text}>{label}</text>
    </g>
  );
  return (
    <div className={styles.frame}>
      <svg viewBox={`-12 0 ${W + 24} ${Ht}`} className={styles.svg}>
        <rect x={-12} width={W + 24} height={Ht} fill={c.sky} />
        {(prof || flat !== 0) && <polyline points={pts} fill="none" stroke={c.edge} strokeWidth="0.8" opacity="0.75" />}
        {[0, 90, 180, 270].map((azimuth, index) => {
          const label = compass[index];
          return (
            <g key={label}>
              <path d={`M${azimuth} ${graphHeight}v4`} stroke={c.edge} strokeWidth="0.8" />
              <text x={azimuth} y={graphHeight + 17} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontFamily="DM Mono, monospace" fill={c.text}>{label}</text>
            </g>
          );
        })}
        {dot(cur.sun.az, cur.sun.el, cur.sunUp, c.sun, t("sun"), 6)}
        {dot(cur.earth.az, cur.earth.el, cur.earthUp, c.earth, t("earth"), 4)}
      </svg>
    </div>
  );
}

export default memo(SkyView);
