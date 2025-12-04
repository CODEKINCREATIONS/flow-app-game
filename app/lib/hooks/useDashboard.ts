// Custom hook for dashboard data management
"use client";

import { useState, useEffect, useCallback } from "react";
import { gameService } from "@/app/lib/api/services/game";

export interface DashboardPlayer {
  id: string;
  playerId?: string;
  name: string;
  playerName?: string;
  email?: string;
  activeRiddle?: number;
  riddleAccess?: number;
  attempt?: number;
  attempts?: number;
  solved: boolean | string;
}

export interface DashboardData {
  gameSessionId?: number;
  sessionCode?: string;
  status?: string;
  playersJoined?: number;
  sessionUnlocked?: boolean;
  sessionStarted?: string;
  sessionDuration?: number;
  playersProgress?: any[];
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [players, setPlayers] = useState<DashboardPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Fetch dashboard data
  const fetchDashboard = useCallback(async (sessionCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gameService.getDashboard(sessionCode);

      if (response.success && response.data) {
        // The API response structure from backend is:
        // {success: true, data: {data: {gameSession: {...}, playersProgress: [...]}}}
        // OR {success: true, data: {gameSession: {...}, playersProgress: [...]}}
        let fullData = response.data;

        // Unwrap nested data if it exists
        if ((fullData as any)?.data) {
          fullData = (fullData as any).data;
        }

        // Extract the dashboard data (gameSession)
        const dashData = (fullData as any)?.gameSession || fullData;
        console.log("[useDashboard] Dashboard data:", dashData);
        console.log("[useDashboard] gameSessionId:", dashData?.gameSessionId);
        setDashboardData(dashData as DashboardData);

        // Extract players from playersProgress (should be at same level as gameSession)
        let playersData = (fullData as any)?.playersProgress || [];

        if (Array.isArray(playersData) && playersData.length > 0) {
          const mappedPlayers: DashboardPlayer[] = playersData.map(
            (p: any) => ({
              id: p.playerId || p.id || `player-${Math.random()}`,
              playerId: p.playerId || p.id,
              name: p.playerName || p.name,
              playerName: p.playerName || p.name,
              email: p.email,
              activeRiddle: p.activeBox || p.riddleAccess || p.activeRiddle,
              riddleAccess: p.activeBox || p.riddleAccess || p.activeRiddle,
              attempt: p.attempt || p.attempts,
              attempts: p.attempt || p.attempts,
              solved: p.solved === "Yes" || p.solved === true || p.solved === 1,
            })
          );
          setPlayers(mappedPlayers);
        } else {
          setPlayers([]);
        }
      } else {
        const errorMsg = response.error || "Failed to fetch dashboard data";
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch players data (fallback - players should come from dashboard)
  const fetchPlayers = useCallback(async (sessionCode: string) => {
    try {
      const response = await gameService.getDashboardPlayers(sessionCode);

      if (response.success) {
        // Response structure: {success: true, data: {...}} where data can be wrapped
        let playersArray = response.data;

        // Handle different response structures
        if (
          playersArray &&
          typeof playersArray === "object" &&
          "data" in playersArray
        ) {
          playersArray = (playersArray as any).data;
        }

        if (Array.isArray(playersArray)) {
          // Map API response to component-friendly format
          const mappedPlayers: DashboardPlayer[] = (playersArray as any[]).map(
            (p: any) => ({
              id: p.playerId || p.id,
              playerId: p.playerId || p.id,
              name: p.playerName || p.name,
              playerName: p.playerName || p.name,
              email: p.email,
              activeRiddle: p.riddleAccess || p.activeBox,
              riddleAccess: p.riddleAccess || p.activeBox,
              attempt: p.attempts || p.attempt,
              attempts: p.attempts || p.attempt,
              solved: p.solved === true || p.solved === "Yes" || p.solved === 1,
            })
          );
          // Only update if we have players (fallback)
          if (mappedPlayers.length > 0) {
            setPlayers(mappedPlayers);
          }
        }
      }
    } catch (err) {
      // Silent fail - fallback function
    }
  }, []);

  // Combined fetch function - dashboard includes all data
  const fetchDashboardData = useCallback(
    async (sessionCode: string) => {
      // Only fetch dashboard - it includes players data
      await fetchDashboard(sessionCode);
    },
    [fetchDashboard]
  );

  // Start polling for real-time updates
  const startPolling = useCallback(
    (sessionCode: string, interval: number = 5000) => {
      if (isPolling) return;

      setIsPolling(true);
      const pollInterval = setInterval(() => {
        fetchDashboardData(sessionCode);
      }, interval);

      return () => {
        clearInterval(pollInterval);
        setIsPolling(false);
      };
    },
    [isPolling, fetchDashboardData]
  );

  return {
    dashboardData,
    players,
    loading,
    error,
    isPolling,
    fetchDashboard,
    fetchPlayers,
    fetchDashboardData,
    startPolling,
  };
};
