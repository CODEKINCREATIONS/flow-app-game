// Game API service
import { apiClient } from "../client";
import type {
  Chest,
  PlayerProgress,
  PlayerActivityData,
  GameProgressResponse,
} from "@/app/types/game";

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

  // Unlock a chest with password verification
  unlockChest: async (
    sessionCode: string,
    boxID: number,
    password: string,
    playerId?: number
  ) => {
    return apiClient.post(`/api/game/unlock`, {
      sessionCode,
      boxID,
      password,
      playerId: playerId || 0,
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

  // Get dashboard data for a session
  getDashboard: async (sessionCode: string) => {
    return apiClient.get(`/api/dashboard/get-dashboard/${sessionCode}`);
  },

  // Get all players in a session
  getDashboardPlayers: async (sessionCode: string) => {
    return apiClient.get(`/api/game/players?sessionCode=${sessionCode}`);
  },

  // Unlock session for players
  unlockSession: async (sessionCode: string) => {
    return apiClient.put(`/api/dashboard/unlock-session/${sessionCode}`);
  },

  // Get player activity (statistics and progress)
  getPlayerActivity: async (sessionCode: string, playerId: number | string) => {
    return apiClient.get<PlayerActivityData>(
      `/api/game/player-activity?sessionCode=${sessionCode}&playerId=${playerId}`
    );
  },

  // Get game progress (boxes, lock types, and session state)
  getGameProgress: async (sessionCode: string) => {
    return apiClient.get<GameProgressResponse>(
      `/api/game/game-progress/${sessionCode}`
    );
  },
};
