// Session API service
import { apiClient } from "../client";
import type { Session, SessionDetails } from "@/app/types/session";
import type { Player } from "@/app/types/auth";

export const sessionService = {
  // Create a new session
  createSession: async (facilitatorId: string) => {
    return apiClient.post<Session>("/api/sessions", { facilitatorId });
  },

  // Get session by ID
  getSession: async (sessionId: string) => {
    return apiClient.get<Session>(`/api/sessions/${sessionId}`);
  },

  // Get session by code
  getSessionByCode: async (code: string) => {
    return apiClient.get<Session>(`/api/sessions/code/${code}`);
  },

  // Get session details
  getSessionDetails: async (sessionId: string) => {
    return apiClient.get<SessionDetails>(`/api/sessions/${sessionId}/details`);
  },

  // Join session as player
  joinSession: async (sessionCode: string, playerId: string) => {
    return apiClient.post<Session>(`/api/sessions/${sessionCode}/join`, {
      playerId,
    });
  },

  // Get players in session
  getPlayers: async (sessionId: string) => {
    return apiClient.get<Player[]>(`/api/sessions/${sessionId}/players`);
  },

  // Generate QR code for session
  getQRCode: async (sessionId: string) => {
    return apiClient.get<string>(`/api/sessions/${sessionId}/qr`);
  },

  // End session
  endSession: async (sessionId: string) => {
    return apiClient.post(`/api/sessions/${sessionId}/end`);
  },
};
