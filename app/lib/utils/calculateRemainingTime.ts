/**
 * Calculate remaining time for a session
 * @param sessionUnlockedAt - UTC timestamp when session was unlocked
 * @param sessionDuration - Total session duration in minutes (default: 60)
 * @returns Remaining minutes in MM:SS format
 */
export const calculateRemainingTime = (
  sessionUnlockedAt: string | null | undefined,
  sessionDuration: number = 60
): string => {
  // If not unlocked, return full duration
  if (!sessionUnlockedAt) {
    return `${sessionDuration.toString().padStart(2, "0")}:00`;
  }

  try {
    const unlockedTime = new Date(sessionUnlockedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedMs = currentTime - unlockedTime;
    const elapsedMinutes = elapsedMs / 1000 / 60;

    const remainingMinutes = Math.max(0, sessionDuration - elapsedMinutes);
    const minutes = Math.floor(remainingMinutes);
    const seconds = Math.round((remainingMinutes - minutes) * 60);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } catch {
    return `${sessionDuration.toString().padStart(2, "0")}:00`;
  }
};
