"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui";
import { useAuth } from "@/app/lib/hooks";
import { LogOut, User, Clock } from "lucide-react";
import { useTimer } from "@/app/lib/hooks/useTimer";
import { useState } from "react";

interface AppHeaderProps {
  mode?: "default" | "game" | "dashboard";
  playerName?: string;
  showTimer?: boolean;
  showLanguage?: boolean;
  customActions?: React.ReactNode;
}

export const AppHeader = ({
  mode = "default",
  playerName,
  showTimer = false,
  showLanguage = false,
  customActions,
}: AppHeaderProps) => {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { formatted } = useTimer({ autoStart: true });
  const [language, setLanguage] = useState("en");

  // Don't show header on login pages
  if (
    pathname?.includes("/facilitator-login") ||
    pathname?.includes("/playerlogin")
  ) {
    return null;
  }

  // Game Mode Header
  if (mode === "game") {
    return (
      <header className="sticky top-0 z-50 w-full bg-[#0F1125] text-white border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 gap-2 sm:gap-3 md:gap-4">
          {/* Left: Player Name */}
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-400 tracking-wide text-left truncate">
            {playerName || "Player"}
          </h1>

          {/* Center: Timer */}
          {showTimer && (
            <div className="flex justify-center">
              <div className="flex items-center gap-1 sm:gap-2 bg-white/5 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg">
                <Clock className="w-3 h-3 sm:w-4 h-4 md:w-5 h-5 text-gray-300" />
                <span className="font-mono text-gray-100 font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
                  {formatted}
                </span>
              </div>
            </div>
          )}

          {/* Right: Language Selector or User Actions */}
          <div className="flex justify-end">
            {showLanguage ? (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-white rounded-md border border-gray-700 px-2 py-1.5 sm:px-3 sm:py-2 md:px-5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 transition-all duration-300"
              >
                <option value="en">EN — English</option>
                <option value="pt">PT — Português</option>
                <option value="fr">FR — Français</option>
              </select>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                {isAuthenticated && (
                  <Button
                    variant="danger"
                    onClick={logout}
                    className="!px-2 !py-1 sm:!px-3 sm:!py-1.5 !text-xs sm:!text-sm"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Dashboard Mode Header
  if (mode === "dashboard") {
    return (
      <header className="sticky top-0 z-50 w-full bg-[#0F1125] border-b border-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-5">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: Dashboard Title */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wide text-white truncate">
              Facilitator Dashboard
            </h1>

            {/* Center: Timer */}
            {showTimer && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg">
                  <Clock className="text-purple-400 w-4 h-4 sm:w-5 h-5" />
                  <span className="font-mono text-xs sm:text-sm md:text-base text-gray-100">
                    {formatted}
                  </span>
                </div>
              </div>
            )}

            {/* Right: Custom Actions */}
            <div className="flex justify-end items-center gap-2 sm:gap-3 md:gap-4">
              {customActions || (
                <div className="flex items-center space-x-2">
                  {isAuthenticated && (
                    <Button
                      variant="danger"
                      onClick={logout}
                      className="!px-3 !py-1.5 !text-xs sm:!text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline ml-2">Logout</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Default Mode Header (general layout)
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F1125] border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center min-h-[48px] sm:min-h-[56px] md:min-h-[64px]">
          {/* Logo/Home */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] bg-clip-text text-transparent">
                FLOW
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`transition-colors hover:text-[#7B61FF] ${
                pathname === "/" ? "text-[#7B61FF]" : "text-gray-300"
              }`}
            >
              Home
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-2 text-xs sm:text-sm text-gray-300">
                  <User className="w-4 h-4" />
                  <span className="text-[#4CC9F0]">{user?.name || "User"}</span>
                </div>
                <Button
                  variant="danger"
                  onClick={logout}
                  className="!px-2 !py-1 sm:!px-3 sm:!py-1.5 !text-xs sm:!text-sm"
                >
                  <LogOut className="w-3 h-3 sm:w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link href="/facilitator-login">
                  <Button
                    variant="primary"
                    className="!px-2 !py-1 sm:!px-3 sm:!py-1.5 md:!px-4 md:!py-2 !text-xs sm:!text-sm"
                  >
                    <span className="hidden xs:inline">Facilitator</span>
                    <span className="xs:hidden">Facil</span>
                  </Button>
                </Link>
                <Link href="/playerlogin">
                  <Button
                    variant="primary"
                    className="!px-2 !py-1 sm:!px-3 sm:!py-1.5 md:!px-4 md:!py-2 !text-xs sm:!text-sm"
                  >
                    Player
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
