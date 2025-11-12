"use client";
import React, { useState } from "react";
import Image from "next/image";
const lockImg = "/assets/lock.png";

const DIAL_COLORS = ["red", "yellow", "blue", "green"];
const DIAL_START = [7, 7, 7, 7];
const DIAL_RANGE = [6, 7, 8, 9];

export default function AnimatedLock() {
  const [dials, setDials] = useState(DIAL_START);
  // Animate dial change
  const handleDialClick = (idx: number) => {
    setDials((prev) => {
      const next = [...prev];
      next[idx] = next[idx] === 9 ? 6 : next[idx] + 1;
      return next;
    });
  };

  return (
    <div className="relative w-[266px] h-[228px] mx-auto">
      <Image
        src={lockImg}
        alt="Lock"
        fill
        style={{ objectFit: "contain" }}
        priority
      />
      <div className="absolute left-[54px] top-[120px] flex gap-[2px]">
        {dials.map((num, idx) => (
          <button
            key={idx}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg transition-transform duration-300 bg-white border-4 border-${DIAL_COLORS[idx]}-500 hover:scale-110`}
            style={{
              color: DIAL_COLORS[idx],
              marginRight: idx < 3 ? "4px" : undefined,
              zIndex: 2,
            }}
            onClick={() => handleDialClick(idx)}
            aria-label={`Dial ${idx + 1}`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
