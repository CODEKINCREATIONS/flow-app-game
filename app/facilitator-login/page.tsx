"use client";

import { Card, Input, Button } from "@/app/components/ui";
import { useAuth } from "@/app/lib/hooks";
import { useState } from "react";
import { validators } from "@/app/lib/utils";

export default function FacilitatorLogin() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { loginFacilitator } = useAuth();

  const handleLogin = async () => {
    // Validation
    if (!code.trim()) {
      setError("Please enter a code");
      return;
    }

    if (!validators.isValidSessionCode(code.trim())) {
      setError("Invalid code format");
      return;
    }

    // Use the auth hook
    const result = await loginFacilitator(code.trim());

    if (!result.success) {
      setError(result.error || "Invalid or already used code");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Full screen layout for login pages */}
      <main className="flex flex-col flex-1 items-center justify-center px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] mb-4">
            FLOW
          </h1>
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
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            {/* Button */}
            <div className="space-y-6 pt-4">
              <Button
                onClick={handleLogin}
                width="w-full"
                className="mt-[10px]"
              >
                Start Session
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center mt-6">
                <p className="text-xs text-red-400 font-medium">{error}</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
