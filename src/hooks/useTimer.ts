import { useEffect, useRef, useCallback } from 'react';
import { useSharedValue, withTiming, Easing, runOnJS } from 'react-native-reanimated';

interface UseTimerOptions {
  duration: number; // seconds
  onTick?: (remaining: number) => void;
  onExpire?: () => void;
}

export function useTimer({ duration, onTick, onExpire }: UseTimerOptions) {
  const progress = useSharedValue(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const remainingRef = useRef(duration);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    remainingRef.current = duration;
    progress.value = 1;

    progress.value = withTiming(0, {
      duration: duration * 1000,
      easing: Easing.linear,
    });

    intervalRef.current = setInterval(() => {
      remainingRef.current -= 1;
      onTick?.(remainingRef.current);
      if (remainingRef.current <= 0) {
        stop();
        onExpire?.();
      }
    }, 1000);
  }, [duration, stop, onTick, onExpire, progress]);

  const reset = useCallback(() => {
    stop();
    progress.value = 1;
    remainingRef.current = duration;
  }, [stop, duration, progress]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { progress, start, stop, reset };
}
