"use client";

import { X } from "lucide-react";
import { Button } from "@/app/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/components/ui/dialog";

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
}

export const PlayerDetailsDialog = ({
  open,
  onClose,
  playerName,
  playerEmail,
  riddleData,
}: PlayerDetailsDialogProps) => {
  const totalRiddles = riddleData.length;
  const solvedRiddles = riddleData.filter((r) => r.solved).length;
  const visitedRiddles = riddleData.filter((r) => r.visited).length;

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

        {/* Content */}
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
                <p className="text-gray-400 text-xs">Riddles Solved</p>
              </div>
              <div className="bg-[#1A1C2A] border border-[#23263A] rounded-[10px] p-[8px] text-center hover:border-[#7B61FF] transition-colors cursor-pointer">
                <div className="text-lg font-bold text-[#3A8DFF] mb-[4px]">
                  {visitedRiddles}
                </div>
                <p className="text-gray-400 text-xs">Riddles Visited</p>
              </div>
              <div className="bg-[#1A1C2A] border border-[#23263A] rounded-[10px] p-[8px] text-center hover:border-[#7B61FF] transition-colors cursor-pointer">
                <div className="text-lg font-bold text-[#FFD60A] mb-[4px]">
                  {totalRiddles}
                </div>
                <p className="text-gray-400 text-xs">Total Riddles</p>
              </div>
            </div>
          </div>

          {/* Riddle Journey */}
          <div className="mb-[8px]">
            <h3 className="text-xs font-semibold text-[#7CE3FF] mb-[6px] border-l-4 border-[#7B61FF] pl-[8px]">
              Riddles
            </h3>
            <div className="space-y-[4px]">
              {riddleData.map((riddle) => (
                <div
                  key={riddle.id}
                  className="p-[8px] bg-[#1A1C2A] border border-[#23263A] rounded-[10px] hover:border-[#7B61FF] transition-colors"
                >
                  <div className="flex gap-[6px] items-start">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-[2px] ${
                        riddle.solved
                          ? "bg-[#39FF14] text-[#0D0F1A]"
                          : riddle.visited
                          ? "bg-[#FFD60A] text-[#0D0F1A]"
                          : "bg-[#2A2D3D] text-gray-400"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-xs line-clamp-2">
                        {riddle.name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-[6px] ml-[22px] text-gray-400 text-xs space-y-[2px]">
                    <p>Attempts: {riddle.attempts}</p>
                    <p>
                      Status:{" "}
                      {riddle.solved
                        ? "Solved"
                        : riddle.visited
                        ? "Visited"
                        : "Not Visited"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
