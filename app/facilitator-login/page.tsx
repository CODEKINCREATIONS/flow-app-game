"use client";

import { Card, Input, Button } from "@/app/components/ui";
import { useAuth } from "@/app/lib/hooks";
import { useState } from "react";
import { validators } from "@/app/lib/utils/validators";

export default function FacilitatorLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { verifySession } = useAuth();

  const handleLogin = async () => {
    // Clear previous messages
    setError("");
    setSuccess("");

    // Validation
    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }

    if (!validators.isValidSessionCode(code.trim())) {
      setError("Invalid code format");
      return;
    }

    setIsLoading(true);

    // Verify session with Azure API
    const result = await verifySession(code.trim());

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || "Invalid session code");
    } else {
      setSuccess("Session verified successfully!");
      // Clear the input after successful verification
      setCode("");
      // Navigation happens in the hook
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/background login.png')" }}
    >
      {/* Full screen layout for login pages */}
      <main className="flex flex-col flex-1 items-center justify-center px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-[#1A1C2A] rounded-full w-[145px] h-[145px] mb-4">
            <img
              src="/assets/Logo_flow.png"
              alt="Flow Logo"
              className="w-[115px] h-[115px] object-contain"
            />
          </div>
          <p className="text-gray-300 mb-9 text-xl">Facilitator Login</p>
        </div>

        {/* Card Section */}
        <Card>
          <div className="space-y-10 w-full">
            {/* Subtitle */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Enter authorization code
              </h2>
            </div>

            {/* Input */}
            <div className="space-y-6">
              <Input
                placeholder="Enter your code here"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                style={{ color: "#FFFFFF", borderColor: "#2A2D3D" }}
              />
            </div>

            {/* Button */}
            <div className="space-y-6 pt-4">
              <Button
                onClick={handleLogin}
                width="w-full"
                className="mt-[10px] text-white "
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Session"}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center mt-6">
                <p className="text-xs text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="text-center mt-6">
                <p className="text-xs text-green-400 font-medium">{success}</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
