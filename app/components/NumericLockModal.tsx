"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X, Delete, Weight } from "lucide-react";

const lockImg = "/assets/locks/NumericLock.png";
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Column configuration: 4 columns with original dial colors and darker borders
const COLUMN_DATA = [
  { type: "numbers", data: NUMBERS, color: "#b84342", borderColor: "#963432" }, // Col 1: Red
  { type: "numbers", data: NUMBERS, color: "#65dd7a", borderColor: "#4fb860" }, // Col 2: Green
  { type: "numbers", data: NUMBERS, color: "#fced56", borderColor: "#e8db4a" }, // Col 3: Yellow
  { type: "numbers", data: NUMBERS, color: "#7eb0fc", borderColor: "#6a9be8" }, // Col 4: Blue
];

interface CodeEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  lockImage?: string;
}

export default function CodeEntryModal({
  open,
  onClose,
  onSubmit,
  lockImage,
}: CodeEntryModalProps) {
  const [scrollOffsets, setScrollOffsets] = useState<number[]>([0, 0, 0, 0]);
  const [selectedValues, setSelectedValues] = useState<string[]>([
    "0",
    "0",
    "0",
    "0",
  ]);
  const [error, setError] = useState("");

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
      setError("");

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
      setError("");

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
    if (code === "1234") {
      setSelectedValues(["0", "0", "0", "0"]);
      setScrollOffsets([0, 0, 0, 0]);
      setError("");
      onSubmit(code);
      onClose();
    } else {
      setError("Incorrect code. Try again.");
      setSelectedValues(["0", "0", "0", "0"]);
      setScrollOffsets([0, 0, 0, 0]);
    }
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
              src={lockImage || lockImg}
              alt="Numeric Lock"
              fill
              style={{ objectFit: "contain" }}
              priority
            />

            {/* Overlay Scrollable Picker - 4 columns */}
            <div className="absolute left-[102px] top-[178px] flex gap-[1px]">
              {[0, 1, 2, 3].map((colIdx) => {
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
                      className="w-[27px] h-[39px] flex items-center justify-center text-lg font-extrabold rounded-lg transition-all"
                      style={{
                        backgroundColor: columnData.color,
                        border: `4px solid ${columnData.borderColor}`,
                        borderTop: "4px solid " + columnData.color,
                        borderLeft:
                          colIdx === 0
                            ? "none"
                            : `4px solid ${columnData.borderColor}`,
                        borderRight:
                          colIdx === 3
                            ? "none"
                            : `4px solid ${columnData.borderColor}`,
                        borderTopLeftRadius: colIdx === 0 ? "8px" : undefined,
                        borderTopRightRadius: colIdx === 3 ? "8px" : undefined,
                        fontWeight: 900,
                        fontSize: "20px",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                    >
                      {visibleValues[0]}
                    </button>

                    {/* Middle row - focused/selected */}
                    <button
                      onClick={() => handleButtonClick(colIdx, 1)}
                      className="w-[27px] h-[39px] flex items-center justify-center text-lg font-extrabold rounded-lg opacity-100 transition-all transform scale-105"
                      style={{
                        backgroundColor: columnData.color,
                        border: `4px solid ${columnData.borderColor}`,
                        borderLeft:
                          colIdx === 0
                            ? "none"
                            : `4px solid ${columnData.borderColor}`,
                        borderRight:
                          colIdx === 3
                            ? "none"
                            : `4px solid ${columnData.borderColor}`,
                        fontWeight: 900,
                        fontSize: "20px",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                    >
                      {visibleValues[1]}
                    </button>

                    {/* Bottom spacer (after second visible value) */}
                    <button
                      onClick={() => handleButtonClick(colIdx, 2)}
                      className="w-[27px] h-[39px] flex items-center justify-center text-lg font-extrabold rounded-lg transition-all"
                      style={{
                        backgroundColor: columnData.color,
                        border: `4px solid ${columnData.borderColor}`,
                        borderBottom: "4px solid " + columnData.color,
                        borderLeft:
                          colIdx === 0
                            ? "none"
                            : `4px solid ${columnData.borderColor}`,
                        borderRight:
                          colIdx === 3
                            ? "none"
                            : `4px solid ${columnData.borderColor}`,
                        fontWeight: 900,
                        fontSize: "20px",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
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
          <p className="text-base font-bold text-[#FFFFFF]">
            {selectedValues.join("")}
          </p>
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
            onClick={() => {
              const newValues = [...selectedValues];
              for (let i = newValues.length - 1; i >= 0; i--) {
                if (newValues[i] !== "0") {
                  newValues[i] = "0";
                  setSelectedValues(newValues);
                  break;
                }
              }
            }}
            variant="danger"
            className="w-10 h-10 p-0 text-[#FFFFFF]"
          >
            <Delete size={30} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
