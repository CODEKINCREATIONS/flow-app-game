"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { X, Eye, EyeOff } from "lucide-react";
import { authService } from "@/app/lib/api/services/auth";

interface VideoDialogProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
  password: string;
}

type DialogStage = "password" | "video";

export default function VideoDialog({
  open,
  onClose,
  videoUrl,
  password,
}: VideoDialogProps) {
  const [stage, setStage] = useState<DialogStage>("password");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmitPassword = async () => {
    setError("");

    if (!inputPassword) {
      setError("Please enter a password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.verifyPassword(inputPassword);

      if (response.success) {
        setStage("video");
      } else {
        setError(response.error || "Incorrect password. Please try again.");
        setInputPassword("");
      }
    } catch (err) {
      setError("An error occurred while verifying password. Please try again.");
      console.error("Password verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmitPassword();
    }
  };

  const handleClose = () => {
    setStage("password");
    setInputPassword("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="relative rounded-[10px] p-[50px] bg-[#12142A] border border-[#1E2144] text-white shadow-2xl text-center max-w-2xl">
        {/* Close Button */}
        <X
          onClick={handleClose}
          className="absolute top-[15px] right-[15px] w-6 h-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
        />

        {stage === "password" ? (
          <>
            {/* Password Stage */}
            <DialogHeader>
              <DialogTitle>
                <span className="text-2xl font-bold text-center text-white block">
                  Enter Password
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center text-center space-y-4 ">
              <p className="text-base text-gray-300 px-6 leading-relaxed mb-[25px] font-medium">
                This video is password protected
              </p>

              {/* Password Input Field */}
              <div className="w-full max-w-md relative">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="  Enter password"
                    autoFocus
                    className="w-full !px-[0px] !py-3 pr-[45px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[5px] top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors focus:outline-none bg-transparent border-0 p-0 cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        className="w-5 h-5 stroke-2 text-white"
                        style={{ color: "white" }}
                      />
                    ) : (
                      <Eye
                        className="w-5 h-5 stroke-2 text-white"
                        style={{ color: "white" }}
                      />
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-red-400 text-sm mt-3 font-medium">
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                onClick={handleSubmitPassword}
                disabled={isLoading}
                className="w-full max-w-md !px-8 !py-3 mt-[15px] !text-white hover:!shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Submit Password"}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Video Stage */}
            <div className="flex flex-col items-center text-center space-y-6 mt-6">
              {/* Video Player */}
              <div style={{ width: "600px", height: "400px" }}>
                {true ? (
                  // YouTube Embed
                  <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border-2 border-[#2F3260]">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/1RiVM-sd544?si=lc07a3uA0guEiVIi"
                      title="Video Player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  // MP4/Video File Embed
                  <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border-2 border-[#2F3260]">
                    <video className="w-full h-full" controls autoPlay>
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
