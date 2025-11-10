import { PersistOptions } from "zustand/middleware";

export const persistConfig: PersistOptions<any> = {
  name: "flow-game-storage",
  partialize: (state: any) => ({
    // Only persist non-sensitive data
  }),
};
