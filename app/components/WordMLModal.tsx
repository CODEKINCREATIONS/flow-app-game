"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X } from "lucide-react";

interface WordMLModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
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
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Column configuration: 1=alphabets, 2=numbers, 3=alphabets, 4=alphabets, 5=numbers
const COLUMN_DATA = [
  { type: "alphabets", data: ALPHABETS, color: "#56a128" }, // Col 1: Alphabets
  { type: "numbers", data: NUMBERS, color: "#56a128" }, // Col 2: Numbers
  { type: "alphabets", data: ALPHABETS, color: "#56a128" }, // Col 3: Alphabets
  { type: "alphabets", data: ALPHABETS, color: "#56a128" }, // Col 4: Alphabets
  { type: "numbers", data: NUMBERS, color: "#56a128" }, // Col 5: Numbers
];

export default function WordMLModal({
  open,
  onClose,
  onSubmit,
  lockImage,
}: WordMLModalProps) {
  const [scrollOffsets, setScrollOffsets] = useState<number[]>([0, 0, 0, 0, 0]);
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "A",
    "0",
    "A",
    "A",
    "0",
  ]);

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
      let baseIndex = newOffsets[columnIdx];
      let valueIndex =
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

  const handleSubmit = () => {
    const code = selectedValues.join("");
    onSubmit(code);
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

        {/* Lock Image with Overlay Picker */}
        <div className="flex justify-center mb-8">
          <div className="relative w-[300px] h-[300px] mx-auto">
            <Image
              src={lockImage}
              alt="WordML Lock"
              fill
              style={{ objectFit: "contain" }}
              priority
            />

            {/* Overlay Scrollable Picker - 5 columns */}
            <div className="absolute left-[110px] top-[159px] flex gap-1">
              {[0, 1, 2, 3, 4].map((colIdx) => {
                const visibleValues = getVisibleValues(colIdx);
                const columnData = COLUMN_DATA[colIdx];
                return (
                  <div
                    key={colIdx}
                    className="flex flex-col gap-1 items-center"
                    onWheel={(e) => handleScroll(colIdx, e)}
                  >
                    {/* Top spacer (before first visible value) */}
                    <button
                      onClick={() => handleButtonClick(colIdx, 0)}
                      className="w-[8px] h-[27px] flex items-center justify-center text-xs font-bold rounded-lg transition-all border-2 border-[#4e972f]"
                      style={{
                        backgroundColor: columnData.color,
                        color: "white",
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                      }}
                    >
                      {visibleValues[0]}
                    </button>

                    {/* Middle row - focused/selected */}
                    <button
                      onClick={() => handleButtonClick(colIdx, 1)}
                      className="w-[8px] h-[27px] flex items-center justify-center text-xs font-bold rounded-lg opacity-100 transition-all transform scale-105 border-2 border-[#4e972f]"
                      style={{
                        backgroundColor: columnData.color,
                        color: "white",
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                      }}
                    >
                      {visibleValues[1]}
                    </button>

                    {/* Bottom spacer (after second visible value) */}
                    <button
                      onClick={() => handleButtonClick(colIdx, 2)}
                      className="w-[8px] h-[27px] flex items-center justify-center text-xs font-bold rounded-lg transition-all border-2 border-[#4e972f]"
                      style={{
                        backgroundColor: columnData.color,
                        color: "white",
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        paddingLeft: "8px",
                        paddingRight: "8px",
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
        <div className="text-center mb-4 px-4">
          <p className="text-base font-bold text-[#7B61FF]">
            {selectedValues.join("")}
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mb-[30px] px-4">
          <Button
            onClick={handleSubmit}
            className="bg-[#7B61FF] hover:bg-[#6A50DD] text-white font-semibold py-3 px-8 rounded-lg transition-colors mt-6"
          >
            Submit Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
