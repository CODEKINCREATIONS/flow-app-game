"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui";
import { useSession } from "@/app/lib/hooks";
import {
  useDashboard,
  type DashboardPlayer,
} from "@/app/lib/hooks/useDashboard";
import { PlayerDetailsDialog } from "@/app/components/PlayerDetailsDialog";

interface PlayerProgressProps {
  sessionCode?: string;
}

export const PlayerProgress = ({
  sessionCode: propSessionCode,
}: PlayerProgressProps = {}) => {
  const { session } = useSession();
  const { players, fetchDashboardData, error, loading } = useDashboard();
  const [selectedPlayer, setSelectedPlayer] = useState<DashboardPlayer | null>(
    null
  );
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(
    null
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Use prop sessionCode as fallback
  const effectiveSessionCode = propSessionCode || session?.code;

  // Fetch data on mount and set up polling
  useEffect(() => {
    if (effectiveSessionCode) {
      // Initial fetch
      fetchDashboardData(effectiveSessionCode);

      // Set up polling for real-time updates
      const interval = setInterval(() => {
        fetchDashboardData(effectiveSessionCode);
      }, 5000); // Poll every 5 seconds

      return () => {
        clearInterval(interval);
      };
    }
  }, [effectiveSessionCode, fetchDashboardData]);

  const solveColor = (solved: boolean | string) => {
    if (typeof solved === "boolean") {
      return solved
        ? "text-[#39FF14] font-semibold"
        : "text-[#FFD60A] font-semibold";
    }

    const solvedStr = String(solved).toLowerCase().trim();

    // Check for solved states
    if (
      solvedStr === "yes" ||
      solvedStr === "solved" ||
      solvedStr === "✔ yes" ||
      solvedStr === "true"
    ) {
      return "text-[#39FF14] font-semibold"; // neon green
    }

    // Check for failed states
    if (solvedStr === "failed" || solvedStr === "no" || solvedStr === "false") {
      return "text-red-400 font-semibold";
    }

    // Check for in progress states
    if (
      solvedStr === "in progress" ||
      solvedStr === "inprogress" ||
      solvedStr === "in-progress"
    ) {
      return "text-[#FFD60A] font-semibold"; // neon yellow
    }

    return "text-gray-300";
  };

  const getSolvedDisplay = (solved: boolean | string) => {
    if (typeof solved === "boolean") {
      return solved ? "✔ Yes" : "In Progress";
    }

    const solvedStr = String(solved).toLowerCase().trim();
    if (solvedStr === "yes" || solvedStr === "true") {
      return "✔ Yes";
    }
    if (solvedStr === "no" || solvedStr === "false") {
      return "✗ No";
    }

    return String(solved);
  };

  // Sample riddle data for demo
  const getRiddleData = () => [
    {
      id: 1,
      name: "Riddle 1: Logic Puzzle",
      visited: true,
      solved: true,
      attempts: 2,
    },
    {
      id: 2,
      name: "Riddle 2: Code Challenge",
      visited: true,
      solved: false,
      attempts: 1,
    },
    {
      id: 3,
      name: "Riddle 3: Pattern Match",
      visited: false,
      solved: false,
      attempts: 0,
    },
  ];

  const handleViewPlayer = (player: DashboardPlayer, index: number) => {
    setSelectedPlayer(player);
    setSelectedPlayerIndex(index + 1); // API expects 1-based index
    setShowDetailsDialog(true);
  };

  // Use real players from API, or fall back to empty if loading
  const displayPlayers = players && players.length > 0 ? players : [];

  // Show error state
  if (error && !loading) {
    return (
      <div className="bg-[#0D0F1A] text-white rounded-[0.8rem] border border-[#23263A] shadow-lg p-[10px] mx-auto max-w-7xl">
        <div className="mb-[6px]">
          <h2 className="text-xs sm:text-sm md:text-base font-semibold text-[#7CE3FF] border-l-4 border-[#7B61FF] pl-[8px]">
            Player Progress
          </h2>
        </div>
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">Error loading player data:</p>
          <p className="text-red-300 text-xs mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && displayPlayers.length === 0) {
    return (
      <div className="bg-[#0D0F1A] text-white rounded-[0.8rem] border border-[#23263A] shadow-lg p-[10px] mx-auto max-w-7xl">
        <div className="mb-[6px]">
          <h2 className="text-xs sm:text-sm md:text-base font-semibold text-[#7CE3FF] border-l-4 border-[#7B61FF] pl-[8px]">
            Player Progress
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B61FF]"></div>
          <p className="ml-3 text-gray-400">Loading player data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0F1A] text-white rounded-[0.8rem] border border-[#23263A] shadow-lg p-[10px] mx-auto max-w-7xl overflow-x-auto">
      <div className="mb-[6px]">
        <h2 className="text-xs sm:text-sm md:text-base font-semibold text-[#7CE3FF] border-l-4 border-[#7B61FF] pl-[8px] sticky left-0">
          Player Progress
        </h2>
      </div>

      <div className="min-w-[650px]">
        <table className="w-full text-left border-collapse text-base sm:text-lg">
          <thead>
            <tr className="text-gray-300 border-b border-[#2A2D3D]">
              <th className="py-[10px] px-4 my-[2px] font-semibold">Name</th>
              <th className="py-[10px] px-4 my-[2px] font-semibold">
                Active Box
              </th>
              <th className="py-[10px] px-4 my-[2px] font-semibold">Attempt</th>
              <th className="py-[10px] px-4 my-[2px] font-semibold">Solved</th>
              <th className="py-[10px] px-4 my-[2px] font-semibold ">Action</th>
            </tr>
          </thead>

          <tbody>
            {displayPlayers.length > 0 ? (
              displayPlayers.map((p: DashboardPlayer, index: number) => (
                <tr
                  key={p.id || p.playerId}
                  className="border-b border-[#1F2130] bg-[#0D0F1A] hover:bg-[#081025] transition-all duration-200"
                >
                  <td className="py-4 px-4 text-[#D1D5DB] font-medium">
                    {(p.name || p.playerName || "Unknown") as string}
                  </td>
                  <td className="py-4 px-4 text-[#D1D5DB]">
                    {String(p.activeRiddle ?? p.riddleAccess ?? "—")}
                  </td>
                  <td className="py-4 px-4 text-[#D1D5DB]">
                    {String(p.attempt ?? p.attempts ?? "—")}
                  </td>
                  <td className={`py-4 px-4 ${solveColor(p.solved)}`}>
                    {getSolvedDisplay(p.solved)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Button
                      variant="neon"
                      className="!px-6 !py-2 text-sm hover:scale-105 transition-transform"
                      onClick={() => handleViewPlayer(p, index)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 px-4 text-center text-gray-400 text-xs"
                >
                  No players joined yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Player Details Dialog */}
      {selectedPlayer && selectedPlayerIndex !== null && (
        <PlayerDetailsDialog
          open={showDetailsDialog}
          onClose={() => {
            setShowDetailsDialog(false);
            setSelectedPlayer(null);
            setSelectedPlayerIndex(null);
          }}
          playerName={String(selectedPlayer.name || selectedPlayer.playerName)}
          playerEmail={String(selectedPlayer.email || "")}
          riddleData={getRiddleData()}
          sessionCode={effectiveSessionCode}
          playerId={selectedPlayerIndex} // Pass numeric index (1, 2, 3, etc.)
        />
      )}
    </div>
  );
};
