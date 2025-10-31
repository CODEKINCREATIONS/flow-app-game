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
      <DialogContent className="relative rounded-[10px] bg-[#12142A] p-[30px] border border-[#1E2144] text-white shadow-2xl text-center w-[420px] p-6">
        <div className="flex justify-between items-center mb-8 px-2">
          <Info className="w-6 h-6 text-gray-400 hover:text-[#7B61FF] transition-colors cursor-pointer" />
          <X
            onClick={onClose}
            className="w-6 h-6 text-gray-400 hover:text-[#7B61FF] transition-colors cursor-pointer"
          />
        </div>
        {/* Lock Image */}
        <div className="flex justify-center mb-6">
          <img
            src="/assets/lock-image.png"
            alt="Lock Icon"
            className="w-[250px] h-[250px] object-contain mx-auto"
          />
        </div>
        {/* 3-Digit Code Inputs */}
        <div className="flex justify-center gap-[20px] mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-[60px] h-[60px] text-center text-[50px] font-['Orbitron']
                         bg-[#181A33] border border-[#2F3260] rounded-lg 
                         focus:outline-none focus:border-[#7B61FF] 
                         transition text-white caret-[#7B61FF] placeholder-transparent"
              style={{
                color: "#FFFFFF",
              }}
            />
          ))}
        </div>
        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            width="w-[250px]"
            className="bg-[#7B61FF] text-white hover:bg-[#6A4EFF] mt-[20px] mb-[30px]"
          >
            Submit Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
