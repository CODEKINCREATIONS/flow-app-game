"use client";

import React, { useState, useRef } from "react";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X, Info } from "lucide-react";

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
  const [code, setCode] = useState(["", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleCodeChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input automatically
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Move back if user presses Backspace on an empty field
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    onSubmit(code.join(""));
    setCode(["", "", ""]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="relative rounded-[10px] p-[50px] bg-[#12142A] border border-[#1E2144] text-white shadow-2xl text-center w-[420px]">
        {/* Top-left icons (Info + X) */}
        <div className="absolute top-2 left-2 flex items-center gap-2 text-gray-400">
          <Info className="w-5 h-5 hover:text-white transition cursor-pointer" />
          <X
            onClick={onClose}
            className="w-5 h-5 hover:text-white transition cursor-pointer"
          />
        </div>

        {/* Lock Image */}
        <div className="flex justify-center mb-6 mt-[60px]">
          <img
            src="/assets/lock-image.png"
            alt="Lock Icon"
            className="w-[250px] h-[250px] object-contain mx-auto"
          />
        </div>

        {/* 3-Digit Code Inputs */}
        <div className="flex justify-center gap-[20px] mb-[40px]">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-[60px] h-[60px] text-center text-2xl font-bold 
                         bg-[#181A33] border border-[#2F3260] rounded-lg 
                         focus:outline-none focus:border-[#7B61FF] 
                         transition text-white caret-white placeholder-transparent"
              style={{
                color: "#FFFFFF", // ✅ ensures typed text is pure white
                caretColor: "#7B61FF",
              }}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            width="w-[180px]"
            className="bg-[#7B61FF] text-white hover:bg-[#6A4EFF]"
          >
            Submit Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
