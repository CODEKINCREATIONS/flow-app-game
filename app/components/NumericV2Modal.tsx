"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import { X } from "lucide-react";
import { triggerDialogConfetti } from "@/app/lib/utils/confetti";

const unlockImg = "/assets/images/NumericLock-unlocked.png";

interface NumericV2ModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  lockImage: string;
}

export default function NumericV2Modal({
  open,
  onClose,
  onSubmit,
  lockImage,
}: NumericV2ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState<string>("0000");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      onClose();
      setIsUnlocked(false);
      setCountdown(5);
      setShowCountdown(false);
    }
  }, [showCountdown, countdown, onClose]);

  const handleSubmit = () => {
    triggerDialogConfetti(dialogRef.current);
    setIsUnlocked(true);
    setShowCountdown(true);
    onSubmit("numericV2");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <div ref={dialogRef}>
        <DialogContent className="relative rounded-[10px] bg-[#12142A] p-[6px] border border-[#1E2144] text-white shadow-2xl text-center w-[350px]">
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

          {/* Lock Image */}
          <div className="flex justify-center mb-8">
            <div className="relative w-[300px] h-[300px] mx-auto">
              <Image
                src={isUnlocked ? unlockImg : lockImage}
                alt="NumericV2 Lock"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
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
