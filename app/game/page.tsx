"use client";

import { useState } from "react";
import { AppLayout } from "@/app/components/layout";
import { Button } from "@/app/components/ui";
import { useAuth, useGame } from "@/app/lib/hooks";
import Image from "next/image";

export default function PlayerGamePage() {
  const [selectedChest, setSelectedChest] = useState<number | null>(null);
  const [code, setCode] = useState(["", "", ""]);
  const { user, isPlayer } = useAuth();
  const { chests, unlockChest, setCurrentChest } = useGame();

  // Handle code change
  const handleCodeChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedChest || !user) return;

    const codeString = code.join("");
    if (codeString.length === 3) {
      const result = await unlockChest(selectedChest, user.id, codeString);
      if (result.success) {
        setSelectedChest(null);
        setCode(["", "", ""]);
      }
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
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8 md:space-y-10 bg-[#0F1125]">
        {/* Centered Video Button */}
        <div className="flex justify-center mb-4 sm:mb-6 md:mb-[10px]">
          <Button className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all text-sm sm:text-base">
            View Video
            <Image
              className="ml-2"
              src="/assets/video-icon.png"
              alt="View Video"
              width={22}
              height={22}
            />
          </Button>
        </div>

        {/* Chest Cards Grid - Responsive: 2 cols (mobile), 3 cols (tablet), 4 cols (desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-[15px] justify-items-center px-2 sm:px-4 md:px-0">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={index}
              onClick={() => setSelectedChest(index)}
              className="bg-[#1A1C33] rounded-xl rounded-[0.8rem] flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] cursor-pointer"
            >
              <Image
                src="/assets/chest-closed.png"
                alt={`Chest ${index + 1}`}
                width={280}
                height={280}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
