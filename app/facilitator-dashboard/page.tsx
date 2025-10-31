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

  const handleUnlock = () => {
    console.log("Unlock button clicked");
    // start countdown timer and show QR code
    start();
    setShowQR(true);
    console.log(
      "Opening QR Dialog",
      session ? `with session: ${session.id}` : "without active session"
    );
  };

  const headerActions = (
    <Button variant="danger" onClick={handleFinish} className="!px-4 !py-2">
      Finish
    </Button>
  );

  return (
    <AppLayout
      headerMode="dashboard"
      showTimer={true}
      customActions={headerActions}
    >
      <main className="bg-[#0F1125] text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 space-y-8 font-sans mx-[30px]">
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-6 mt-[15px]">
          <Button
            variant="white"
            onClick={() => setShowQR(true)}
            className="!h-14 flex items-center justify-center gap-2 !text-base font-medium bg-white shadow-sm hover:bg-gray-50 !px-6  whitespace-nowrap"
          >
            <QrCode className="w-5 h-5 mr-[5px] " />
            <span>QR Code</span>
          </Button>
          <Button
            variant="primary"
            onClick={handleUnlock}
            className="!h-14 flex items-center justify-center gap-2 !text-base font-medium !px-6  whitespace-nowrap ml-[10px]"
          >
            <span>Unlock Session for Players</span>
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
  );
}
