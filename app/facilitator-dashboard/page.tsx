"use client";

import { useState, useEffect } from "react";
import { SessionDetails } from "@/app/components/SessionDetails";
import { PlayerProgress } from "@/app/components/PlayerProgress";
import { QRModal } from "@/app/components/QRModal";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button"; // ✅ import

export default function FacilitatorDashboard() {
  const [time, setTime] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <main className="min-h-screen bg-[#0F1125] text-white px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wide text-white">
          Facilitator Dashboard
        </h1>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="text-purple-400 w-5 h-5 mr-[4px]" />
            <span className="font-mono text-sm">{formatTime(time)}</span>
          </div>

          {/* ✅ Red finish button */}
          <Button
            variant="danger"
            onClick={() => router.push("/facilitator-login")}
          >
            Finish
          </Button>

          {/* ✅ Blue unlock button */}
          <Button variant="primary" onClick={() => setShowQR(!showQR)}>
            {showQR ? "Hide QR Code" : "Unlock session for players"}
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="space-y-8">
        <SessionDetails />
        <PlayerProgress />
      </div>

      {/* Optional QR Modal */}
    </main>
  );
}
