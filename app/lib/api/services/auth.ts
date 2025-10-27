// Authentication API service
import { apiClient } from "../client";
import type { Player, Facilitator } from "@/app/types/auth";

export const authService = {
  // Facilitator login
  loginFacilitator: async (code: string) => {
    return apiClient.post<Facilitator>("/api/auth/facilitator", { code });
  },

  // Player login/registration
  loginPlayer: async (name: string, email: string, language: string) => {
    return apiClient.post<Player>("/api/auth/player", {
      name,
      email,
      language,
    });
  },

  // Logout
  logout: async () => {
    return apiClient.post("/api/auth/logout");
  },
};
