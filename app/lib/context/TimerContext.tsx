"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useCountdownTimer } from "@/app/lib/hooks/useCountdownTimer";

interface TimerContextValue {
  formatted: string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  isRunning: boolean;
  secondsRemaining: number;
}

const TimerContext = createContext<TimerContextValue | undefined>(undefined);

// 60 minutes countdown (3600 seconds)
const DEFAULT_DURATION = 60 * 60;

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const { secondsRemaining, isRunning, start, pause, reset, formatted } =
    useCountdownTimer({
      initialSeconds: DEFAULT_DURATION,
      autoStart: true,
    });

  const value = useMemo(
    () => ({
      formatted,
      start,
      pause,
      reset,
      isRunning,
      secondsRemaining,
    }),
    [formatted, start, pause, reset, isRunning, secondsRemaining]
  );

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
