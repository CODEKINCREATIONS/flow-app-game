"use client";

import React from "react";
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

export default function WordMLModal({
  open,
  onClose,
  onSubmit,
  lockImage,
}: WordMLModalProps) {
  const handleSubmit = () => {
    onSubmit("wordML");
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

        {/* Lock Image */}
        <div className="flex justify-center mb-8">
          <div className="relative w-[300px] h-[300px] mx-auto">
            <Image
              src={lockImage}
              alt="WordML Lock"
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
    </Dialog>
  );
}
