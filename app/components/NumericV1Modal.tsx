"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X } from "lucide-react";
import { triggerDialogConfetti } from "../lib/utils/confetti";

const lockImg = "/assets/locks/NumericV1Modal.png";
const unlockImg = "/assets/locks/NumericV1Modal.png";

interface NumericV1ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  lockImage: string;
}

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Row configuration: 3 rows for NumericV1 horizontal layout
const ROW_DATA = [
  { type: "numbers", data: NUMBERS, color: "#b84342" }, // Row 1: Red
  { type: "numbers", data: NUMBERS, color: "#65dd7a" }, // Row 2: Green
  { type: "numbers", data: NUMBERS, color: "#7eb0fc" }, // Row 3: Blue
];

export default function NumericV1Modal({
  open,
  onClose,
  onSubmit,
  lockImage,
}: NumericV1ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [scrollOffsets, setScrollOffsets] = useState<number[]>([0, 0, 0]);
  const [selectedValues, setSelectedValues] = useState<string[]>([
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
      const rowData = ROW_DATA[rowIdx];
      let newOffset = newOffsets[rowIdx] + direction;

      // Wrap around
      if (newOffset < 0) {
        newOffset = rowData.data.length - 1;
      } else if (newOffset >= rowData.data.length) {
        newOffset = 0;
      }

      newOffsets[rowIdx] = newOffset;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[rowIdx] = rowData.data[newOffset];
        return newValues;
      });

      return newOffsets;
    });
  };

  const handleButtonClick = (rowIdx: number, colIdx: number) => {
    setScrollOffsets((prev) => {
      const newOffsets = [...prev];
      const rowData = ROW_DATA[rowIdx];
      let baseIndex = newOffsets[rowIdx];
      let valueIndex =
        (baseIndex + colIdx - 1 + rowData.data.length) % rowData.data.length;

      newOffsets[rowIdx] = valueIndex;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[rowIdx] = rowData.data[valueIndex];
        return newValues;
      });

      return newOffsets;
    });
  };

  const getVisibleValues = (rowIdx: number): string[] => {
    const offset = scrollOffsets[rowIdx];
    const rowData = ROW_DATA[rowIdx];
    const visible: string[] = [];

    for (let i = -1; i <= 1; i++) {
      const idx = (offset + i + rowData.data.length) % rowData.data.length;
      visible.push(rowData.data[idx]);
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
        <DialogContent className="relative rounded-[10px] bg-black p-[6px] border border-[#1E2144] text-white shadow-2xl text-center w-[350px]">
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
            <div className="relative mb-[30px] w-[300px] h-[300px] mx-auto">
              <Image
                src={lockImage}
                alt="NumericV1 Lock"
                fill
                style={{ objectFit: "contain" }}
                priority
              />

              {/* Overlay Scrollable Picker - 3 rows horizontal layout */}
              <div className="absolute top-[190px] left-[140px] flex flex-col gap-[0px]">
                {[0, 1, 2].map((rowIdx) => {
                  const visibleValues = getVisibleValues(rowIdx);
                  const rowData = ROW_DATA[rowIdx];
                  return (
                    <div
                      key={rowIdx}
                      className="flex gap-[0px] items-center"
                      onWheel={(e) => handleScroll(rowIdx, e)}
                    >
                      {/* Left spacer (before first visible value) */}
                      <button
                        onClick={() => handleButtonClick(rowIdx, 0)}
                        className={`h-[20px] w-[22px] flex items-center justify-center text-xs transition-all border-t-[1px] border-b-[1px] border-l-[2px] border-r-[2px] border-t-[#666666] border-b-[#333333] border-l-[#555555] border-r-[#555555] text-[12px] mb-[6px] py-[2px] px-0 rounded-l-[3px]`}
                        style={{
                          backgroundColor: "#b8b8b8",
                          backgroundImage:
                            "linear-gradient(135deg, #d0d0d0 0%, #999999 100%)",
                        }}
                      >
                        {visibleValues[0]}
                      </button>

                      {/* Middle row - focused/selected */}
                      <button
                        onClick={() => handleButtonClick(rowIdx, 1)}
                        className="h-[20px] w-[22px] flex items-center justify-center text-xs opacity-100 transition-all transform scale-105 text-[12px] py-[2px] px-0 border-t-[1px] border-b-[1px] border-l-[2px] border-r-[2px] border-t-[#666666] border-b-[#333333] mb-[6px] border-l-[#555555] border-r-[#555555]"
                        style={{
                          backgroundColor: "#b8b8b8",
                          backgroundImage:
                            "linear-gradient(135deg, #d0d0d0 0%, #999999 100%)",
                        }}
                      >
                        {visibleValues[1]}
                      </button>

                      {/* Right spacer (after second visible value) */}
                      <button
                        onClick={() => handleButtonClick(rowIdx, 2)}
                        className={`h-[20px] w-[22px] flex items-center justify-center text-xs transition-all border-t-[1px] border-b-[1px] border-r-[2px] border-l-[2px] border-t-[#666666] border-b-[#333333] border-l-[#555555] border-r-[#555555] mb-[6px] text-[12px] py-[2px] px-0 rounded-r-[3px]`}
                        style={{
                          backgroundColor: "#b8b8b8",
                          backgroundImage:
                            "linear-gradient(135deg, #d0d0d0 0%, #999999 100%)",
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
              className="bg-[#7B61FF] hover:bg-[#6A50DD] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Submit Code
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
