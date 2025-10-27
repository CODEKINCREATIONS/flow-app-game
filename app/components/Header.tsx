"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface HeaderProps {
  playerName: string;
}

export const Header = ({ playerName }: HeaderProps) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <header className="w-full bg-[#0F1125] text-white border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-6 py-4 gap-4">
        {/* Left: Player Name */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400 tracking-wide text-left">
          {playerName}
        </h1>

        {/* Center: Timer */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg ">
            <Clock className="w-5 h-5 text-gray-300 mr-[10px]" />
            <span className="font-mono text-gray-100 font-semibold text-lg">
              {formatTime(time)}
            </span>
          </div>
        </div>

        {/* Right: Language Selector */}
        <div className="flex justify-end">
          <select
            className="p-[10px]
                       text-white rounded-md border border-gray-700
                       px-5 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500
                       hover:border-purple-400 transition-all duration-300"
          >
            <option value="en">EN — English</option>
            <option value="pt">PT — Português</option>
            <option value="fr">FR — Français</option>
          </select>
        </div>
      </div>
    </header>
  );
};
