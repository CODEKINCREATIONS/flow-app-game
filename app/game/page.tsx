"use client";

import { useState } from "react";
import { AppLayout } from "@/app/components/layout";
import { Button } from "@/app/components/ui";
import { useAuth, useGame } from "@/app/lib/hooks";
import Image from "next/image";
import CodeEntryModal from "@/app/components/CodeEntryModal"; // import modal

export default function PlayerGamePage() {
  const [selectedChest, setSelectedChest] = useState<number | null>(null);
  const { user, isPlayer } = useAuth();
  const { chests, unlockChest, setCurrentChest } = useGame();

  // Generate random chest states (8 open, 8 closed)
  const [randomOpenChests] = useState(() => {
    const shuffled = Array.from({ length: 16 }, (_, i) => i).sort(
      () => Math.random() - 0.5
    );
    return shuffled.slice(0, 8); // Take first 8 indices for open chests
  });

  // Handle chest click
  const handleChestClick = (index: number) => {
    setSelectedChest(index);
    setCurrentChest(index);
  };

  // Handle code submit
  const handleSubmitCode = async (code: string) => {
    if (selectedChest === null || !user) return;

    const result = await unlockChest(selectedChest, user.id, code);
    if (result.success) {
      setSelectedChest(null);
    }
  };

  const playerName =
    isPlayer && user && "name" in user ? (user.name as string) : "Player";

  return (
    <>
      {/* Full-viewport background (covers header too) */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: "url('/assets/Background%20img_gme-dashboard.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      />
      <AppLayout
        headerMode="game"
        playerName={playerName}
        showTimer={true}
        showLanguage={true}
        transparentBackground={true}
      >
        <div className="w-full min-h-screen">
          <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
            {/* Progress Bar */}
            <div className="w-full px-0 py-4 mt-[40px] ">
              <div className="relative w-full h-[20px] bg-[#0F1125] border-2 border-[#3A8DFF]/50 my-[5px]">
                <div
                  className="h-full bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] transition-all duration-500 ease-in-out relative"
                  style={{
                    width: `${(randomOpenChests.length / 16) * 100}%`,
                  }}
                >
                  {/* Percentage text on progress bar */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold text-sm">
                    50%
                  </div>
                </div>
                {/* Progress Circle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-[70px] h-[70px] bg-[#0F1125] rounded-full border-[2px] border-[#3A8DFF] flex items-center justify-center transition-all duration-500 ease-in-out overflow-visible"
                  style={{
                    left: `calc(${
                      (randomOpenChests.length / 16) * 100
                    }% - 45px)`,
                    boxShadow: "0 0 30px rgba(58,141,255,0.8)",
                  }}
                >
                  <div className="w-[45px] h-[45px] rounded-full bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF]" />
                  <div className="absolute text-white font-bold text-lg">
                    50%
                  </div>
                </div>
              </div>
              {/* Boxes opened text below progress bar */}
              <div className="flex justify-center items-center text-lg m-[45px]">
                <span className="text-[#FFFFFF] font-['Orbitron'] tracking-wide text-center">
                  Unlocked: {randomOpenChests.length}/16 Boxes
                </span>
              </div>
            </div>

            <div
              className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            justify-items-center
            
          "
            >
              {Array.from({ length: 16 }).map((_, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedChest(index)} // 👈 open modal
                  className={`
                ${
                  randomOpenChests.includes(index)
                    ? "bg-[#00ff8c]/20"
                    : "bg-[#ff0000]/20"
                }
                rounded-xl
                flex
                items-center
                justify-center
                shadow-lg
                hover:scale-105
                transition-transform
                duration-300
                cursor-pointer
                w-full
                max-w-[350px]
                h-[180px]
                sm:h-[200px]
                md:h-[220px]
                lg:h-[240px]
                m-[10px]
                rounded-[0.3rem]
                ${
                  randomOpenChests.includes(index)
                    ? "shadow-[0_0_15px_rgba(0,255,140,0.2)]"
                    : "shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                }
              `}
                >
                  <Image
                    src={
                      randomOpenChests.includes(index)
                        ? "/assets/chest-open.png"
                        : "/assets/chest-closed.png"
                    }
                    alt={`Chest ${index + 1}`}
                    width={220}
                    height={220}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Code Entry Modal */}
            {selectedChest !== null && (
              <CodeEntryModal
                open={selectedChest !== null}
                onClose={() => setSelectedChest(null)}
                onSubmit={handleSubmitCode}
              />
            )}
          </div>
        </div>
      </AppLayout>
    </>
  );
}
