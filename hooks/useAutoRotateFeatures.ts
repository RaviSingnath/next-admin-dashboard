import { useCallback, useEffect, useRef, useState } from "react";

type UseAutoRotateOptions = {
  count: number;
  duration?: number;
};

export function useAutoRotate({
  count,
  duration = 5000,
}: UseAutoRotateOptions) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const elapsedRef = useRef(0);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % count);
    elapsedRef.current = 0;
    setProgress(0);
  }, [count]);

  const reset = useCallback((index?: number) => {
    if (typeof index === "number") {
      setActive(index);
    }

    elapsedRef.current = 0;
    startTimeRef.current = performance.now();
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused) return;

    startTimeRef.current = performance.now() - elapsedRef.current;

    const animate = (time: number) => {
      elapsedRef.current = time - startTimeRef.current;

      const p = Math.min(elapsedRef.current / duration, 1);

      setProgress(p);

      if (p >= 1) {
        next();
        return;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [active, paused, duration, next]);

  return {
    active,
    progress,
    paused,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
    setActive: reset,
  };
}
