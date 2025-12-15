// Authentication API service
import { apiClient } from "../client";
import type { Player, Facilitator } from "@/app/types/auth";

export const authService = {
  // Facilitator login
  loginFacilitator: async (code: string) => {
    return apiClient.post<Facilitator>("/api/auth/facilitator", { code });
  },

  // Player login/registration
  loginPlayer: async (
    name: string,
    email: string,
    language: string,
    gameSessionId?: number | null
  ) => {
    return apiClient.post<Player>("/api/auth/player", {
      name,
      email,
      language,
      gameSessionId,
    });
  },

  // Session verification through Next.js API route (proxies to Azure)
  verifySessionCode: async (sessionCode: string) => {
    try {
      const response = await fetch(
        `/api/auth/verify-session?sessionCode=${encodeURIComponent(
          sessionCode
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Invalid session code",
          data: null,
        };
      }

      return {
        success: true,
        data: data,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to verify session",
        data: null,
      };
    }
  },

  // Verify password through Next.js API route (proxies to Azure)
  verifyPassword: async (password: string) => {
    try {
      const response = await fetch(
        `/api/auth/verify-password?password=${encodeURIComponent(password)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Password verification failed",
          data: null,
        };
      }

      return {
        success: true,
        data: data,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to verify password",
        data: null,
      };
    }
  },

  // Join game
  joinGame: async (
    playerId: number,
    name: string,
    email: string,
    language: string,
    gameSessionId: number
  ) => {
    const payload = {
      playerId,
      name,
      email,
      language: language.toUpperCase(),
      gameSessionId,
      createdAt: new Date().toISOString(),
      playerProgresses: null,
    };
    return apiClient.post("/api/player/join-game", payload);
  },

  // Logout
  logout: async () => {
    return apiClient.post("/api/auth/logout");
  },
};
