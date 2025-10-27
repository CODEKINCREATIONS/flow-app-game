"use client";

import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

interface AppLayoutProps {
  children: ReactNode;
  headerMode?: "default" | "game" | "dashboard";
  playerName?: string;
  showTimer?: boolean;
  showLanguage?: boolean;
  customActions?: React.ReactNode;
}

export const AppLayout = ({
  children,
  headerMode = "default",
  playerName,
  showTimer = false,
  showLanguage = false,
  customActions,
}: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1125]">
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
  );
};
