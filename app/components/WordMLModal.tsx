"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X, Delete } from "lucide-react";

// Custom styles for button decorative properties
const buttonStylesBase = {
  fontFamily: "'Eurostile', 'Microgramma', 'Arial Black', 'Impact', sans-serif",
  fontStretch: "condensed" as const,
  letterSpacing: "-0.5px",
  textShadow:
    "2px 2px 0px rgba(0, 0, 0, 0.6), -1px -1px 0px rgba(255, 255, 255, 0.3), 3px 3px 5px rgba(0, 0, 0, 0.5)",
};

const buttonTop = {
  ...buttonStylesBase,
  boxShadow: "0 20px 20px rgba(0, 0, 0, 0.3)",
  border: "4px solid transparent",
  borderLeftColor: "#4e972f",
  borderRightColor: "#4e972f",
  borderBottomColor: "#4e972f",
  borderTopColor: "transparent",
  borderTop: "2px solid #b2c8a8",
};

const buttonMiddle = {
  ...buttonStylesBase,
  boxShadow:
    "0 20px 50px rgba(0, 0, 0, 0.3), inset 0 0px 10px 20px rgba(255, 255, 255, 0.1)",
  borderLeftColor: "#3d7a23",
  borderRightColor: "#3d7a23",
  borderBottomColor: "#b7ceadff",
  borderTopColor: "#b7ceadff",
};

const buttonBottom = {
  ...buttonStylesBase,
  border: "4px solid transparent",
  borderLeftColor: "#4e972f",
  borderRightColor: "#4e972f",
  borderTopColor: "#4e972f",
  borderBottomColor: "#4e972f",
  borderBottom: "2px solid #b2c8a8",
};

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

// Tailwind color utilities
const buttonColor = "bg-[#56a128]";
const buttonBorderColor = "border-[#4e972f]";
const buttonBorderColorDark = "border-[#3d7a23]";
const buttonBorderColorLight = "border-[#b7ceadff]";

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
      <DialogContent className="relative rounded-[10px] bg-black p-1.5 border border-[#1E2144] text-white shadow-2xl text-center w-[350px]">
        <div className="flex justify-end mb-8 px-2">
          <X
            onClick={onClose}
            className="w-6 h-6 text-gray-400 hover:text-[#7B61FF] transition-colors cursor-pointer"
          />
        </div>

        {/* Lock Image with Overlay Picker */}
        <div className="flex justify-center mb-8">
          <div className="relative mb-[30px] w-[300px] h-[300px] mx-auto">
            <Image
              src={lockImage}
              alt="Word Lock"
              fill
              className="object-contain"
              priority
            />

            {/* Overlay Scrollable Picker - 5 columns */}
            <div className="absolute left-[90px] top-[146px] flex gap-px">
              {[0, 1, 2, 3, 4].map((colIdx) => {
                const visibleValues = getVisibleValues(colIdx);
                const columnData = COLUMN_DATA[colIdx];
                return (
                  <div
                    key={colIdx}
                    className="flex flex-col gap-px items-center tap-transparent"
                    onWheel={(e) => handleScroll(colIdx, e)}
                  >
                    {/* Top spacer (before first visible value) */}
                    <button
                      onClick={() => handleButtonClick(colIdx, 0)}
                      className={`w-[27px] h-[43px] flex items-center justify-center text-xs transition-all border-b-4 border-[#4e972f] py-0.5 px-1.5 font-black rounded-t-[10px] text-[22px] uppercase outline-none tap-transparent shadow-lg ${
                        colIdx === 0 ? "rounded-tl-[10px]" : ""
                      } ${colIdx === 4 ? "rounded-tr-[10px]" : ""}`}
                      style={{
                        backgroundColor: columnData.color,
                        color: "white",
                        ...buttonTop,
                      }}
                    >
                      {visibleValues[0]}
                    </button>

                    {/* Middle row - focused/selected */}
                    <button
                      onClick={() => handleButtonClick(colIdx, 1)}
                      className="w-[27px] h-[43px] flex items-center justify-center text-xs transition-all transform scale-105 border-4 rounded py-0.5 px-1.5 font-black text-[22px] uppercase outline-none tap-transparent border-[#3d7a23]"
                      style={{
                        backgroundColor: columnData.color,
                        color: "white",
                        ...buttonMiddle,
                      }}
                    >
                      {visibleValues[1]}
                    </button>

                    {/* Bottom spacer (after second visible value) */}
                    <button
                      onClick={() => handleButtonClick(colIdx, 2)}
                      className={`w-[27px] h-[43px] flex items-center justify-center text-xs transition-all border-t-4 border-l-4 border-r-4 border-[#4e972f] py-0.5 px-1.5 font-black rounded-b-[10px] text-[22px] uppercase outline-none tap-transparent my-0.5 ${
                        colIdx === 0 ? "rounded-bl-[10px]" : ""
                      } ${colIdx === 4 ? "rounded-br-[10px]" : ""}`}
                      style={{
                        backgroundColor: columnData.color,
                        color: "white",
                        ...buttonBottom,
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

        {/* Action Buttons */}
        <div className="flex justify-center mb-[50px] gap-1 mb-7.5">
          <Button
            onClick={handleSubmit}
            className="bg-[#7B61FF] hover:bg-[#6A50DD] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Submit Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
