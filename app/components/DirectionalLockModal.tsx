"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import {
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Delete,
} from "lucide-react";

const lockImg = "/assets/locks/Directional_up_down_red.png";

interface DirectionalLockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  lockImage?: string;
}

const DIRECTION_MAP = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

export default function DirectionalLockModal({
  open,
  onClose,
  onSubmit,
  lockImage,
}: DirectionalLockModalProps) {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState("");

  const handleDirectionClick = (direction: keyof typeof DIRECTION_MAP) => {
    const directionSymbol = DIRECTION_MAP[direction];
    const newInput = input + directionSymbol;
    setInput(newInput);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setInput((prev) => prev.slice(0, -1));
      setError("");
    }
  };

  const handleClear = () => {
    setInput("");
    setError("");
  };

  const handleSubmit = () => {
    if (!input.trim()) {
      setError("Please enter a direction sequence.");
      return;
    }
    onSubmit(input);
    setInput("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="relative rounded-[10px] bg-[#12142A] p-[6px] border border-[#1E2144] text-white shadow-2xl text-center w-[350px]">
        <div className="flex justify-end mb-8 px-2">
          <X
            onClick={onClose}
            className="w-6 h-6 text-gray-400 hover:text-[#7B61FF] transition-colors cursor-pointer"
          />
        </div>

        {/* Lock Image with Directional Buttons Overlay */}
        <div className="flex justify-center mb-8">
          <div className="relative w-[300px] h-[300px] mx-auto">
            <Image
              src={lockImage || lockImg}
              alt="Directional Lock"
              fill
              style={{ objectFit: "contain" }}
              priority
            />

            {/* Up Button */}
            <button
              onClick={() => handleDirectionClick("up")}
              className="absolute top-[140px] left-[145px] transform -translate-x-1/2 bg-[#7B61FF] hover:bg-[#6A50DD] text-transparent p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 opacity-0"
              aria-label="Direction Up"
            >
              <ArrowUp size={18} />
            </button>

            {/* Down Button */}
            <button
              onClick={() => handleDirectionClick("down")}
              className="absolute bottom-[20px] left-[145px] transform -translate-x-1/2 bg-[#7B61FF] hover:bg-[#6A50DD] text-transparent p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 opacity-0"
              aria-label="Direction Down"
            >
              <ArrowDown size={18} />
            </button>

            {/* Left Button */}
            <button
              onClick={() => handleDirectionClick("left")}
              className="absolute left-[70px] top-[205] transform -translate-y-1/2 bg-[#7B61FF] hover:bg-[#6A50DD] text-transparent p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 opacity-0"
              aria-label="Direction Left"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Right Button */}
            <button
              onClick={() => handleDirectionClick("right")}
              className="absolute right-[85px] top-[205px] transform -translate-y-1/2 bg-[#7B61FF] hover:bg-[#6A50DD] text-transparent p-2 rounded-lg shadow-lg transition-transform duration-300 hover:scale-110 opacity-0"
              aria-label="Direction Right"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Selected Code Display */}
        <div className="text-center mb-4 px-4">
          <p className="text-base font-bold text-[#FFFFFF]">{input}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm font-semibold mb-[4px] text-center">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-[5px] mb-[30px]">
          <Button onClick={handleSubmit}>Submit Code</Button>
          <Button
            onClick={() => setInput((prev) => prev.slice(0, -1))}
            disabled={input.length === 0}
            variant="danger"
            className="w-10 h-10 p-0 text-[#ffffff] "
          >
            <Delete size={24} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
