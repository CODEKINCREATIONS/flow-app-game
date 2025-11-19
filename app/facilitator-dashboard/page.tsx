"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/app/components/layout";
import { SessionDetails } from "@/app/components/SessionDetails";
import { PlayerProgress } from "@/app/components/PlayerProgress";
import { Button } from "@/app/components/ui";
import { useSession } from "@/app/lib/hooks";
import { useTimerContext } from "@/app/lib/context/TimerContext";
import { useAuth } from "@/app/lib/hooks";
import { useQueryStringSession } from "@/app/lib/hooks";
import QRCodeDialog from "@/app/components/QRCodeDialog"; // import your existing dialog
import { QrCode } from "lucide-react";

function FacilitatorDashboardContent() {
  const [showQR, setShowQR] = useState(false);
  const { endSession, session } = useSession();
  const { start } = useTimerContext();
  const { user } = useAuth();
  const router = useRouter();
  const {
    isVerifying,
    isVerified,
    error: verificationError,
    sessionCode,
    verifyFromQueryString,
    redirectToError,
  } = useQueryStringSession();

  const [sessionVerificationChecked, setSessionVerificationChecked] =
    useState(false);

  // Verify session from query string on component mount
  useEffect(() => {
    if (!sessionVerificationChecked) {
      const checkSession = async () => {
        const isValid = await verifyFromQueryString();

        setSessionVerificationChecked(true);

        // If session code was in URL but verification failed, redirect to error page
        if (sessionCode && !isValid) {
          redirectToError(verificationError || "Invalid session code");
        }
      };

      checkSession();
    }
  }, [
    sessionVerificationChecked,
    verifyFromQueryString,
    sessionCode,
    redirectToError,
    verificationError,
  ]);

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

  // Show loading state while verifying session
  if (isVerifying) {
    return (
      <AppLayout
        headerMode="dashboard"
        showTimer={true}
        transparentBackground={true}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B61FF] mx-auto mb-4"></div>
            <p className="text-lg">Verifying session...</p>
          </div>
        </main>
      </AppLayout>
    );
  }

  // Handle case where session code was provided but verification failed
  if (sessionCode && !isVerified && verificationError) {
    return (
      <AppLayout
        headerMode="dashboard"
        showTimer={true}
        transparentBackground={true}
      >
        <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 mb-6">
              <p className="text-red-400 mb-2">Session Verification Failed</p>
              <p className="text-sm text-gray-300">{verificationError}</p>
            </div>
            <Button
              variant="primary"
              onClick={() =>
                redirectToError(verificationError || "Invalid session")
              }
              className="!px-6 !py-2"
            >
              Go to Error Page
            </Button>
          </div>
        </main>
      </AppLayout>
    );
  }

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
          <div className="flex flex-wrap justify-center sm:justify-end gap-6 mb-[6px] mt-[15px]">
            <div className="flex gap-[4px] order-2 sm:order-1 mb-[4px] sm:mb-0">
              <Button
                variant="white"
                onClick={() => setShowQR(true)}
                className="!h-11 flex items-center justify-center mr-[5px] ml-[5px] !text-sm font-medium bg-white shadow-sm hover:bg-gray-50 !px-6 whitespace-nowrap"
              >
                <QrCode className="w-5 h-5 mr-[5px]" />
                <span>QR Code</span>
              </Button>
            </div>
            <Button
              variant={isSessionUnlocked ? "danger" : "primary"}
              onClick={handleUnlock}
              className="!h-14 flex items-center justify-center gap-2 !text-base font-medium !px-8 whitespace-nowrap order-1 mb-[5px] sm:order-2"
            >
              <span style={{ color: "white" }}>
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

export default function FacilitatorDashboard() {
  return (
    <Suspense
      fallback={
        <AppLayout
          headerMode="dashboard"
          showTimer={true}
          transparentBackground={true}
        >
          <main className="text-white px-4 sm:px-8 md:px-10 lg:px-12 py-6 sm:py-8 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7B61FF] mx-auto mb-4"></div>
              <p className="text-lg">Loading dashboard...</p>
            </div>
          </main>
        </AppLayout>
      }
    >
      <FacilitatorDashboardContent />
    </Suspense>
  );
}
