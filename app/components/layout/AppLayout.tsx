"use client";

import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { TimerProvider } from "@/app/lib/context/TimerContext";

interface AppLayoutProps {
  children: ReactNode;
  headerMode?: "default" | "game" | "dashboard";
  playerName?: string;
  showTimer?: boolean;
  showLanguage?: boolean;
  transparentBackground?: boolean;
  customActions?: React.ReactNode;
}

export const AppLayout = ({
  children,
  headerMode = "default",
  playerName,
  showTimer = false,
  showLanguage = false,
  transparentBackground = false,
  customActions,
}: AppLayoutProps) => {
  return (
    <TimerProvider>
      <div
        className={`min-h-screen flex flex-col ${
          transparentBackground ? "bg-transparent" : "bg-[#0F1125]"
        }`}
      >
        <AppHeader
          mode={headerMode}
          playerName={playerName}
          showTimer={showTimer}
          showLanguage={showLanguage}
          customActions={customActions}
        />
        <main className="flex-1">{children}</main>
        <AppFooter />
      </div>
    </TimerProvider>
  );
};
