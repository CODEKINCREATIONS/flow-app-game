"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { useTimer } from "@/app/lib/hooks/useTimer";

interface TimerContextValue {
  formatted: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  isRunning: boolean;
  secondsElapsed: number;
  secondsRemaining: number;
}

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

// 70 minutes in seconds
const DEFAULT_DURATION = 70 * 60;

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // we keep an elapsed timer and expose remaining = duration - elapsed
  const { time, isRunning, start, pause, reset, setTime, formatted } = useTimer(
    {
      autoStart: false,
      initialSeconds: 0,
    }
  );

  // when timer reaches duration, pause it
  React.useEffect(() => {
    if (time >= DEFAULT_DURATION) {
      pause();
      setTime(DEFAULT_DURATION);
    }
  }, [time, pause, setTime]);

  const secondsRemaining = Math.max(0, DEFAULT_DURATION - time);

  // format remaining as MM:SS
  const formatRemaining = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const value = useMemo(
    () => ({
      formatted: formatRemaining(secondsRemaining),
      start,
      pause,
      reset: () => {
        reset();
        // ensure elapsed reset to 0
        setTime(0);
      },
      isRunning,
      secondsElapsed: time,
      secondsRemaining,
    }),
    [secondsRemaining, start, pause, reset, isRunning, time, setTime]
  );

  // Suppress hydration warning - timer state will differ between server and client
  if (!isClient) {
    return (
      <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
    );
  }

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const ctx = useContext(TimerContext);
  if (!ctx)
    throw new Error("useTimerContext must be used within TimerProvider");
  return ctx;
};
