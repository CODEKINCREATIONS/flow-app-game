"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/components/ui/dialog";
import { gameService } from "@/app/lib/api/services/game";
import type { PlayerStats, PlayerActivityItem } from "@/app/types/game";

interface Riddle {
  id: number;
  name: string;
  visited: boolean;
  solved: boolean;
  attempts: number;
}

interface PlayerDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  playerName: string;
  playerEmail?: string;
  riddleData: Riddle[];
  sessionCode?: string;
  playerId?: number | string;
}

export const PlayerDetailsDialog = ({
  open,
  onClose,
  playerName,
  playerEmail,
  riddleData,
  sessionCode,
  playerId,
}: PlayerDetailsDialogProps) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [activityItems, setActivityItems] = useState<PlayerActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch real player activity data
  useEffect(() => {
    if (open && sessionCode && playerId) {
      const fetchPlayerActivity = async () => {
        try {
          setIsLoading(true);
          setError(null);
          console.log(
            `[PlayerDetailsDialog] Fetching activity for player ${playerId} in session ${sessionCode}`
          );

          const response = await gameService.getPlayerActivity(
            sessionCode,
            playerId
          );

          if (response.success && response.data) {
            console.log(
              "[PlayerDetailsDialog] Activity data received:",
              response.data
            );
            setPlayerStats(response.data.playerStats);
            setActivityItems(response.data.playersProgress);
          } else {
            console.warn(
              "[PlayerDetailsDialog] Failed to fetch activity:",
              response.error
            );
            setError(response.error || "Failed to load player activity");
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : "Unknown error";
          console.error("[PlayerDetailsDialog] Exception:", errorMsg);
          setError(errorMsg);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPlayerActivity();
    }
  }, [open, sessionCode, playerId]);

  // Use API data if available, otherwise fall back to props data
  const totalRiddles = playerStats?.totalBoxes ?? riddleData.length;
  const solvedRiddles =
    playerStats?.boxesSolved ?? riddleData.filter((r) => r.solved).length;
  const visitedRiddles =
    playerStats?.boxesVisited ?? riddleData.filter((r) => r.visited).length;

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="relative rounded-[10px] p-[40px] bg-[#0D0F1A] border border-[#23263A] text-white shadow-2xl max-w-xs w-[75vw] max-h-[70vh] overflow-y-auto">
        {/* Close Button - Top Right */}
        <X
          onClick={onClose}
          className="absolute top-[15px] right-[15px] w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        />

        {/* Header */}
        <DialogHeader>
          <div className="mb-[6px]">
            <div className="text-sm font-extrabold text-white mb-[2px] break-words truncate">
              {playerName}
            </div>
            {playerEmail && (
              <p className="text-gray-400 text-xs break-all truncate">
                {playerEmail}
              </p>
            )}
          </div>
        </DialogHeader>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-[8px] mb-[8px]">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B61FF]"></div>
              <p className="ml-3 text-gray-400">Loading player data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="mt-[8px] mb-[8px]">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400 text-sm">Error loading data:</p>
              <p className="text-red-300 text-xs mt-2">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <div className="mt-[8px] mb-[8px]">
            {/* Statistics */}
            <div className="mb-[8px]">
              <h3 className="text-xs font-semibold text-[#7CE3FF] mb-[6px] border-l-4 border-[#7B61FF] pl-[8px]">
                Statistics
              </h3>
              <div className="grid grid-cols-3 gap-[6px]">
                <div className="bg-[#1A1C2A] border border-[#23263A] rounded-[10px] p-[8px] text-center hover:border-[#7B61FF] transition-colors cursor-pointer">
                  <div className="text-lg font-bold text-[#7B61FF] mb-[4px]">
                    {solvedRiddles}
                  </div>
                  <p className="text-gray-400 text-xs">Boxes Solved</p>
                </div>
                <div className="bg-[#1A1C2A] border border-[#23263A] rounded-[10px] p-[8px] text-center hover:border-[#7B61FF] transition-colors cursor-pointer">
                  <div className="text-lg font-bold text-[#3A8DFF] mb-[4px]">
                    {visitedRiddles}
                  </div>
                  <p className="text-gray-400 text-xs">Boxes Visited</p>
                </div>
                <div className="bg-[#1A1C2A] border border-[#23263A] rounded-[10px] p-[8px] text-center hover:border-[#7B61FF] transition-colors cursor-pointer">
                  <div className="text-lg font-bold text-[#FFD60A] mb-[4px]">
                    {totalRiddles}
                  </div>
                  <p className="text-gray-400 text-xs">Total Boxes</p>
                </div>
              </div>
            </div>

            {/* Box Activity - From API Data */}
            <div className="mb-[8px]">
              <h3 className="text-xs font-semibold text-[#7CE3FF] mb-[6px] border-l-4 border-[#7B61FF] pl-[8px]">
                Box Activity
              </h3>
              <div className="space-y-[4px]">
                {activityItems && activityItems.length > 0 ? (
                  activityItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-[8px] bg-[#1A1C2A] border border-[#23263A] rounded-[10px] hover:border-[#7B61FF] transition-colors"
                    >
                      <div className="flex gap-[6px] items-start">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-[2px] ${
                            item.solved === "Yes"
                              ? "bg-lime-400"
                              : "bg-amber-300"
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-xs">
                            Box {item.activeBox}
                          </p>
                        </div>
                      </div>
                      <div className="mt-[6px] ml-[22px] text-gray-400 text-xs space-y-[2px]">
                        <p>Attempt: {item.attempt}</p>
                        <p>Status: {item.solved}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-xs text-center py-4">
                    No activity data available
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
