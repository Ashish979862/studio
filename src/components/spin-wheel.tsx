"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface SpinWheelProps {
  segments: { value: string | number; label: string }[];
  rotation: number;
  spinning: boolean;
}

const SpinWheel: React.FC<SpinWheelProps> = ({
  segments,
  rotation,
  spinning,
}) => {
  const segmentCount = segments.length;
  const segmentAngle = 360 / segmentCount;
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
  ];

  const getSegmentStyle = (index: number) => {
    return {
      transform: `rotate(${index * segmentAngle}deg) skewY(${
        90 - segmentAngle
      }deg)`,
      background: colors[index % colors.length],
    };
  };

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
      <div
        className="absolute w-full h-full rounded-full border-8 border-accent shadow-xl overflow-hidden transition-transform duration-[4000ms] ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {segments.map((_, index) => (
          <div
            key={index}
            className="absolute w-1/2 h-1/2 origin-bottom-right"
            style={getSegmentStyle(index)}
          ></div>
        ))}

        {segments.map((segment, index) => (
          <div
            key={index}
            className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center"
            style={{ transform: `rotate(${index * segmentAngle + segmentAngle / 2}deg) translate(-50%, -25%)` }}
          >
             <span 
                className="font-bold text-sm md:text-base -rotate-90"
                style={{ color: (index) % 2 === 0 ? "hsl(var(--card-foreground))" : "hsl(var(--card-foreground))" }}
             >
                {segment.label}
             </span>
          </div>
        ))}
      </div>
      
      <div className="absolute w-4 h-4 bg-accent -top-1 rounded-bl-full rounded-br-full z-10" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)'}}></div>
      <div className="absolute w-16 h-16 rounded-full bg-background border-4 border-accent flex items-center justify-center font-bold text-accent-foreground text-lg shadow-inner z-10">
        SPIN
      </div>
    </div>
  );
};

export default SpinWheel;
