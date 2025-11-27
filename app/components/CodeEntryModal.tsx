"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X, Info } from "lucide-react";

const lockImg = "/assets/lock.png";
const DIAL_COLORS = ["red", "yellow", "blue", "green"];
const DIAL_BG_COLORS = ["#701618", "#4db650", "#d8ca4b", "#6289cb"];
const DIAL_START = [7, 7, 7, 7];

interface CodeEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export default function CodeEntryModal({
  open,
  onClose,
  onSubmit,
}: CodeEntryModalProps) {
  const [dials, setDials] = useState(DIAL_START);
  const [error, setError] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleDialClick = (idx: number) => {
    setDials((prev) => {
      const next = [...prev];
      next[idx] = next[idx] === 9 ? 0 : next[idx] + 1;
      return next;
    });
    setError("");
  };

  const handleCodeChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newDials = [...dials];
      newDials[index] = parseInt(value) || 0;
      setDials(newDials);
      setError("");

      // Move to next input automatically
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all 4 dials are filled
      if (index === 3 && value) {
        setTimeout(() => {
          if (newDials.join("") === "1234") {
            onSubmit(newDials.join(""));
            setDials([...DIAL_START]);
            onClose();
          } else {
            setError("Incorrect code. Try again.");
            setDials([...DIAL_START]);
          }
        }, 100);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Move back if user presses Backspace on an empty field
    if (e.key === "Backspace" && dials[index] === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = dials.join("");
    if (code.length !== 4) {
      setError("Please enter all 4 digits.");
      return;
    }
    if (code === "1234") {
      setDials([...DIAL_START]);
      setError("");
      onSubmit(code);
      onClose();
    } else {
      setError("Incorrect code. Try again.");
      setDials([...DIAL_START]);
    }
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
        {/* Animated Lock */}
        <div className="flex justify-center mb-8">
          <div className="relative w-[300px] h-[300px] mx-auto">
            <Image
              src={lockImg}
              alt="Lock"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
            <div className="absolute left-[118px] top-[180px] flex gap-1">
              {dials.map((num, idx) => (
                <div key={idx} className="relative">
                  <input
                    ref={(el) => {
                      if (el) inputRefs.current[idx] = el;
                    }}
                    type="text"
                    value={num}
                    onChange={(e) => handleCodeChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="absolute inset-0 opacity-0 w-6 h-14"
                    maxLength={1}
                    inputMode="numeric"
                  />
                  <button
                    className={`w-6 h-14 flex items-center justify-center font-bold text-xs shadow-lg transition-transform duration-300 hover:scale-110`}
                    style={{
                      backgroundColor: DIAL_BG_COLORS[idx],
                      color: "black",
                      fontWeight: "700",
                      paddingTop: "4px",
                      paddingBottom: "4px",
                      paddingRight: "5px",
                      paddingLeft: "5px",
                      zIndex: 2,
                    }}
                    onClick={() => {
                      handleDialClick(idx);
                      inputRefs.current[idx]?.focus();
                    }}
                    aria-label={`Dial ${idx + 1}`}
                  >
                    {num}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {error && (
          <div className="text-red-500 text-sm font-semibold mb-4 text-center">
            {error}
          </div>
        )}
        <div className="flex justify-center">
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
