// Game API service
import { apiClient } from "../client";
import type { Chest, PlayerProgress } from "@/app/types/game";

export const gameService = {
  // Get all chests for a session
  getChests: async (sessionId: string) => {
    return apiClient.get<Chest[]>(`/api/game/chests?sessionId=${sessionId}`);
  },

  // Get a specific chest
  getChest: async (chestId: number, sessionId: string) => {
    return apiClient.get<Chest>(
      `/api/game/chests/${chestId}?sessionId=${sessionId}`
    );
  },

  // Unlock a chest
  unlockChest: async (chestId: number, playerId: string, code: string) => {
    return apiClient.post(`/api/game/chests/unlock`, {
      playerId,
      chestId,
      code,
    });
  },

  // Get player progress
  getPlayerProgress: async (sessionId: string) => {
    return apiClient.get<PlayerProgress[]>(
      `/api/game/progress?sessionId=${sessionId}`
    );
  },

  // Record an attempt
  recordAttempt: async (
    chestId: number,
    playerId: string,
    success: boolean
  ) => {
    return apiClient.post(`/api/game/attempts`, {
      chestId,
      playerId,
      success,
    });
  },
};
