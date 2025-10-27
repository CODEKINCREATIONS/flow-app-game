// Zustand store configuration
import { persistOptions } from "zustand/middleware";

export const persistConfig = {
  name: "flow-game-storage",
  partialize: (state: any) => ({
    // Only persist non-sensitive data
    // Session will be handled separately if needed
  }),
} as const;
