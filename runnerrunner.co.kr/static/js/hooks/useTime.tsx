import { useCallback, useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { currentTimeState } from "../recoil/app";

export function useUpdateCurrentTime(): void {
  const setCurrentTime = useSetRecoilState(currentTimeState);
  const lastUpdateRef = useRef<number>(Date.now());
  const timerRef = useRef<number | null>(null);

  const updateTime = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= 1000) {
      setCurrentTime(new Date(now));
      lastUpdateRef.current = now;
    }
    timerRef.current = requestAnimationFrame(updateTime);
  }, [setCurrentTime]);

  useEffect(() => {
    timerRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (timerRef.current !== null) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [updateTime]);
}
