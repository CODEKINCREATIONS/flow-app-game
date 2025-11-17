"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/app/components/layout";
import { Button } from "@/app/components/ui";
import { useAuth, useGame } from "@/app/lib/hooks";
import Image from "next/image";
import { Video, Check, HelpCircle } from "lucide-react";
import CodeEntryModal from "@/app/components/CodeEntryModal"; // import modal
import VideoDialog from "@/app/components/VideoDialog"; // import video dialog

export default function PlayerGamePage() {
  const [selectedChest, setSelectedChest] = useState<number | null>(null);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPassword, setVideoPassword] = useState("");
  const [unlockedChests, setUnlockedChests] = useState<number[]>([]);
  const { user, isPlayer } = useAuth();
  const { chests, unlockChest, setCurrentChest } = useGame();

  // Fetch video configuration from API
  useEffect(() => {
    const fetchVideoConfig = async () => {
      try {
        const response = await fetch("/api/game/video-config");
        const data = await response.json();
        setVideoUrl(data.videoUrl || "");
        setVideoPassword(data.password || "");
      } catch (error) {
        console.error("Failed to fetch video configuration:", error);
      }
    };

    fetchVideoConfig();
  }, []);

  // Handle chest click
  const handleChestClick = (index: number) => {
    setSelectedChest(index);
    setCurrentChest(index);
  };

  // Handle code submit
  const handleSubmitCode = (code: string) => {
    if (selectedChest === null) return;

    // Add the unlocked chest to the state
    setUnlockedChests((prev) => {
      if (!prev.includes(selectedChest)) {
        return [...prev, selectedChest];
      }
      return prev;
    });
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
              <div className="relative w-full h-[20px] bg-[#0F1125] border-2 border-[#3A8DFF] my-[5px]">
                <div
                  className="h-full bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] transition-all duration-500 ease-in-out relative"
                  style={{
                    width: `${(unlockedChests.length / 16) * 100}%`,
                  }}
                >
                  {/* Percentage text on progress bar
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold text-sm">
                    50%
                  </div> */}
                </div>
                {/* Progress Circle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-[#0F1125]  mt-[15px] mb-[60px] rounded-full border-[2px] border-[#3A8DFF] flex items-center justify-center transition-all duration-500 ease-in-out overflow-visible"
                  style={{
                    left: `calc(${(unlockedChests.length / 16) * 100}% - 50px)`,
                    boxShadow: "0 0 30px #3A8DFF",
                  }}
                >
                  <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF]" />
                  <div className="absolute text-white font-bold text-2xl px-6">
                    {Math.round((unlockedChests.length / 16) * 100)}%
                  </div>
                </div>
              </div>
              {/* Boxes opened text below progress bar */}
              <div className="flex flex-wrap gap-[20px] w-full px-4 justify-center items-center mt-[60px]">
                {/* Left Button - Unlocked */}
                <Button
                  variant="primary"
                  className="!px-4 sm:!px-6 md:!px-8 !py-2 sm:!py-3 md:!py-4 mb-[20px] !text-sm sm:!text-base md:!text-lg font-['Orbitron'] tracking-wider font-bold !border-[#FFFFFF] [&>span]:!text-[#FFFFFF] !shadow-none !ring-0 !transition-none hover:!shadow-none hover:!scale-100"
                >
                  Unlocked: {unlockedChests.length}/16 Boxes
                </Button>

                {/* Right Button - Video */}
                <Button
                  variant="primary"
                  onClick={() => setShowVideoDialog(true)}
                  className="!px-4 sm:!px-6 md:!px-8 !py-2 sm:!py-3 md:!py-4  mb-[24px] !text-sm sm:!text-base md:!text-lg font-['Orbitron'] tracking-wider font-bold !border-[#FFFFFF] [&>span]:!text-[#FFFFFF] hover:shadow-[0_0_20px_rgba(123,97,255,0.6)] hover:!scale-[1.05] transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2 ">
                    <Video size={25} />
                    <span className="ml-[5px]">Watch Video</span>
                  </div>
                </Button>
              </div>
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
                      <Check size={40} className="text-white" strokeWidth={4} />
                    </div>
                  )}
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

            {/* Video Dialog */}
            <VideoDialog
              open={showVideoDialog}
              onClose={() => setShowVideoDialog(false)}
              videoUrl={videoUrl}
              password={videoPassword}
            />
          </div>
        </div>
      </AppLayout>
    </>
  );
}
