"use client";

import { useState } from "react";
import Card from "@/app/components/ui/Card";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

export default function PlayerLogin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("");

  const handleLogin = () => {
    if (!name.trim() || !email.trim()) return;
    console.log("Player Info:", { name, email, language });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1125] text-white">
      <main className="flex flex-col flex-1 items-center justify-center px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] mb-4">
            FLOW
          </h1>
          <p className="text-gray-300 mb-9 text-xl">Player Login</p>
        </div>

        {/* Login Card */}
        <Card>
          <div className="space-y-10 w-full pr-[60px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Enter your details
              </h2>
            </div>

            {/* Input Fields */}
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300 mb-[5px] mt-[10px]">
                  Name
                </label>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-gray-300 placeholder-gray-400 bg-[#0F111A] border-2 border-[#2A2D3D] rounded-[0.3rem] focus:border-[#7B61FF] focus:ring-2 focus:ring-[#7B61FF] focus:ring-opacity-20 transition-all duration-300"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300 mb-[5px] mt-[10px]">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-gray-300 placeholder-gray-400 bg-[#0F111A] border-2 border-[#2A2D3D] rounded-[0.3rem] focus:border-[#7B61FF] focus:ring-2 focus:ring-[#7B61FF] focus:ring-opacity-20 transition-all duration-300"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-300 mb-[5px] mt-[10px]">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-5 py-[11px] bg-[#0F111A] border-2 border-[#2A2D3D] rounded-[0.3rem] text-gray-300 placeholder-gray-400 focus:outline-none focus:border-[#7B61FF] focus:ring-2 focus:ring-[#7B61FF] focus:ring-opacity-20 transition-all duration-300 text-lg appearance-none"
                  style={{ color: language ? "#D1D5DB" : "#9CA3AF" }}
                >
                  <option value="" className="text-gray-400 bg-[#0F111A]">
                    Select language
                  </option>
                  <option value="en" className="text-gray-300 bg-[#0F111A]">
                    EN — English
                  </option>
                  <option value="pt" className="text-gray-300 bg-[#0F111A]">
                    PT — Português
                  </option>
                  <option value="fr" className="text-gray-300 bg-[#0F111A]">
                    FR — Français
                  </option>
                </select>
              </div>
            </div>

            {/* Button Section */}
            <div className="pt-4">
              <Button
                disabled={!name.trim() || !email.trim()}
                onClick={handleLogin}
                className="mt-[10px]"
                width="w-full" // ✅ takes full width
              >
                Join Game
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
