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
    <AppLayout
      headerMode="game"
      playerName={playerName}
      showTimer={true}
      showLanguage={true}
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Centered Video Button */}
        <div className="grid grid-cols-3 w-full">
          <div></div>

          <div></div>
          <div></div>
          <div className="flex justify-center mb-[10px]">
            <Button className=" sm:w-2/3 md:w-1/2 lg:w-1/3 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all mt-[20px]">
              View Video
              <Image
                className="ml-[10px] mr-[20px]"
                src="/assets/video-icon.png"
                alt="View Video"
                width={22}
                height={22}
              />
            </Button>
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
              className="
                bg-[#1A1C33]
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
              "
            >
              <Image
                src="/assets/chest-closed.png"
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
    </AppLayout>
  );
}
