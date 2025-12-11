"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X } from "lucide-react";
import { triggerDialogConfetti } from "@/app/lib/utils/confetti";

const unlockImg = "/assets/locks/NumericV2-Unlocked.png";

interface NumericV2ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  lockImage: string;
}

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function NumericV2Modal({
  open,
  onClose,
  onSubmit,
  lockImage,
}: NumericV2ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [scrollOffsets, setScrollOffsets] = useState<number[]>([0, 0, 0, 0]);
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "0",
    "0",
    "0",
    "0",
  ]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showCountdown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showCountdown && countdown === 0) {
      onClose();
      setIsUnlocked(false);
      setCountdown(5);
      setShowCountdown(false);
    }
    return () => clearTimeout(timer);
  }, [showCountdown, countdown, onClose]);

  const handleScroll = (rowIdx: number, e: React.WheelEvent) => {
    e.preventDefault();

    setScrollOffsets((prev) => {
      const newOffsets = [...prev];
      const direction = e.deltaY > 0 ? 1 : -1;
      let newOffset = newOffsets[rowIdx] + direction;

      // Wrap around
      if (newOffset < 0) {
        newOffset = NUMBERS.length - 1;
      } else if (newOffset >= NUMBERS.length) {
        newOffset = 0;
      }

      newOffsets[rowIdx] = newOffset;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[rowIdx] = NUMBERS[newOffset];
        return newValues;
      });

      return newOffsets;
    });
  };

  const handleButtonClick = (rowIdx: number, colIdx: number) => {
    setScrollOffsets((prev) => {
      const newOffsets = [...prev];
      let baseIndex = newOffsets[rowIdx];
      let valueIndex =
        (baseIndex + colIdx - 1 + NUMBERS.length) % NUMBERS.length;

      newOffsets[rowIdx] = valueIndex;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[rowIdx] = NUMBERS[valueIndex];
        return newValues;
      });

      return newOffsets;
    });
  };

  const getVisibleValues = (rowIdx: number): string[] => {
    const offset = scrollOffsets[rowIdx];
    const visible: string[] = [];

    for (let i = -1; i <= 1; i++) {
      const idx = (offset + i + NUMBERS.length) % NUMBERS.length;
      visible.push(NUMBERS[idx]);
    }

    return visible;
  };

  const handleSubmit = () => {
    const code = selectedValues.join("");
    triggerDialogConfetti(dialogRef.current);
    setIsUnlocked(true);
    setShowCountdown(true);
    onSubmit(code);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div ref={dialogRef}>
        <DialogContent className="relative rounded-[10px] bg-[#121416] p-[6px] border border-[#1E2144] text-white shadow-2xl text-center w-[350px]">
          {showCountdown && (
            <div className="absolute top-10 left-6 text-sm font-bold text-[#dc2626]">
              {countdown}s
            </div>
          )}
          <div className="flex justify-end mb-8 px-2 relative">
            <div
              className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-[#7B61FF] to-[#6A50DD] rounded-full ${
                isUnlocked ? "animate-pulse" : ""
              }`}
            />
            <X
              onClick={onClose}
              className="relative z-10 w-6 h-6 text-gray-400 hover:text-[#7B61FF] transition-colors cursor-pointer"
            />
          </div>

          {/* Lock Image with Overlay Picker */}
          <div className="flex justify-center mb-8">
            <div className="relative mb-[30px] w-[350px] h-[350px] mx-auto">
              <Image
                src={isUnlocked ? unlockImg : lockImage}
                alt="NumericV2 Lock"
                fill
                style={{ objectFit: "contain" }}
                priority
              />

              {/* Overlay Scrollable Picker - 4 rows vertical layout */}
              <div className="absolute top-[220px] left-[175px] flex flex-col gap-[1px]">
                {[0, 1, 2, 3].map((rowIdx) => {
                  const visibleValues = getVisibleValues(rowIdx);
                  return (
                    <div
                      key={rowIdx}
                      className="flex gap-[1px] items-center"
                      onWheel={(e) => handleScroll(rowIdx, e)}
                    >
                      {/* Left spacer (before first visible value) */}
                      <button
                        onClick={() => handleButtonClick(rowIdx, 0)}
                        className={`h-[18px] w-[20px] flex items-center justify-center text-xs transition-all border-t-[2px] border-b-[2px] border-l-[3px] border-r-[2px] border-t-[#030508] border-b-[#030508] border-l-[#363636] border-r-[#363636] text-[16px] text-[#fff] mb-[6px] py-[2px] px-0 rounded-l-[5px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3)] bg-[#121416]`}
                        style={{
                          fontWeight: 700,
                        }}
                      >
                        {visibleValues[0]}
                      </button>

                      {/* Middle row - focused/selected */}
                      <button
                        onClick={() => handleButtonClick(rowIdx, 1)}
                        className="h-[18px] w-[20px] flex items-center justify-center text-xs opacity-100 transition-all transform scale-105 text-[20px] text-[#fff] py-[2px] px-0 border-t-[2px] border-b-[2px] border-l-[3px] border-r-[2px] border-t-[#030508] border-b-[#030508] mb-[6px] border-l-[#363636] border-r-[#363636] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.9),inset_-1px_-1px_3px_rgba(0,0,0,0.5),0_3px_6px_rgba(0,0,0,0.4)] bg-[#121416]"
                        style={{
                          fontWeight: 700,
                        }}
                      >
                        {visibleValues[1]}
                      </button>

                      {/* Right spacer (after second visible value) */}
                      <button
                        onClick={() => handleButtonClick(rowIdx, 2)}
                        className={`h-[18px] w-[20px] flex items-center justify-center text-xs transition-all border-t-[2px] border-b-[2px] border-r-[3px] border-l-[2px] border-t-[#030508] border-b-[#030508] border-l-[#363636] border-r-[#363636] mb-[6px] text-[16px] text-[#fff] py-[2px] px-0 rounded-r-[7px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3)] bg-[#121416]`}
                        style={{
                          fontWeight: 700,
                        }}
                      >
                        {visibleValues[2]}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mb-[30px]">
            <Button
              onClick={handleSubmit}
              className="bg-[#7B61FF] hover:bg-[#6A50DD] text-white font-semibold py-3 px-8 rounded-lg transition-colors mt-6"
            >
              Submit Code
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
