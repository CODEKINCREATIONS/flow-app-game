"use client";
import Button from "@/app/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";

interface SessionExpiredDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SessionExpiredDialog({
  open,
  onClose,
  onConfirm,
}: SessionExpiredDialogProps) {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .session-expired-dialog {
            width: 250px !important;
          }
        }
      `}</style>
      <Dialog open={open} onClose={onClose}>
        <DialogContent className="session-expired-dialog relative rounded-[10px] p-[30px] bg-[#12142A] border border-[#1E2144] text-white shadow-2xl text-center max-w-sm">
          <div className="flex flex-col items-center text-center space-y-8">
            <AlertTriangle className="w-16 h-16 text-yellow-400" />

            <p className="text-2xl text-white px-4 leading-relaxed font-medium">
              Session Expired
            </p>

            <p className="text-sm text-gray-300 px-4">
              The game session has ended. Please return to the dashboard to
              start a new session.
            </p>

            {/* Action Button */}
            <div className="flex gap-4 mt-[20px] mb-[10px] justify-center w-full">
              <Button
                variant="primary"
                onClick={onConfirm}
                className="flex items-center justify-center px-[5px] py-[3px] font-semibold"
              >
                <span className="text-lg">Return to Login Page</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
