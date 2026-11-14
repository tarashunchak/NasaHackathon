import { useEffect, useState } from "react";
import { loadHorizon } from "../data";
import { CUSTOM } from "../constants";

export function useMask(id: string) {
  const [m, setM] = useState<number[] | null>(null);
  useEffect(() => {
    let ok = true;
    setM(null);
    if (id !== CUSTOM) loadHorizon(id).then((v) => ok && setM(v));
    return () => { ok = false; };
  }, [id]);
  return m;
}
