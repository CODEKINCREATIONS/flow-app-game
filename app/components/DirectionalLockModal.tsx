"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface DirectionalLockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  lockImage: string;
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
      <DialogContent className="relative rounded-[10px] bg-[#12142A] p-[30px] border border-[#1E2144] text-white shadow-2xl text-center w-[420px]">
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
              src={lockImage}
              alt="Directional Lock"
              fill
              style={{ objectFit: "contain" }}
              priority
            />

            {/* Up Button */}
            <button
              onClick={() => handleDirectionClick("up")}
              className="absolute top-[150px] left-[150px] transform -translate-x-1/2 bg-transparent hover:bg-transparent text-transparent p-2 rounded-lg shadow-none transition-transform duration-300 hover:scale-110 opacity-0"
              aria-label="Direction Up"
            >
              <ArrowUp size={18} />
            </button>

            {/* Down Button */}
            <button
              onClick={() => handleDirectionClick("down")}
              className="absolute bottom-[30px] left-[150px] transform -translate-x-1/2 bg-transparent hover:bg-transparent text-transparent p-2 rounded-lg shadow-none transition-transform duration-300 hover:scale-110 opacity-0"
              aria-label="Direction Down"
            >
              <ArrowDown size={18} />
            </button>

            {/* Left Button */}
            <button
              onClick={() => handleDirectionClick("left")}
              className="absolute left-[80px] top-[205] transform -translate-y-1/2 bg-transparent hover:bg-transparent text-transparent p-2 rounded-lg shadow-none transition-transform duration-300 hover:scale-110 opacity-0"
              aria-label="Direction Left"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Right Button */}
            <button
              onClick={() => handleDirectionClick("right")}
              className="absolute right-[85px] top-[205px] transform -translate-y-1/2 bg-transparent hover:bg-transparent text-transparent p-2 rounded-lg shadow-none transition-transform duration-300 hover:scale-110 opacity-0"
              aria-label="Direction Right"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Input Display */}
        <div className="mb-[15px] flex justify-center">
          <div className="w-[250px]">
            <Input
              type="text"
              value={input}
              readOnly
              onKeyDown={handleKeyDown}
              placeholder="Enter Code"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm font-semibold mb-4 text-center">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-[5px] ">
          <Button onClick={handleSubmit}>Submit Code</Button>
          <Button onClick={handleClear} variant="white">
            Clear
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
