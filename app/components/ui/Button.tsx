"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "neon" | "white";
  width?: string;
}

export default function Button({
  children,
  variant = "primary",
  width = "w-auto",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-bold shadow-lg transition-all duration-300 " +
    "hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white";

  const variantClasses =
    variant === "danger"
      ? "bg-gradient-to-r from-[#FF3A3A] to-[#FF6B6B] hover:shadow-[0_0_20px_rgba(255,58,58,0.25)] rounded-[0.35rem] border-2 border-[#FF6B6B] ring-1 ring-[#FF6B6B]/25"
      : variant === "neon"
      ? "bg-[#00FF00] text-black font-semibold relative p-[2px] mt-[4px] mb-[4px] rounded-[35px] overflow-hidden before:absolute before:inset-[2px] before:bg-[#00FF00] before:rounded-[15px] before:z-[1] hover:before:bg-[#00FF00]/90 after:absolute after:inset-0 after:bg-[#ffffff]/20 after:rounded-[12px] after:z-0"
      : variant === "white"
      ? "bg-white text-black hover:bg-gray-50 rounded-[0.35rem] shadow-sm"
      : "bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] hover:shadow-[0_0_20px_rgba(58,141,255,0.25)] rounded-[0.35rem] border-2 border-[#7B61FF] ring-1 ring-[#7B61FF]/25";
  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses} ${width} ${className}`}
      style={{ fontSize: "1.125rem" }}
    >
      <span className="relative z-10 px-[32px] font-['Orbitron']  py-[12px] flex items-center justify-center">
        {children}
      </span>
    </button>
  );
}
