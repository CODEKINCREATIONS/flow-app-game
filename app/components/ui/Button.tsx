"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "danger";
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
    "font-bold rounded-[0.3rem] shadow-lg transition-all duration-300 border border-opacity-30 " +
    "hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white";

  const variantClasses =
    variant === "danger"
      ? "bg-gradient-to-r from-[#FF3A3A] to-[#FF6B6B] hover:shadow-[0_0_15px_rgba(255,58,58,0.4)] border-[#FF6B6B]"
      : "bg-gradient-to-r from-[#7B61FF] to-[#3A8DFF] hover:shadow-[0_0_15px_rgba(123,97,255,0.4)] border-[#7B61FF]";

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses} ${width} px-[32px] py-[12px] ${className}`}
      style={{ fontSize: "1.125rem" }}
    >
      {children}
    </button>
  );
}
