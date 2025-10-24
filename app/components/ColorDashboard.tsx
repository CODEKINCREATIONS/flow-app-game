"use client";

import React from "react";

const colors = [
  { name: "Background", code: "#0F111A" },
  { name: "Surface", code: "#1A1C25" },
  { name: "Primary", code: "#7B61FF" },
  { name: "Secondary", code: "#3A8DFF" },
  { name: "Text Primary", code: "#FFFFFF" },
  { name: "Accent", code: "#4CC9F0" },
];

export default function ColorDashboard() {
  return (
    <div className="min-h-screen bg-background text-textPrimary p-10 font-orbitron">
      <h1 className="text-3xl font-bold mb-10 text-center">
        🎨 Color Dashboard
      </h1>

      <div className="flex flex-wrap justify-center">
        {colors.map((color, i) => (
          <div
            key={i}
            className={`w-[200px] h-[200px] rounded-xl border border-surface shadow-glow 
                        flex flex-col items-center justify-center cursor-pointer
                        hover:scale-110 transition-transform duration-300
                        p-4 m-[10px] mt-[200px]`}
            style={{ backgroundColor: color.code }}
          >
            <span
              className={`text-[11px] font-semibold text-center ${
                color.code === "#FFFFFF" ? "text-black" : "text-white"
              }`}
            >
              {color.name}
            </span>
            <span
              className={`text-[9px] mt-1 ${
                color.code === "#FFFFFF" ? "text-gray-700" : "text-gray-200"
              }`}
            >
              {color.code}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
