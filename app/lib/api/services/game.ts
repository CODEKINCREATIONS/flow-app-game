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
    try {
      console.log("[unlockChest] Starting unlock process:", {
        boxID,
        playerId,
      });

      // Call the API route which handles the backend communication
      const response = await apiClient.post("/api/game/player-progress", {
        playerId: playerId || 0,
        boxId: boxID,
        password,
      });

      console.log("[unlockChest] Response:", response);

      if (!response.success) {
        return {
          success: false,
          error: response.error || "Failed to unlock chest",
        };
      }

      // Return the response data
      return {
        success: (response.data as any)?.message === "Success",
        message: (response.data as any)?.message,
        data: (response.data as any)?.data,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("[unlockChest] Error:", errorMsg);
      return {
        success: false,
        error: errorMsg || "Failed to unlock chest",
      };
    }
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

  // Get game progress (boxes, lock types, and session state) for a specific player
  getGameProgress: async (sessionCode: string, playerId?: number | string) => {
    const url = playerId
      ? `/api/game/game-progress/${sessionCode}?playerId=${playerId}`
      : `/api/game/game-progress/${sessionCode}`;
    return apiClient.get<GameProgressResponse>(url);
  },

  // Record a player's box attempt
  recordBoxAttempt: async (playerId: number | string, boxId: number) => {
    return apiClient.post(`/api/game/player-progress`, {
      playerId,
      boxId,
    });
  },

  // Verify password for a box
  verifyBoxPassword: async (
    playerId: number | string,
    padlockPassword: string
  ) => {
    return apiClient.put(`/api/game/player-progress`, {
      playerId,
      padlockPassword,
    });
  },
};
