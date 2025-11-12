// Custom hook for session management
"use client";

import { useSessionStore } from "@/app/lib/store/sessionStore";
import { sessionService } from "@/app/lib/api/services/sessions";
import { useCallback } from "react";

export const useSession = () => {
  const {
    session,
    sessionDetails,
    loading,
    error,
    setSession,
    setSessionDetails,
    addPlayer: addPlayerToStore,
    removePlayer: removePlayerFromStore,
    updateSessionStatus,
    setLoading,
    setError,
    reset,
  } = useSessionStore();

  const fetchSession = useCallback(
    async (sessionId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await sessionService.getSession(sessionId);
        if (response.success && response.data) {
          setSession(response.data);
        } else {
          setError(response.error || "Failed to fetch session");
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setSession, setLoading, setError]
  );

  const fetchSessionDetails = useCallback(
    async (sessionId: string) => {
      setLoading(true);
      try {
        const response = await sessionService.getSessionDetails(sessionId);
        if (response.success && response.data) {
          setSessionDetails(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setSessionDetails, setLoading, setError]
  );

  const joinSession = useCallback(
    async (sessionCode: string, playerId: string) => {
      setLoading(true);
      try {
        const response = await sessionService.joinSession(
          sessionCode,
          playerId
        );
        if (response.success && response.data) {
          setSession(response.data);
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [setSession, setLoading, setError]
  );

  const endSession = useCallback(
    async (sessionId: string) => {
      setLoading(true);
      try {
        const response = await sessionService.endSession(sessionId);
        if (response.success) {
          updateSessionStatus("completed");
        }
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [updateSessionStatus, setLoading, setError]
  );

  const addPlayer = useCallback(
    (player: any) => {
      addPlayerToStore(player);
    },
    [addPlayerToStore]
  );

  const removePlayer = useCallback(
    (playerId: string) => {
      removePlayerFromStore(playerId);
    },
    [removePlayerFromStore]
  );

  const verifySessionCode = useCallback(
    async (sessionCode: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await sessionService.verifySessionCode(sessionCode);
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || "Failed to verify session code");
          return { valid: false };
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return { valid: false };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  return {
    session,
    sessionDetails,
    loading,
    error,
    fetchSession,
    fetchSessionDetails,
    joinSession,
    endSession,
    addPlayer,
    removePlayer,
    updateSessionStatus,
    reset,
    verifySessionCode,
  };
};
