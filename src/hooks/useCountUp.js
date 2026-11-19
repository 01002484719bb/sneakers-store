import { useEffect, useRef, useState } from "react";

export default function useCountUp(end, active, duration = 1800) {
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    if (!active) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      current.current = end;
      setValue(end);
      return;
    }

    const from = current.current;
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (end - from) * eased);
      current.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, active, duration]);

  return value;
}