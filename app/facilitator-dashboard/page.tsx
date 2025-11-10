"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/app/components/layout";
import { SessionDetails } from "@/app/components/SessionDetails";
import { PlayerProgress } from "@/app/components/PlayerProgress";
import { Button } from "@/app/components/ui";
import { useSession } from "@/app/lib/hooks";
import { useTimerContext } from "@/app/lib/context/TimerContext";
import { useAuth } from "@/app/lib/hooks";
import QRCodeDialog from "@/app/components/QRCodeDialog"; // import your existing dialog
import { QrCode } from "lucide-react";

export default function FacilitatorDashboard() {
  const [showQR, setShowQR] = useState(false);
  const { endSession, session } = useSession();
  const { start } = useTimerContext();
  const { user } = useAuth();

  // Reset QR dialog when session changes
  useEffect(() => {
    if (!session) {
      setShowQR(false);
    }
  }, [session]);

  const handleFinish = async () => {
    if (session) {
      await endSession(session.id);
    }
    window.location.href = "/facilitator-login";
  };

  const [isSessionUnlocked, setIsSessionUnlocked] = useState(false);

  const handleUnlock = async () => {
    if (!isSessionUnlocked) {
      // Unlock the session for players: start timer and show QR
      setIsSessionUnlocked(true);
      console.log("Unlock button clicked");
      start();
      setShowQR(true);
      console.log(
        "Opening QR Dialog",
        session ? `with session: ${session.id}` : "without active session"
      );
      return;
    }

    // If already unlocked, treat click as Finish (end session)
    await handleFinish();
  };

  // no header action for unlocking/finishing — control lives in the page buttons below

  return (
    <>
      {/* Full-viewport fixed background so it sits under header/footer */}
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
        headerMode="dashboard"
        showTimer={true}
        transparentBackground={true}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 space-y-8 font-sans mx-[30px] min-h-screen">
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-4 mb-6 mt-[15px]">
            <Button
              variant="white"
              onClick={() => setShowQR(true)}
              className="!h-11 flex items-center justify-center gap-2 !text-sm font-medium bg-white shadow-sm hover:bg-gray-50 !px-5 whitespace-nowrap order-2 sm:order-1"
            >
              <QrCode className="w-5 h-5 mr-[5px] " />
              <span>QR Code</span>
            </Button>
            <Button
              variant={isSessionUnlocked ? "danger" : "primary"}
              onClick={handleUnlock}
              className="!h-14 flex items-center justify-center gap-2 mr-[5px] !text-base font-medium !px-6 whitespace-nowrap ml-[10px] order-1 sm:order-2"
            >
              <span>
                {isSessionUnlocked
                  ? "Finish Session"
                  : "Unlock Session for Players"}
              </span>
            </Button>
          </div>

          {/* Body */}
          <div className="space-y-8">
            <div className="mb-[20px] mt-[20px]">
              <SessionDetails />
            </div>

            <PlayerProgress />
          </div>
        </main>

        {/* QR Code Dialog */}
        <QRCodeDialog
          open={showQR}
          onClose={() => {
            console.log("Closing QR Dialog");
            setShowQR(false);
          }}
          sessionCode={session?.code || session?.id || "demo-session"}
        />
      </AppLayout>
    </>
  );
}
