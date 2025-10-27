"use client";

import { useState } from "react";
import { Header } from "@/app/components/Header";
import Button from "@/app/components/ui/Button";
import Image from "next/image";

export default function PlayerGamePage() {
  const [selectedChest, setSelectedChest] = useState<number | null>(null);
  const [code, setCode] = useState(["", "", ""]);

  // Handle code change
  const handleCodeChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }
  };

  // Handle submit
  const handleSubmit = () => {
    alert(`Chest ${selectedChest! + 1} code: ${code.join("")}`);
    setSelectedChest(null);
    setCode(["", "", ""]);
  };

  return (
    <main className="min-h-screen bg-[#0F1125] text-white flex flex-col">
      {/* Header */}
      <Header playerName="John Doe" />

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Centered Video Button */}
        <div className="grid grid-cols-3 w-full">
          <div></div>
          <div className="flex justify-center mb-[10px]">
            <Button className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all mt-[20px]">
              View Video
              <Image
                className="ml-[10px] "
                src="/assets/video-icon.png"
                alt="View Video"
                width={22}
                height={22}
              />
            </Button>
          </div>
          <div></div>
        </div>

        {/* 🔹 16 Chest Cards (4 per row) */}
        <div className="grid grid-cols-4 gap-[15px] justify-items-center m-[20px]">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={index}
              onClick={() => setSelectedChest(index)} // 👈 open modal
              className="bg-[#1A1C33] rounded-xl rounded-[0.8rem] flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300 w-full h-[240px] cursor-pointer"
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
    </main>
  );
}
