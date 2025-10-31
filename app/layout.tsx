import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TimerProvider } from "@/app/lib/context/TimerContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flow Game - Interactive Learning Platform",
  description: "Join immersive game-based learning sessions with Flow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`bg-background text-textPrimary font-orbitron ${geistSans.variable} ${geistMono.variable}`}
      >
        <TimerProvider>{children}</TimerProvider>
      </body>
    </html>
  );
}
