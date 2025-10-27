"use client";

import { useState } from "react";
import { AppLayout } from "@/app/components/layout";
import { SessionDetails } from "@/app/components/SessionDetails";
import { PlayerProgress } from "@/app/components/PlayerProgress";
import { Button } from "@/app/components/ui";
import { useSession } from "@/app/lib/hooks";

export default function FacilitatorDashboard() {
  const [showQR, setShowQR] = useState(false);
  const { endSession, session } = useSession();

  const handleFinish = async () => {
    if (session) {
      await endSession(session.id);
    }
    // Navigation happens via AppHeader logout button
  };

  const customActions = (
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
      {/* Red finish button */}
      <Button variant="danger" onClick={handleFinish}>
        Finish
      </Button>

      {/* Blue unlock button */}
      <Button variant="primary" onClick={() => setShowQR(!showQR)}>
        {showQR ? "Hide QR Code" : "Unlock session"}
      </Button>
    </div>
  );

  return (
    <AppLayout
      headerMode="dashboard"
      showTimer={true}
      customActions={customActions}
    >
      <main className="bg-[#0F1125] text-white px-6 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 space-y-8 font-sans">
        {/* Body */}
        <div className="space-y-8">
          <SessionDetails />
          <PlayerProgress />
        </div>

        {/* Optional QR Modal */}
      </main>
    </AppLayout>
  );
}
