"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X } from "lucide-react";
import { triggerDialogConfetti } from "../lib/utils/confetti";

interface WordLockModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => Promise<void>;
  lockImage: string;
}

const ALPHABETS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// Column configuration: 1=alphabets, 2=alphabets, 3=alphabets, 4=alphabets, 5=alphabets
const COLUMN_DATA = [
  { type: "alphabets", data: ALPHABETS, color: "#343441" }, // Col 1: Alphabets
  { type: "alphabets", data: ALPHABETS, color: "#343441" }, // Col 2: Alphabets
  { type: "alphabets", data: ALPHABETS, color: "#343441" }, // Col 3: Alphabets
  { type: "alphabets", data: ALPHABETS, color: "#343441" }, // Col 4: Alphabets
  { type: "alphabets", data: ALPHABETS, color: "#343441" }, // Col 5: Alphabets
];

const lockImg = "/assets/locks/WordLock-locked.png";
const unlockImg = "/assets/locks/WordLock-unlocked.png";

export default function WordLockModal({
  open,
  onClose,
  onSubmit,
  lockImage,
}: WordLockModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [scrollOffsets, setScrollOffsets] = useState<number[]>([0, 0, 0, 0, 0]);
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "A",
    "A",
    "A",
    "A",
    "A",
  ]);
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleScroll = (columnIdx: number, e: React.WheelEvent) => {
    e.preventDefault();

    setScrollOffsets((prev) => {
      const newOffsets = [...prev];
      const direction = e.deltaY > 0 ? 1 : -1;
      const columnData = COLUMN_DATA[columnIdx];
      let newOffset = newOffsets[columnIdx] + direction;

      // Wrap around
      if (newOffset < 0) {
        newOffset = columnData.data.length - 1;
      } else if (newOffset >= columnData.data.length) {
        newOffset = 0;
      }

      newOffsets[columnIdx] = newOffset;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[columnIdx] = columnData.data[newOffset];
        return newValues;
      });

      return newOffsets;
    });
  };

  const handleButtonClick = (columnIdx: number, rowIdx: number) => {
    setScrollOffsets((prev) => {
      const newOffsets = [...prev];
      const columnData = COLUMN_DATA[columnIdx];
      const baseIndex = newOffsets[columnIdx];
      const valueIndex =
        (baseIndex + rowIdx - 1 + columnData.data.length) %
        columnData.data.length;

      newOffsets[columnIdx] = valueIndex;
      setSelectedValues((prevValues) => {
        const newValues = [...prevValues];
        newValues[columnIdx] = columnData.data[valueIndex];
        return newValues;
      });

      return newOffsets;
    });
  };

  const getVisibleValues = (columnIdx: number): string[] => {
    const offset = scrollOffsets[columnIdx];
    const columnData = COLUMN_DATA[columnIdx];
    const visible: string[] = [];

    for (let i = -1; i <= 1; i++) {
      const idx =
        (offset + i + columnData.data.length) % columnData.data.length;
      visible.push(columnData.data[idx]);
    }

    return visible;
  };

  const handleSubmit = async () => {
    const code = selectedValues.join("");
    setIsSubmitting(true);

    try {
      await onSubmit(code);
      triggerDialogConfetti(dialogRef.current);
      setIsUnlocked(true);
      setShowCountdown(true);
    } catch (err) {
      console.error("[WordLockModal] Code rejected:", err);
      setError("Incorrect code. Try again.");
      setSelectedValues(["A", "A", "A", "A", "A"]);
      setScrollOffsets([0, 0, 0, 0, 0]);
    } finally {
      setIsSubmitting(false);
    }
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
                src={isUnlocked ? unlockImg : lockImage || lockImg}
                alt="Word Lock"
                fill
                style={{ objectFit: "contain" }}
                priority
              />

              {/* Overlay Scrollable Picker - 5 columns */}
              <div className="absolute left-[94px] top-[179px] flex gap-[0.5px]">
                {[0, 1, 2, 3, 4].map((colIdx) => {
                  const visibleValues = getVisibleValues(colIdx);
                  const columnData = COLUMN_DATA[colIdx];
                  return (
                    <div
                      key={colIdx}
                      className="flex flex-col gap-[1px] items-center"
                      onWheel={(e) => handleScroll(colIdx, e)}
                    >
                      {/* Top spacer (before first visible value) */}
                      <button
                        onClick={() => handleButtonClick(colIdx, 0)}
                        className={`w-[25px] h-[40px] flex items-center justify-center text-xs transition-all border-l-4 border-r-4 border-b-4 border-t-[2px] border-[#1e1e28] border-t-[#575876] text-white font-bold text-[25px] py-[2px] px-2 rounded-t-[10px] text-[#ffffff] ${
                          colIdx === 0 ? "rounded-tl-[10px]" : ""
                        } ${colIdx === 4 ? "rounded-tr-[10px]" : ""}`}
                        style={{
                          backgroundColor: columnData.color,
                          fontFamily:
                            "'Condensed', 'Arial Condensed', sans-serif",
                          boxShadow: "0 20px 20px rgba(0, 0, 0, 0.3)",
                          fontWeight: 700,
                        }}
                      >
                        {visibleValues[0]}
                      </button>

                      {/* Middle row - focused/selected */}
                      <button
                        onClick={() => handleButtonClick(colIdx, 1)}
                        className="w-[25px] h-[40px] flex items-center justify-center text-xs opacity-100 transition-all transform scale-105 rounded-[1px] text-white font-bold text-[29px] py-[2px] px-2 border-t-4 border-b-4 border-l-4 border-r-4 border-t-[#5f5c7c] border-b-[#5f5c7c] border-l-[#201f2a] border-r-[#201f2a] text-[#ffffff]"
                        style={{
                          backgroundColor: columnData.color,
                          fontFamily:
                            "'Condensed', 'Arial Condensed', sans-serif",
                          boxShadow:
                            "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 0px 10px 20px rgba(255, 255, 255, 0.1)",
                          fontWeight: 700,
                        }}
                      >
                        {visibleValues[1]}
                      </button>

                      {/* Bottom spacer (after second visible value) */}
                      <button
                        onClick={() => handleButtonClick(colIdx, 2)}
                        className={`w-[25px] h-[40px] flex items-center justify-center text-xs transition-all border-t-4 border-l-4 border-r-4 border-[#1e1e28] border-b-[2px] border-b-[#575876] rounded-b-[10px] text-white font-bold text-[24px] py-[2px] px-2 text-[#ffffff] ${
                          colIdx === 0 ? "rounded-bl-[10px]" : ""
                        } ${colIdx === 4 ? "rounded-br-[10px]" : ""}`}
                        style={{
                          backgroundColor: columnData.color,
                          fontFamily:
                            "'Condensed', 'Arial Condensed', sans-serif",
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

          {/* Selected Code Display */}

          {/* Error Message */}
          {error && !isUnlocked && (
            <div className="text-red-500 text-sm font-semibold mb-[4px] text-center">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-[5px] mb-[30px]">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#7B61FF] hover:bg-[#6A50DD] text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Submit Code"}
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}
