"use client";
import Button from "@/app/components/ui/Button";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Share2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface QRCodeModalProps {
  open: boolean;
  onClose: () => void;
  sessionCode: string;
}

export default function QRCodeModal({
  open,
  onClose,
  sessionCode,
}: QRCodeModalProps) {
  const [sessionUrl, setSessionUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionUrl(`${window.location.origin}/player?session=${sessionCode}`);
    }
  }, [sessionCode]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join FLOW Game",
          text: "Scan this QR code to join the game session!",
          url: sessionUrl,
        });
      } catch (err) {
        console.error("Sharing failed:", err);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="relative rounded-[10px] p-[50px] bg-[#12142A] border border-[#1E2144] text-white shadow-2xl text-center">
        {/* ❌ icon in top-right corner */}
        <X
          onClick={onClose}
          className="top-4 right-4 cursor-pointer text-gray-400 hover:text-white transition w-5 h-5"
        />

        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center text-white">
            Session QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center space-y-6 mt-[5px]">
          <div className="bg-[#0B0D22] p-[6px] rounded-xl">
            {sessionUrl && (
              <QRCodeSVG
                value={sessionUrl}
                size={180}
                level="H"
                includeMargin
                fgColor="#7C3AED"
              />
            )}
          </div>

          <p className="text-sm text-gray-400 px-6 leading-relaxed">
            Ask players to scan this QR code with their phone cameras to join
            the session.
          </p>

          <Button
            variant="primary"
            className="flex items-center justify-center gap-2 mt-[5px] mb-[30px]"
            onClick={handleShare}
          >
            Share QR Code
            <Share2 className="h-4 w-4 ml-[5px]" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
