"use client";

import { useState } from "react";
import { AppLayout } from "@/app/components/layout";
import { Button } from "@/app/components/ui";
import { useAuth } from "@/app/lib/hooks";
import Image from "next/image";
import { Video, Check, HelpCircle } from "lucide-react";
import NumericLockModal from "@/app/components/NumericLockModal";
import DirectionalLockModal from "@/app/components/DirectionalLockModal";
import WordLockModal from "@/app/components/WordLockModal";
import NumericV1Modal from "@/app/components/NumericV1Modal";
import NumericV2Modal from "@/app/components/NumericV2Modal";
import WordMLModal from "@/app/components/WordMLModal";
import VideoDialog from "@/app/components/VideoDialog";
import ProgressBar from "@/app/components/ProgressBar";
import {
  getLockImageForBox,
  getLockTypeForBox,
} from "@/app/lib/config/lockConfig";

export default function PlayerGamePage() {
  const [selectedChest, setSelectedChest] = useState<number | null>(null);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [unlockedChests, setUnlockedChests] = useState<number[]>([]);
  const [submittedCodes, setSubmittedCodes] = useState<{
    [key: number]: string;
  }>({});
  const { user, isPlayer } = useAuth();

  const handleSubmitCode = (code: string) => {
    if (selectedChest === null) return;

    setUnlockedChests((prev) => {
      if (!prev.includes(selectedChest)) {
        return [...prev, selectedChest];
      }
      return prev;
    });

    // Store the submitted code
    setSubmittedCodes((prev) => ({
      ...prev,
      [selectedChest]: code,
    }));
  };

  const playerName =
    isPlayer && user && "name" in user ? (user.name as string) : "Player";

  return (
    <>
      {/* Full-viewport background (covers header too) */}
      <div
        className="fixed w-screen h-screen bg-cover bg-center bg-no-repeat -z-10"
        style={{
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
            <ProgressBar unlockedChests={unlockedChests} />

            {/* Buttons Container */}
            <div className="flex flex-wrap gap-[20px] w-full px-4 justify-center items-center mt-[60px] mb-[10px]">
              {/* Unlocked Boxes Display */}
              <div className="border-0 px-[35px] py-[16px] rounded-[0.35rem] text-[#5d3eff] font-['Orbitron'] tracking-wider rounded-xl bg-[#FFFFFF]">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  Unlocked: {unlockedChests.length}/16 Boxes
                </span>
              </div>

              {/* Video Button */}
              <Button
                variant="primary"
                onClick={() => setShowVideoDialog(true)}
                className="!px-4 sm:!px-6 md:!px-8 !py-2 sm:!py-3 md:!py-4 !text-sm sm:!text-base md:!text-lg font-['Orbitron'] tracking-wider !border-[#FFFFFF] hover:shadow-[0_0_20px_rgba(123,97,255,0.6)] hover:!scale-[1.05]"
              >
                <div className="flex items-center justify-center gap-2 ">
                  <Video size={25} />
                  <span className="ml-[5px]">Watch Video</span>
                </div>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
              {Array.from({ length: 16 }).map((_, index) => (
                <div
                  key={index}
                  onClick={() => {
                    // Only open modal if chest is not already unlocked
                    if (!unlockedChests.includes(index)) {
                      setSelectedChest(index);
                    }
                  }}
                  className={`
                relative
                ${
                  unlockedChests.includes(index)
                    ? "bg-gradient-to-r from-[#FF3A3A]/20 to-[#FF6B6B]/0"
                    : "bg-gradient-to-r from-[#7B61FF]/20 to-[#3A8DFF]/0"
                }
                rounded-xl
                flex
                items-center
                justify-center
                shadow-lg
                hover:scale-105 
                transition-transform
                duration-300
                ${
                  !unlockedChests.includes(index)
                    ? "cursor-pointer"
                    : "cursor-default"
                }
                w-full
                max-w-[350px]
                h-[180px]
                sm:h-[200px]
                md:h-[220px]
                lg:h-[240px]
                m-[10px]
                rounded-[1rem]
                border-1 border-white
                overflow-visible
                ${
                  unlockedChests.includes(index)
                    ? "shadow-[0_0_15px_rgba(0,255,140,0.4)]"
                    : "shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                }
              `}
                >
                  <Image
                    src={
                      unlockedChests.includes(index)
                        ? "/assets/chest-open.png"
                        : "/assets/chest-closed.png"
                    }
                    alt={`Chest ${index + 1}`}
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                  <div className="absolute top-[15px] left-[15px] z-50 text-white font-black text-lg bg-black bg-opacity-50 px-2 py-1 rounded">
                    Box {index + 1}
                  </div>
                  {!unlockedChests.includes(index) && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        width: "56px",
                        height: "56px",
                        backgroundColor: "#ef4444",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                        border: "3px solid #dc2626",
                      }}
                    >
                      <HelpCircle
                        size={36}
                        className="text-white"
                        strokeWidth={2}
                      />
                    </div>
                  )}
                  {unlockedChests.includes(index) && (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          width: "56px",
                          height: "56px",
                          backgroundColor: "#22c55e",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                          border: "3px solid #16a34a",
                        }}
                      >
                        <Check
                          size={40}
                          className="text-white"
                          strokeWidth={4}
                        />
                      </div>
                      <div className="absolute bottom-[15px] right-[15px] z-50">
                        <div className="rounded-[5px] px-[3px] py-[3px] bg-[#00D9FF]">
                          <span
                            className="text-[#FFFFFF] text-xl sm:text-2xl font-black tracking-widest drop-shadow-lg"
                            style={{ fontWeight: 900 }}
                          >
                            {submittedCodes[index] || "N/A"}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Lock Modals - Render based on lock type */}
            {selectedChest !== null &&
              (() => {
                const lockType = getLockTypeForBox(selectedChest);
                const lockImage = getLockImageForBox(selectedChest);

                switch (lockType) {
                  case "numeric":
                    return (
                      <NumericLockModal
                        open={true}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                      />
                    );
                  case "directional":
                    return (
                      <DirectionalLockModal
                        open={true}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                      />
                    );
                  case "numericV1":
                    return (
                      <NumericV1Modal
                        open={true}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                      />
                    );
                  case "word":
                    return (
                      <WordLockModal
                        open={true}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                      />
                    );
                  case "numericV2":
                    return (
                      <NumericV2Modal
                        open={true}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                      />
                    );
                  case "wordML":
                    return (
                      <WordMLModal
                        open={true}
                        onClose={() => setSelectedChest(null)}
                        onSubmit={handleSubmitCode}
                        lockImage={lockImage}
                      />
                    );
                  default:
                    return null;
                }
              })()}

            {/* Video Dialog */}
            <VideoDialog
              open={showVideoDialog}
              onClose={() => setShowVideoDialog(false)}
              videoUrl="/assets/language_Videos/English.mp4"
              password=""
            />
          </div>
        </div>
      </AppLayout>
    </>
  );
}
