"use client";

import { useState, useEffect } from "react";
import { SessionDetails } from "@/app/components/SessionDetails";
import { PlayerProgress } from "@/app/components/PlayerProgress";
import { QRModal } from "@/app/components/QRModal";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FacilitatorDashboard() {
  const [time, setTime] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const router = useRouter();

  // ✅ Timer logic
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

          <button
            onClick={() => router.push("/facilitator-login")}
            className=" text-white font-bold bg-gradient-to-r from-[#FF3A3A] to-[#FF6B6B]
              hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,58,58,0.4)]
              transition-all duration-300 border border-[#FF6B6B] border-opacity-30
              px-[26px] py-[12px] ml-[20px]  rounded-[0.3rem] shadow-lg"
          >
            Finish
          </button>

          <button
            onClick={() => setShowQR(!showQR)}
            className=" text-white font-extrabold text-lg bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF]
              hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(123,97,255,0.4)]
              transition-all duration-300 border border-[#7B61FF] border-opacity-30
              px-[32px] py-[12px] ml-[20px]  rounded-[0.3rem] shadow-lg"
          >
            {showQR ? "Hide QR Code" : "Unlock session for players"}
          </button>
        </div>
      </header>

      {/* Body Sections */}
      <div className="space-y-8">
        <SessionDetails />
        <PlayerProgress />
      </div>

      {/* Optional QR Modal */}
    </main>
  );
}
